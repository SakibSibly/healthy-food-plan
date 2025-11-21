from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from app.models import User, MealPlan, MealPlanItem, InventoryItem
from app.api.deps import get_current_user
from app.db import get_session
from app.meal_optimizer import MealOptimizer, FoodDatabase
from typing import Annotated, List, Optional
from sqlmodel import Session, select, Field, SQLModel
import uuid
from datetime import datetime, timedelta


class MealPlanCreate(SQLModel):
    name: str = Field(max_length=100)
    description: str | None = Field(default=None, max_length=500)
    duration_days: int = Field(default=7, ge=1, le=30)
    target_budget: float = Field(ge=0.0)


class MealPlanOptimizeRequest(SQLModel):
    target_budget: float = Field(ge=0.0, description="Weekly budget for meal planning")
    duration_days: int = Field(default=7, ge=1, le=30, description="Number of days to plan")
    use_inventory: bool = Field(default=True, description="Whether to use inventory items")


class MealPlanResponse(SQLModel):
    id: uuid.UUID
    name: str
    description: str | None
    start_date: str
    end_date: str
    target_budget: float
    total_cost: float
    status: str
    created_at: str
    items_count: int


class MealPlanDetailResponse(MealPlanResponse):
    items: List[MealPlanItem]


class OptimizedMealPlanResponse(SQLModel):
    meal_plan: MealPlanResponse
    meal_items: List[MealPlanItem]
    shopping_list: List[dict]
    total_cost: float
    budget_remaining: float
    budget_utilization: float
    nutrition_analysis: dict
    alternatives: List[dict]
    inventory_usage: dict


router = APIRouter(
    prefix="/meal-plans",
    tags=["meal planning"]
)


