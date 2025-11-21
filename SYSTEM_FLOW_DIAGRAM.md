# AI Meal Optimization Engine - System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                                  │
│                     (Frontend - MealPlanner.jsx)                        │
└────────────────────────────┬────────────────────────────────────────────┘
                            │
                            │ 1. Request Optimization
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API ENDPOINT                                     │
│                 POST /meal-plans/optimize                               │
│                                                                          │
│  Input:                                                                  │
│  • target_budget: 100.0                                                 │
│  • duration_days: 7                                                     │
│  • use_inventory: true                                                  │
└────────────────────────────┬────────────────────────────────────────────┘
                            │
                            │ 2. Fetch User Data
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE                                        │
│                                                                          │
│  Retrieve:                                                              │
│  • User Profile (dietary restrictions, preferences)                     │
│  • Inventory Items (quantities, costs, expiration dates)               │
└────────────────────────────┬────────────────────────────────────────────┘
                            │
                            │ 3. Initialize Optimizer
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      MEAL OPTIMIZER ENGINE                              │
│                   (meal_optimizer.py)                                   │
│                                                                          │
│  Components:                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │ Nutrition Rules  │  │  Food Database   │  │ Scoring System   │    │
│  │                  │  │                  │  │                  │    │
│  │ • Daily reqs     │  │ • 40+ foods      │  │ • Cost: 40%      │    │
│  │ • Min/max values │  │ • Nutrition data │  │ • Inventory: 30% │    │
│  │ • Meal dist.     │  │ • Pricing        │  │ • Nutrition: 30% │    │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘    │
└────────────────────────────┬────────────────────────────────────────────┘
                            │
                            │ 4. Optimization Process
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    OPTIMIZATION ALGORITHM                                │
│                                                                          │
│  FOR each day (0-6):                                                    │
│    FOR each meal (breakfast, lunch, dinner, snack):                    │
│      1. Check dietary restrictions                                      │
│      2. Score all compatible foods:                                     │
│         • Calculate cost efficiency                                     │
│         • Check inventory availability                                  │
│         • Validate nutrition balance                                    │
│         • Add quality bonuses (protein, fiber)                         │
│      3. Select highest scoring foods                                    │
│      4. Update daily nutrition totals                                   │
│      5. Deduct from remaining budget                                    │
│      6. Mark inventory items as used                                    │
│                                                                          │
│  Output: 28 meal items (7 days × 4 meals)                              │
└────────────────────────────┬────────────────────────────────────────────┘
                            │
                            │ 5. Post-Processing
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      ANALYSIS & GENERATION                              │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Shopping List Generation                                         │  │
│  │ • Aggregate non-inventory items                                  │  │
│  │ • Calculate total quantities                                     │  │
│  │ • Estimate costs                                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Nutrition Analysis                                               │  │
│  │ • Validate daily requirements                                    │  │
│  │ • Calculate weekly averages                                      │  │
│  │ • Generate nutrition score (0-100)                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Alternative Suggestions                                          │  │
│  │ • Identify expensive items                                       │  │
│  │ • Find cheaper alternatives                                      │  │
│  │ • Calculate potential savings                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Inventory Usage Stats                                            │  │
│  │ • Count inventory-based meals                                    │  │
│  │ • Calculate cost savings                                         │  │
│  │ • Measure waste reduction                                        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────────┘
                            │
                            │ 6. Persist to Database
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE                                        │
│                                                                          │
│  Save:                                                                  │
│  • MealPlan record (metadata, budget, costs)                           │
│  • 28 MealPlanItem records (individual meals with nutrition)           │
└────────────────────────────┬────────────────────────────────────────────┘
                            │
                            │ 7. Return Complete Result
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API RESPONSE                                      │
│                                                                          │
│  {                                                                       │
│    "meal_plan": { ... },              // Plan metadata                 │
│    "meal_items": [ ... ],             // 28 meal items                 │
│    "shopping_list": [ ... ],          // Items to purchase             │
│    "total_cost": 87.50,               // Total plan cost               │
│    "budget_remaining": 12.50,         // Savings                       │
│    "budget_utilization": 87.5,        // % of budget used              │
│    "nutrition_analysis": { ... },     // Daily & weekly nutrition      │
│    "alternatives": [ ... ],           // Cost-saving options           │
│    "inventory_usage": { ... }         // Waste reduction stats         │
│  }                                                                       │
└────────────────────────────┬────────────────────────────────────────────┘
                            │
                            │ 8. Display Results
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                                  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Summary Cards                                                    │  │
│  │ [Total Cost] [Remaining] [Utilization] [Nutrition Score]        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Weekly Meal Calendar                                             │  │
│  │ Monday   | Breakfast | Lunch | Dinner | Snack                   │  │
│  │ Tuesday  | ...                                                   │  │
│  │ ...                                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Shopping List                                                    │  │
│  │ • Item 1: 500g @ $5.00                                           │  │
│  │ • Item 2: 300g @ $3.50                                           │  │
│  │ ...                                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Cost-Saving Alternatives                                         │  │
│  │ Instead of Salmon ($12): Try Tofu (Save $8)                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                           SCORING ALGORITHM
═══════════════════════════════════════════════════════════════════════════

