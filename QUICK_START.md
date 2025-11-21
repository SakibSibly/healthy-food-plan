# Quick Start Guide - AI Meal Optimizer

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Backend Server

```bash
cd backend
py -m uv run fastapi dev .\app\api\main.py
```

Server will start at: `http://localhost:8000`

### Step 2: Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend will start at: `http://localhost:5173`

### Step 3: Login/Register

1. Navigate to `http://localhost:5173`
2. Login with your account or register a new one
3. Make sure to set your dietary preferences in your profile

### Step 4: Add Some Inventory (Optional but Recommended)

1. Click "Inventory" in the navbar
2. Add a few items you have at home:
   - Chicken breast (500g, $6.00, expires in 5 days)
   - Brown rice (1kg, $1.50, expires in 6 months)
   - Broccoli (300g, $0.75, expires in 3 days)

### Step 5: Generate Your Meal Plan

1. Click "🍽️ Meal Planner" in the navbar
2. Set your weekly budget (e.g., $100)
3. Choose plan duration (7 days recommended)
4. Make sure "Use items from my inventory" is checked
5. Click "Generate Meal Plan"

### Step 6: View Your Results

Your optimized meal plan will show:
- ✅ Budget breakdown and remaining balance
- ✅ Weekly meal calendar (7 days × 4 meals)
- ✅ Shopping list with estimated costs
- ✅ Nutrition score and analysis
- ✅ Cost-saving alternatives
- ✅ Inventory usage statistics

## 📱 Using the Interface

### Create Plan Tab
```
┌─────────────────────────────────────┐
│  Generate Optimized Meal Plan       │
│                                     │
│  Weekly Budget ($)                  │
│  [100.00        ]                   │
│                                     │
│  Plan Duration (days)               │
│  [7 days (1 week) ▼]               │
│                                     │
│  ☑ Use items from my inventory     │
│                                     │
│  [Generate Meal Plan]               │
└─────────────────────────────────────┘
```

### My Plans Tab
```
┌─────────────────────────────────────┐
│  Optimized Plan - Dec 15, 2024     │
│  AI-optimized meal plan...          │
│  📅 2024-12-15 to 2024-12-21       │
│  💰 $87.50 / $100.00               │
│  🍽️ 28 meals                       │
│  [View] [Delete]                    │
│  ████████████░░░ 87.5%             │
└─────────────────────────────────────┘
```

### Details Tab
```
┌──────────┬──────────┬──────────┬──────────┐
│ $87.50   │ $12.50   │   87.5%  │  85/100  │
│Total Cost│Remaining │Used      │Nutrition │
└──────────┴──────────┴──────────┴──────────┘

📦 Inventory Usage
8 meals from inventory • $15.25 saved

🍽️ Weekly Meal Plan
Monday
  Breakfast: Oatmeal, Banana, Milk
  Lunch: Chicken Breast 📦, Brown Rice 📦, Broccoli 📦
  Dinner: Salmon, Pasta, Bell Peppers
  Snack: Apple

[... continues for all 7 days ...]

🛒 Shopping List
Salmon         150g  $3.75
Pasta          80g   $0.10
Apple          150g  $0.23
[... more items ...]
Total: $72.25

💡 Cost-Saving Alternatives
Instead of Salmon ($3.75)
  • Tofu - Save $2.50
  • Ground Beef - Save $1.25
```

## 🎯 Pro Tips

### Maximize Savings
1. **Add inventory items** before generating plans
2. **Set expiration dates** to prioritize items that need to be used
3. **Review alternatives** for expensive items in your plan

### Better Nutrition
1. **Set dietary preferences** in your profile
2. **Check nutrition score** (aim for 80+)
3. **Review daily breakdowns** to see if any days need adjustment

### Budget Management
1. **Start conservative** with a realistic weekly budget
2. **Check utilization** - under 90% means you have room
3. **Review shopping list** costs before finalizing

## 🧪 Test the Optimizer (Optional)

Run the test suite to verify everything works:

```bash
cd backend
python test_meal_optimizer.py
```

You should see:
```
===================================================
ALL TESTS PASSED! ✓
===================================================
```

## 📊 API Examples

### Generate Plan (cURL)
```bash
curl -X POST "http://localhost:8000/meal-plans/optimize" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target_budget": 100.0,
    "duration_days": 7,
    "use_inventory": true
  }'
```

### Get All Plans
```bash
curl -X GET "http://localhost:8000/meal-plans/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Plan Details
```bash
curl -X GET "http://localhost:8000/meal-plans/{plan_id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### "Plan exceeds budget"
- ✅ Increase your budget
- ✅ Add more inventory items
- ✅ Check if your dietary restrictions are too limiting

### "No meals generated"
- ✅ Make sure the database has food data (it's built-in)
- ✅ Check server logs for errors
- ✅ Verify your authentication token is valid

### "Shopping list is empty"
- ✅ This means all meals use inventory items! 🎉
- ✅ Try a longer duration or less inventory

### "Nutrition score is low"
- ✅ Increase your budget for better food variety
- ✅ Check if dietary restrictions are limiting options
- ✅ Review the daily nutrition breakdowns

## 📚 Next Steps

1. **Customize the food database** - Add your favorite foods
2. **Adjust nutrition rules** - Modify daily requirements
3. **Tweak scoring weights** - Change optimization priorities
4. **Add more features** - Check the README for ideas

## 🎉 That's It!

You now have a fully functional AI Meal Optimizer that:
- ✅ Saves money
- ✅ Reduces waste
- ✅ Ensures nutrition
- ✅ Makes meal planning easy

## 💬 Support

For issues or questions:
1. Check the comprehensive README: `MEAL_OPTIMIZER_README.md`
2. Review the implementation summary: `MEAL_OPTIMIZER_IMPLEMENTATION.md`
3. See the system flow diagram: `SYSTEM_FLOW_DIAGRAM.md`

**Happy meal planning! 🍽️**