@router.post("/optimize", response_model=OptimizedMealPlanResponse)
def optimize_meal_plan(
    request: MealPlanOptimizeRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """
    Generate an optimized weekly meal plan based on budget, inventory, and nutrition requirements.
    
    This endpoint:
    - Optimizes meals to fit within the specified budget
    - Prioritizes using available inventory items to reduce waste
    - Ensures minimum nutrition requirements are met
    - Suggests alternatives based on cost data
    - Provides a shopping list with estimated costs
    """
    try:
        # Get user's inventory items
        inventory_items = []
        if request.use_inventory:
            statement = select(InventoryItem).where(InventoryItem.user_id == current_user.id)
            db_items = session.exec(statement).all()
            inventory_items = [
                {
                    'id': str(item.id),
                    'name': item.name,
                    'quantity': item.quantity,
                    'cost': item.cost,
                    'category': item.category,
                    'expiration_date': item.expiration_date
                }
                for item in db_items
            ]
        
        # Initialize meal optimizer
        optimizer = MealOptimizer(
            budget=request.target_budget,
            inventory_items=inventory_items,
            dietary_restrictions=current_user.dietary_restrictions,
            dietary_pref=current_user.dietary_pref
        )
        
        # Generate optimized meal plan
        optimization_result = optimizer.optimize_weekly_plan()
        
        # Create meal plan record
        start_date = datetime.now().date()
        end_date = start_date + timedelta(days=request.duration_days - 1)
        
        meal_plan = MealPlan(
            name=f"Optimized Plan - {start_date.strftime('%b %d, %Y')}",
            description=f"AI-optimized meal plan generated with ${request.target_budget} budget",
            start_date=start_date.isoformat(),
            end_date=end_date.isoformat(),
            target_budget=request.target_budget,
            total_cost=optimization_result['total_cost'],
            status="active",
            user_id=current_user.id,
            created_at=datetime.now().isoformat()
        )
        
        session.add(meal_plan)
        session.commit()
        session.refresh(meal_plan)
        
        # Create meal plan items
        meal_items_list = []
        for item_data in optimization_result['meal_plan_items']:
            meal_item = MealPlanItem(
                meal_plan_id=meal_plan.id,
                day_of_week=item_data['day_of_week'],
                meal_type=item_data['meal_type'],
                food_name=item_data['food_name'],
                quantity=item_data['quantity'],
                unit=item_data['unit'],
                estimated_cost=item_data['estimated_cost'],
                calories=item_data.get('calories'),
                protein=item_data.get('protein'),
                carbs=item_data.get('carbs'),
                fats=item_data.get('fats'),
                uses_inventory=item_data['uses_inventory'],
                inventory_item_id=uuid.UUID(item_data['inventory_item_id']) if item_data.get('inventory_item_id') else None,
                notes=item_data.get('notes')
            )
            session.add(meal_item)
            meal_items_list.append(meal_item)
        
        session.commit()
        
        # Refresh all items to get IDs
        for item in meal_items_list:
            session.refresh(item)
        
        # Prepare response
        meal_plan_response = MealPlanResponse(
            id=meal_plan.id,
            name=meal_plan.name,
            description=meal_plan.description,
            start_date=meal_plan.start_date,
            end_date=meal_plan.end_date,
            target_budget=meal_plan.target_budget,
            total_cost=meal_plan.total_cost,
            status=meal_plan.status,
            created_at=meal_plan.created_at,
            items_count=len(meal_items_list)
        )
        
        return OptimizedMealPlanResponse(
            meal_plan=meal_plan_response,
            meal_items=meal_items_list,
            shopping_list=optimization_result['shopping_list'],
            total_cost=optimization_result['total_cost'],
            budget_remaining=optimization_result['budget_remaining'],
            budget_utilization=optimization_result['budget_utilization'],
            nutrition_analysis=optimization_result['nutrition_analysis'],
            alternatives=optimization_result['alternatives'],
            inventory_usage=optimization_result['inventory_usage']
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate meal plan: {str(e)}"
        )


@router.get("/", response_model=List[MealPlanResponse])
def get_meal_plans(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
    status_filter: Optional[str] = None
):
    """Get all meal plans for the current user."""
    statement = select(MealPlan).where(MealPlan.user_id == current_user.id)
    
    if status_filter:
        statement = statement.where(MealPlan.status == status_filter)
    
    meal_plans = session.exec(statement).all()
    
    # Get item counts for each meal plan
    response_plans = []
    for plan in meal_plans:
        items_statement = select(MealPlanItem).where(MealPlanItem.meal_plan_id == plan.id)
        items_count = len(session.exec(items_statement).all())
        
        response_plans.append(MealPlanResponse(
            id=plan.id,
            name=plan.name,
            description=plan.description,
            start_date=plan.start_date,
            end_date=plan.end_date,
            target_budget=plan.target_budget,
            total_cost=plan.total_cost,
            status=plan.status,
            created_at=plan.created_at,
            items_count=items_count
        ))
    
    return response_plans


@router.get("/{plan_id}", response_model=MealPlanDetailResponse)
def get_meal_plan(
    plan_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Get a specific meal plan with all items."""
    statement = select(MealPlan).where(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    )
    meal_plan = session.exec(statement).first()
    
    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found"
        )
    
    # Get meal plan items
    items_statement = select(MealPlanItem).where(MealPlanItem.meal_plan_id == plan_id)
    items = session.exec(items_statement).all()
    
    return MealPlanDetailResponse(
        id=meal_plan.id,
        name=meal_plan.name,
        description=meal_plan.description,
        start_date=meal_plan.start_date,
        end_date=meal_plan.end_date,
        target_budget=meal_plan.target_budget,
        total_cost=meal_plan.total_cost,
        status=meal_plan.status,
        created_at=meal_plan.created_at,
        items_count=len(items),
        items=list(items)
    )


@router.put("/{plan_id}/status")
def update_meal_plan_status(
    plan_id: uuid.UUID,
    status: str,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Update meal plan status (active, completed, archived)."""
    if status not in ['active', 'completed', 'archived']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be 'active', 'completed', or 'archived'"
        )
    
    statement = select(MealPlan).where(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    )
    meal_plan = session.exec(statement).first()
    
    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found"
        )
    
    meal_plan.status = status
    session.add(meal_plan)
    session.commit()
    session.refresh(meal_plan)
    
    return {"message": f"Meal plan status updated to {status}"}


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal_plan(
    plan_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Delete a meal plan and all its items."""
    statement = select(MealPlan).where(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    )
    meal_plan = session.exec(statement).first()
    
    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found"
        )
    
    # Delete meal plan items first
    items_statement = select(MealPlanItem).where(MealPlanItem.meal_plan_id == plan_id)
    items = session.exec(items_statement).all()
    for item in items:
        session.delete(item)
    
    # Delete meal plan
    session.delete(meal_plan)
    session.commit()
    
    return None


@router.get("/food-database/search")
def search_food_database(
    query: str,
    category: Optional[str] = None
):
    """Search the food database for available foods."""
    foods = []
    
    for name, data in FoodDatabase.FOODS.items():
        # Filter by category if specified
        if category and data['category'] != category:
            continue
        
        # Filter by search query
        if query.lower() in name.lower():
            foods.append({
                'name': name.replace('_', ' ').title(),
                'category': data['category'],
                'cost_per_100g': data['cost_per_100g'],
                'calories': data['calories'],
                'protein': data['protein'],
                'serving_size': data['serving_size'],
                'unit': data['unit']
            })
    
    return foods


@router.get("/food-database/categories")
def get_food_categories():
    """Get all food categories."""
    categories = set()
    for data in FoodDatabase.FOODS.values():
        categories.add(data['category'])
    
    return sorted(list(categories))