Starting Score: 100 points

┌─────────────────────────────────────────────────────────────────────────┐
│ COST EFFICIENCY (40% weight)                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ IF serving_cost > remaining_budget:                                     │
│   score -= 40                                                           │
│ ELSE:                                                                    │
│   cost_ratio = serving_cost / remaining_budget                         │
│   score -= (cost_ratio × 20)                                           │
│                                                                          │
│ Lower cost relative to budget = Higher score                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ INVENTORY USAGE (30% weight)                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ IF food_in_inventory:                                                   │
│   score += 30                                                           │
│   IF expiring_soon:                                                     │
│     score += 10  (prioritize waste reduction)                          │
│                                                                          │
│ Using inventory items = Higher score                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ NUTRITIONAL BALANCE (30% weight)                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ required_calories = meal_requirement(meal_type)                        │
│ actual_calories = food_calories × serving_size                         │
│ cal_diff = |actual - required| / required                              │
│ score -= (cal_diff × 15)                                               │
│                                                                          │
│ Closer to target calories = Higher score                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ QUALITY BONUSES                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ IF protein_content >= 15g:                                              │
│   score += 10  (high protein bonus)                                    │
│                                                                          │
│ IF fiber_content >= 3g:                                                 │
│   score += 5   (high fiber bonus)                                      │
│                                                                          │
│ Nutritious foods = Bonus points                                        │
└─────────────────────────────────────────────────────────────────────────┘

Final Score: max(0, score)  // Clamped to 0 minimum

Higher scoring foods are selected for each meal!


═══════════════════════════════════════════════════════════════════════════
                         DATA FLOW EXAMPLE
═══════════════════════════════════════════════════════════════════════════

User Input:
  Budget: $100/week
  Inventory: Chicken (500g), Rice (1kg), Broccoli (300g)

Day 1, Breakfast Selection:
  ┌─────────────────────────────────────────────────────────────────┐
  │ Candidate: Oatmeal                                              │
  │ • Cost: $0.09 (50g @ $0.18/100g)                               │
  │ • In Inventory: No                                              │
  │ • Calories: 195 (target: 500 for breakfast)                    │
  │ • Protein: 8.5g  Fiber: 5.3g                                   │
  │                                                                  │
  │ Score Calculation:                                              │
  │ 100 - (cost penalty) + 0 + (nutrition penalty) + fiber bonus    │
  │ = 100 - 5 + 0 - 10 + 5 = 90 points ✓ SELECTED                 │
  └─────────────────────────────────────────────────────────────────┘

Day 1, Lunch Selection:
  ┌─────────────────────────────────────────────────────────────────┐
  │ Candidate: Chicken Breast                                       │
  │ • Cost: $1.80 (150g @ $1.20/100g)                              │
  │ • In Inventory: YES (500g available)                           │
  │ • Calories: 248 (target: 700 for lunch)                        │
  │ • Protein: 46.5g  Fiber: 0g                                    │
  │                                                                  │
  │ Score Calculation:                                              │
  │ 100 - 8 + 30 (inventory) - 12 + 10 (protein) + 0               │
  │ = 120 points ✓ SELECTED (inventory priority!)                  │
  └─────────────────────────────────────────────────────────────────┘

Result After 7 Days:
  • 28 meals planned
  • Cost: $87.50 (under budget!)
  • Inventory items used: 8 meals
  • Cost saved: $15.25
  • Nutrition score: 85/100
  • Shopping list: 15 items needed

═══════════════════════════════════════════════════════════════════════════
```
