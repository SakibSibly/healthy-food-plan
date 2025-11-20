from fastapi import Depends
from fastapi.routing import APIRouter
from fastapi import HTTPException
from app.models import User, InventoryItem, FoodLog
from app.api.deps import get_current_user
from app.db import get_session
from typing import Annotated
from sqlmodel import Session, select, Field, SQLModel
import uuid
from datetime import datetime


class InventoryItemCreate(SQLModel):
    name: str = Field(max_length=100)
    category: str | None = Field(default=None, max_length=50)
    quantity: float = Field(default=0.0, ge=0.0)
    cost: float = Field(default=None, ge=0.0)
    expiration_date: str | None = Field(default=None, max_length=20)
    notes: str | None = Field(default=None, max_length=200)


class FoodLogCreate(SQLModel):
    inventory_item_id: uuid.UUID = Field(description="ID of the inventory item being consumed")
    quantity: float = Field(ge=0.0)
    notes: str | None = Field(default=None, max_length=500)


router = APIRouter(
    prefix="/actions",
    tags=["user features"]
)


# Inventory endpoints

@router.post("/inventory/", response_model=InventoryItem)
def add_inventory_item(
    item: InventoryItemCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Add an item to the user's inventory."""
    db_item = InventoryItem(
        name=item.name,
        category=item.category,
        quantity=item.quantity,
        cost=item.cost,
        expiration_date=item.expiration_date,
        notes=item.notes,
        user_id=current_user.id
    )
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.get("/inventory/", response_model=list[InventoryItem])
def get_inventory_items(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Get all inventory items for the current user."""
    items = session.exec(
        select(InventoryItem).where(InventoryItem.user_id == current_user.id)
    ).unique().all()
    return items


@router.get("/inventory/{item_id}", response_model=InventoryItem)
def get_inventory_item(
    item_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Get a specific inventory item by ID for the current user."""
    item = session.get(InventoryItem, item_id)
    if item is None or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/inventory/{item_id}", response_model=InventoryItem)
def update_inventory_item(
    item_id: uuid.UUID,
    item_data: InventoryItemCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Update an inventory item for the current user."""
    item = session.get(InventoryItem, item_id)
    if item is None or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update fields
    item.name = item_data.name
    item.category = item_data.category
    item.quantity = item_data.quantity
    item.cost = item_data.cost
    item.expiration_date = item_data.expiration_date
    item.notes = item_data.notes
    
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.delete("/inventory/{item_id}", status_code=204)
def delete_inventory_item(
    item_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Delete an inventory item for the current user."""
    item = session.get(InventoryItem, item_id)
    if item is None or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")
    
    session.delete(item)
    session.commit()
    return None


# Food Log endpoints

@router.post("/logs/", response_model=FoodLog, status_code=201)
def create_food_log(
    log_data: FoodLogCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Create a new food consumption log from inventory item."""
    # Get the inventory item
    inventory_item = session.get(InventoryItem, log_data.inventory_item_id)
    
    # Validate inventory item exists and belongs to user
    if not inventory_item or inventory_item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    # Validate sufficient quantity
    if inventory_item.quantity < log_data.quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient quantity. Available: {inventory_item.quantity}, Requested: {log_data.quantity}"
        )
    
    # Update inventory quantity
    inventory_item.quantity -= log_data.quantity
    
    # If quantity reaches zero, optionally delete or keep the item
    if inventory_item.quantity <= 0:
        session.delete(inventory_item)
    else:
        session.add(inventory_item)
    
    # Create food log
    current_time = datetime.now().isoformat()
    db_log = FoodLog(
        item_name=inventory_item.name,
        quantity=log_data.quantity,
        unit="units",  # You can enhance this with unit tracking
        category=inventory_item.category or "other",
        notes=log_data.notes,
        consumed_at=current_time,
        created_at=current_time,
        inventory_item_id=log_data.inventory_item_id,
        user_id=current_user.id
    )
    session.add(db_log)
    session.commit()
    session.refresh(db_log)
    return db_log


@router.get("/logs/", response_model=list[FoodLog])
def get_food_logs(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
    limit: int | None = None):
    """Get all food logs for the current user."""
    query = select(FoodLog).where(FoodLog.user_id == current_user.id).order_by(FoodLog.created_at.desc())
    
    if limit:
        query = query.limit(limit)
    
    logs = session.exec(query).unique().all()
    return logs


@router.get("/logs/{log_id}", response_model=FoodLog)
def get_food_log(
    log_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Get a specific food log by ID."""
    log = session.get(FoodLog, log_id)
    if log is None or log.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Food log not found")
    return log


@router.put("/logs/{log_id}", response_model=FoodLog)
def update_food_log(
    log_id: uuid.UUID,
    log_data: FoodLogCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Update a food log."""
    log = session.get(FoodLog, log_id)
    if log is None or log.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Food log not found")
    
    log.item_name = log_data.item_name
    log.quantity = log_data.quantity
    log.unit = log_data.unit
    log.category = log_data.category
    log.notes = log_data.notes
    if log_data.consumed_at:
        log.consumed_at = log_data.consumed_at
    
    session.add(log)
    session.commit()
    session.refresh(log)
    return log


@router.delete("/logs/{log_id}", status_code=204)
def delete_food_log(
    log_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Delete a food log."""
    log = session.get(FoodLog, log_id)
    if log is None or log.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Food log not found")
    
    session.delete(log)
    session.commit()
    return None
