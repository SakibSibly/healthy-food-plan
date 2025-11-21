# Database Seeding Guide

## Quick Start

### Run the Seed Script

```bash
cd backend
py -m uv run python seed_database.py
```

### What Gets Created

The script generates realistic sample data for analytics testing:

#### **Food Logs** (90+ entries over 30 days)
- ✅ Realistic consumption patterns
- ✅ Weekend fruit consumption spikes
- ✅ Weekday grain increases
- ✅ Category variations (fruit, vegetable, grain, protein, dairy)
- ✅ Time-based meal logging (breakfast, lunch, dinner, snacks)
- ✅ Intentional imbalances for testing (high protein, low veggies)

#### **Inventory Items** (15+ items)
- ✅ **Critical Risk** (2-3 days): Spinach, Strawberries, Milk
- ✅ **High Risk** (4-6 days): Chicken, Peppers, Yogurt, Lettuce
- ✅ **Medium Term** (10-21 days): Broccoli, Carrots, Eggs, Cheese
- ✅ **Long Term** (180+ days): Rice, Pasta, Oatmeal, Quinoa

## Sample Data Patterns

### Weekly Consumption Pattern

```
Day         Multiplier  Description
Monday      1.0         Normal consumption
Tuesday     0.9         Slightly lower
Wednesday   1.0         Normal
Thursday    1.1         Slightly higher
Friday      1.2         Higher (weekend prep)
Saturday    1.4         Weekend spike ⬆️
Sunday      1.3         Weekend
```

### Category Distribution

**Fruits**: 60% increase on weekends  
**Grains**: 20% increase on weekdays  
**Vegetables**: Lower than recommended (triggers alert)  
**Protein**: Higher than recommended (triggers alert)  

### Expected Analytics Results

After seeding, you should see:

#### ✅ Weekly Trends
- "High consumption on Saturdays"
- "High fruit intake on weekends"

#### ✅ Consumption Patterns
- "Low vegetable intake: 1.5 vs recommended 3.0"
- "High protein intake: 3.5 vs recommended 2.0"

#### ✅ Waste Predictions
- 3 items expiring within 3 days (critical)
- 4 items expiring within 7 days (high risk)
- Recommendations: "Urgent: Use Spinach today!"

#### ✅ Balance Check
- Flags: "Low vegetable consumption: 12.3% of diet"
- Health Score: ~70/100

#### ✅ Heatmap Data
- 7-day × 5-category matrix
- Visual representation of consumption patterns

## Usage Flow

```bash
# Step 1: Make sure you're registered in the app
# Visit http://localhost:5173 and create an account

# Step 2: Run the seed script
cd backend
py -m uv run python seed_database.py

# Output:
# ✓ Using existing user: username
# ⚠️  WARNING: This will clear all existing data!
# Continue? (yes/no): yes
# ✓ Cleared 0 food logs and 0 inventory items
# ✓ Generated 95 food log entries over 30 days
# ✓ Generated 15 inventory items
#   - Critical risk: 3 items
#   - High risk: 4 items
#   - Medium term: 4 items
#   - Long term: 4 items
# ✓ Added consumption imbalance patterns
# ✅ Database seeding completed successfully!

# Step 3: Check the results
# Navigate to Analytics page
# Navigate to Meal Planner (inventory will be used)
```

## Testing Different Scenarios

### Scenario 1: Fresh Start (Default)
```bash
py -m uv run python seed_database.py
# Answer 'yes' to clear existing data
```

### Scenario 2: Keep Existing Data
```bash
# Edit seed_database.py
# Comment out: seeder.clear_existing_data(user)
py -m uv run python seed_database.py
```

### Scenario 3: More Data (60 days)
```bash
# Edit seed_database.py, line with generate_food_logs
# Change: days=30 to days=60
py -m uv run python seed_database.py
```

### Scenario 4: Extreme Imbalance
```bash
# Edit seed_database.py
# In generate_consumption_imbalance(), change range(10) to range(30)
py -m uv run python seed_database.py
```

## Customization

### Add More Food Items

Edit `FOOD_ITEMS` dictionary in `seed_database.py`:

```python
FOOD_ITEMS = {
    'fruit': [
        ('Apple', 'piece', 150),
        ('Your Food', 'unit', quantity),  # Add here
    ],
    # ... other categories
}
```

### Adjust Patterns

Edit pattern multipliers:

```python
DAY_PATTERNS = {
    0: 1.2,    # Monday - increase
    5: 1.8,    # Saturday - bigger spike
}

WEEKEND_FRUIT_BOOST = 2.0  # Even more fruit on weekends
```

### Change Inventory Risk Levels

Edit item expiration days:

```python
critical_items = [
    ('Item', 'category', quantity, cost, 1),  # Expires in 1 day
]
```

## Verification

After seeding, verify data was created:

### Check Food Logs
```bash
# Via API
curl http://localhost:8000/actions/food-logs/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Inventory
```bash
# Via API
curl http://localhost:8000/actions/inventory/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Analytics
```bash
# Via API
curl http://localhost:8000/actions/analytics/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check via UI
1. Login to http://localhost:5173
2. Navigate to "Food Logs" → See 90+ entries
3. Navigate to "Inventory" → See 15+ items
4. Navigate to "Analytics" → See complete analysis
5. Navigate to "Meal Planner" → Generate plan using inventory

## Troubleshooting

### "No user found"
**Solution**: Register a user first through the web app at http://localhost:5173/register

### Database connection error
**Solution**: Ensure PostgreSQL is running and database credentials in `.env` are correct

### "ModuleNotFoundError"
**Solution**: Make sure you're in the backend directory and have installed dependencies
```bash
cd backend
py -m uv pip install -r requirements.txt  # or similar
```

### Data looks wrong in Analytics
**Solution**: 
1. Check that seeding completed without errors
2. Refresh the Analytics page
3. Try re-running the seed script

## Sample Output

```
============================================================
DATA GENERATION SUMMARY
============================================================

User: testuser

Food Logs: 95 total entries
  Category breakdown:
    • dairy: 15 entries
    • fruit: 25 entries
    • grain: 20 entries
    • protein: 20 entries
    • vegetable: 15 entries

Inventory Items: 15 items

============================================================
NEXT STEPS
============================================================

1. Navigate to the Analytics page in your app
2. You should see:
   ✓ Weekly trend patterns (weekend fruit spike)
   ✓ Consumption imbalances (high protein, low veggies)
   ✓ Waste predictions (critical items expiring soon)
   ✓ Dietary balance flags
   ✓ Heatmap visualization data

3. Test the Meal Planner with this inventory
   ✓ It will prioritize using expiring items
   ✓ Budget optimization will work with realistic data

============================================================
```

## Notes

- **Safe to re-run**: The script will ask for confirmation before clearing data
- **User-specific**: Only affects the first user in the database
- **Realistic patterns**: Data mimics real user behavior
- **Testing ready**: Designed to trigger all analytics features
- **Customizable**: Easy to modify patterns and quantities

## Benefits

✅ **Instant Testing** - No need to manually enter 90+ logs  
✅ **Pattern Testing** - Weekend spikes, imbalances automatically included  
✅ **Waste Scenarios** - Items at various risk levels  
✅ **Complete Coverage** - All food categories represented  
✅ **Time-Saving** - 30 days of data in seconds  
✅ **Reproducible** - Consistent patterns for testing  

Now you can properly test the Analytics and Meal Planner features with realistic data! 🎉
