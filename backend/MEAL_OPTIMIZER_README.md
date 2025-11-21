# AI Meal Optimization Engine

## Overview

The AI Meal Optimization Engine is a sophisticated feature that generates personalized weekly meal plans optimized for budget, nutrition, and inventory management. It intelligently reduces food waste by prioritizing available inventory items and provides cost-saving alternatives.

## Features

### 1. Budget-Optimized Meal Planning
- Generate weekly meal plans that fit within specified budgets
- Track budget utilization in real-time
- Smart cost allocation across different meal types
- Identify cost-saving opportunities

### 2. Inventory Integration
- Automatically prioritize using items from user's inventory
- Reduce food waste by using items before expiration
- Track inventory usage statistics
- Calculate cost savings from inventory usage

### 3. Nutritional Balance
- Ensure minimum daily nutritional requirements are met
- Balance macronutrients (protein, carbs, fats) across meals
- Track fiber intake and micronutrients
- Provide nutrition scoring (0-100)

### 4. Smart Shopping Lists
- Generate categorized shopping lists with estimated costs
- Exclude items already in inventory
- Organize by food categories for efficient shopping
- Track total shopping costs

### 5. Cost-Saving Alternatives
- Suggest cheaper alternatives for expensive items
- Maintain nutritional equivalence
- Calculate potential savings per alternative
- Stay within the same food category

## Architecture

### Backend Components

#### 1. **Models** (`app/models.py`)
- `MealPlan`: Stores meal plan metadata and budget information
- `MealPlanItem`: Individual meal items with nutritional data

#### 2. **Meal Optimizer** (`app/meal_optimizer.py`)
- `NutritionRules`: Defines daily nutritional requirements and validation
- `FoodDatabase`: Comprehensive database of 40+ foods with nutritional data
- `MealOptimizer`: Core optimization engine with scoring algorithms

#### 3. **API Routes** (`app/api/routes/meal_plans.py`)
- `POST /meal-plans/optimize`: Generate optimized meal plan
- `GET /meal-plans/`: List all user meal plans
- `GET /meal-plans/{plan_id}`: Get detailed meal plan
- `PUT /meal-plans/{plan_id}/status`: Update plan status
- `DELETE /meal-plans/{plan_id}`: Delete meal plan
- `GET /meal-plans/food-database/search`: Search food database
- `GET /meal-plans/food-database/categories`: Get food categories

### Frontend Components

#### **MealPlanner Page** (`src/pages/MealPlanner.jsx`)
- Three-tab interface: Create, My Plans, Details
- Real-time budget tracking with progress bars
- Interactive weekly meal calendar
- Shopping list with cost breakdown
- Nutrition analysis visualization
- Alternative suggestions display

## Optimization Algorithm

### Scoring System

The meal optimizer uses a multi-factor scoring system (0-100 points):

```python
score = 100.0
score -= cost_efficiency_penalty     # 40% weight
score += inventory_usage_bonus       # 30% weight
score -= nutritional_balance_penalty # 30% weight
score += protein_content_bonus       # up to +10
score += fiber_content_bonus         # up to +5
```

### Factors Considered:

1. **Cost Efficiency (40%)**
   - Serving cost vs. remaining budget
   - Penalizes expensive choices
   - Rewards budget-friendly options

2. **Inventory Usage (30%)**
   - +30 points for using inventory items
   - +10 additional points for expiring items
   - Prioritizes waste reduction

3. **Nutritional Balance (30%)**
   - Compares calories to meal-specific requirements
   - Validates macronutrient distribution
   - Ensures balanced nutrition across days

4. **Quality Bonuses**
   - High protein content (≥15g): +10 points
   - High fiber content (≥3g): +5 points

### Meal Composition Strategy

#### Breakfast
- Grain (oatmeal, bread)
- Protein (eggs, yogurt)
- Fruit (banana, berries)
- Dairy (milk, yogurt)

#### Lunch & Dinner
- Protein (chicken, fish, tofu)
- Grain (rice, pasta)
- 2x Vegetables (variety)

#### Snacks
- Fruit or healthy fats

## Nutrition Database

The system includes 40+ foods across 6 categories:

### Categories
- **Protein**: Chicken, eggs, salmon, beef, tofu, nuts
- **Grains**: Brown rice, oats, pasta, bread
- **Vegetables**: Broccoli, spinach, carrots, peppers, tomatoes
- **Fruits**: Bananas, apples, oranges, berries
- **Dairy**: Milk, yogurt, cheese
- **Fats**: Avocado, olive oil

### Nutritional Data Per Food
- Calories
- Protein (g)
- Carbohydrates (g)
- Fats (g)
- Fiber (g)
- Cost per 100g/ml
- Standard serving size

## API Usage Examples

### Generate Optimized Meal Plan

```bash
POST /meal-plans/optimize
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_budget": 100.0,
  "duration_days": 7,
  "use_inventory": true
}
```

### Response Structure

```json
{
  "meal_plan": {
    "id": "uuid",
    "name": "Optimized Plan - Dec 15, 2024",
    "total_cost": 87.50,
    "target_budget": 100.0,
    "items_count": 28
  },
  "meal_items": [...],
  "shopping_list": [...],
  "budget_remaining": 12.50,
  "budget_utilization": 87.5,
  "nutrition_analysis": {
    "weekly_averages": {...},
    "overall_score": 85
  },
  "inventory_usage": {
    "meals_from_inventory": 8,
    "estimated_cost_saved": 15.25
  },
  "alternatives": [...]
}
```

## Database Schema

### MealPlan Table
```sql
- id: UUID (PK)
- name: VARCHAR(100)
- description: VARCHAR(500)
- start_date: VARCHAR(20)
- end_date: VARCHAR(20)
- target_budget: FLOAT
- total_cost: FLOAT
- status: VARCHAR(20) [active, completed, archived]
- user_id: UUID (FK)
- created_at: VARCHAR(30)
```

### MealPlanItem Table
```sql
- id: UUID (PK)
- meal_plan_id: UUID (FK)
- day_of_week: INT [0-6]
- meal_type: VARCHAR(20) [breakfast, lunch, dinner, snack]
- food_name: VARCHAR(100)
- quantity: FLOAT
- unit: VARCHAR(20)
- estimated_cost: FLOAT
- calories: FLOAT
- protein: FLOAT
- carbs: FLOAT
- fats: FLOAT
- uses_inventory: BOOLEAN
- inventory_item_id: UUID (nullable)
- notes: VARCHAR(200)
```

## Configuration

### Nutritional Requirements (Customizable)

```python
DAILY_REQUIREMENTS = {
    'calories': {'min': 1800, 'max': 2500, 'optimal': 2000},
    'protein': {'min': 50, 'max': 150, 'optimal': 75},
    'carbs': {'min': 225, 'max': 325, 'optimal': 275},
    'fats': {'min': 44, 'max': 78, 'optimal': 65},
    'fiber': {'min': 25, 'max': 35, 'optimal': 30}
}
```

### Meal Distribution

```python
MEAL_DISTRIBUTION = {
    'breakfast': 0.25,  # 25% of daily calories
    'lunch': 0.35,      # 35% of daily calories
    'dinner': 0.35,     # 35% of daily calories
    'snack': 0.05       # 5% of daily calories
}
```

## Dietary Restrictions Support

The optimizer respects user dietary preferences:

- **Vegetarian**: Excludes meat and fish
- **Vegan**: Excludes all animal products
- **Gluten-Free**: Excludes bread and pasta
- **Dairy-Free/Lactose-Free**: Excludes dairy products

Configure in user profile: `dietary_restrictions` field

## Future Enhancements

### Potential Improvements

1. **Machine Learning Integration**
   - Learn from user preferences and feedback
   - Personalized recommendations based on consumption history
   - Predict optimal portions based on household size

2. **External API Integration**
   - Real-time pricing from grocery stores
   - Seasonal produce recommendations
   - Local availability checking

3. **Advanced Nutrition**
   - Micronutrient tracking (vitamins, minerals)
   - Allergen warnings and substitutions
   - Medical condition-specific meal plans

4. **Social Features**
   - Share meal plans with family members
   - Community recipes and meal ideas
   - Collaborative shopping lists

5. **Smart Automation**
   - Auto-generate weekly plans based on schedule
   - Integration with calendar for meal timing
   - Automatic inventory deduction after meals

## Performance Optimization

### Current Implementation
- In-memory optimization (< 1 second for 7-day plan)
- Database-backed persistence
- Efficient scoring algorithm with O(n) complexity

### Scalability Considerations
- Can handle 100+ foods in database
- Supports plans up to 30 days
- Optimized for concurrent users

## Testing

### Manual Testing Checklist

1. **Budget Optimization**
   - [ ] Plan stays within budget
   - [ ] Budget tracking is accurate
   - [ ] Cost distribution is balanced

2. **Inventory Usage**
   - [ ] Inventory items are prioritized
   - [ ] Expiring items used first
   - [ ] Cost savings calculated correctly

3. **Nutrition**
   - [ ] Daily minimums met
   - [ ] Balanced macronutrient distribution
   - [ ] Nutrition score accurate

4. **Shopping List**
   - [ ] Only non-inventory items included
   - [ ] Quantities aggregated correctly
   - [ ] Costs calculated accurately

5. **Alternatives**
   - [ ] Suggestions are valid substitutes
   - [ ] Savings calculated correctly
   - [ ] Same category maintained

## Troubleshooting

### Common Issues

**Issue**: Plan exceeds budget
- **Solution**: Reduce duration days or increase budget
- **Check**: Inventory items are being used

**Issue**: Nutritional requirements not met
- **Solution**: Ensure diverse food categories in database
- **Check**: Dietary restrictions aren't too limiting

**Issue**: No alternatives suggested
- **Solution**: Add more foods to the same categories
- **Check**: Cost variance in category

## Contributing

When adding new features to the meal optimizer:

1. Update `FoodDatabase.FOODS` with accurate nutritional data
2. Test scoring algorithm with new constraints
3. Validate nutrition calculations
4. Update API documentation
5. Add frontend visualization if needed

## License

This feature is part of the Healthy Food Plan application.
