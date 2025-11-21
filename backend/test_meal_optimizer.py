"""
Test script for the Meal Optimizer
Run this to verify the optimization engine works correctly
"""
from app.meal_optimizer import MealOptimizer, FoodDatabase, NutritionRules


def test_basic_optimization():
    """Test basic meal plan optimization without inventory."""
    print("=" * 60)
    print("TEST 1: Basic Meal Plan Optimization (No Inventory)")
    print("=" * 60)
    
    optimizer = MealOptimizer(
        budget=100.0,
        inventory_items=[],
        dietary_restrictions=None,
        dietary_pref=None
    )
    
    result = optimizer.optimize_weekly_plan()
    
    print(f"\n✓ Budget: ${result['budget']:.2f}")
    print(f"✓ Total Cost: ${result['total_cost']:.2f}")
    print(f"✓ Remaining: ${result['budget_remaining']:.2f}")
    print(f"✓ Utilization: {result['budget_utilization']:.1f}%")
    print(f"✓ Total Meals: {len(result['meal_plan_items'])}")
    print(f"✓ Nutrition Score: {result['nutrition_analysis']['overall_score']}/100")
    
    assert result['total_cost'] <= result['budget'], "Budget exceeded!"
    assert len(result['meal_plan_items']) > 0, "No meal items generated!"
    print("\n✓ Test PASSED\n")
    return result


def test_with_inventory():
    """Test meal plan optimization with inventory items."""
    print("=" * 60)
    print("TEST 2: Meal Plan with Inventory Items")
    print("=" * 60)
    
    # Mock inventory items
    inventory = [
        {
            'id': '123e4567-e89b-12d3-a456-426614174000',
            'name': 'chicken breast',
            'quantity': 500,  # 500g
            'cost': 6.0,
            'category': 'protein',
            'expiration_date': '2024-12-25'
        },
        {
            'id': '123e4567-e89b-12d3-a456-426614174001',
            'name': 'brown rice',
            'quantity': 1000,  # 1kg
            'cost': 1.5,
            'category': 'grain',
            'expiration_date': '2025-06-01'
        },
        {
            'id': '123e4567-e89b-12d3-a456-426614174002',
            'name': 'broccoli',
            'quantity': 300,  # 300g
            'cost': 0.75,
            'category': 'vegetable',
            'expiration_date': '2024-12-20'
        }
    ]
    
    optimizer = MealOptimizer(
        budget=100.0,
        inventory_items=inventory,
        dietary_restrictions=None,
        dietary_pref=None
    )
    
    result = optimizer.optimize_weekly_plan()
    
    print(f"\n✓ Budget: ${result['budget']:.2f}")
    print(f"✓ Total Cost: ${result['total_cost']:.2f}")
    print(f"✓ Cost Saved: ${result['inventory_usage']['estimated_cost_saved']:.2f}")
    print(f"✓ Inventory Usage: {result['inventory_usage']['inventory_usage_percentage']:.1f}%")
    print(f"✓ Meals from Inventory: {result['inventory_usage']['meals_from_inventory']}")
    
    assert result['inventory_usage']['meals_from_inventory'] > 0, "Inventory not used!"
    print("\n✓ Test PASSED\n")
    return result


def test_vegetarian_diet():
    """Test meal plan with vegetarian dietary restrictions."""
    print("=" * 60)
    print("TEST 3: Vegetarian Meal Plan")
    print("=" * 60)
    
    optimizer = MealOptimizer(
        budget=80.0,
        inventory_items=[],
        dietary_restrictions="vegetarian",
        dietary_pref="vegetarian"
    )
    
    result = optimizer.optimize_weekly_plan()
    
    # Check that no meat items are included
    meat_items = ['chicken_breast', 'salmon', 'ground_beef']
    for item in result['meal_plan_items']:
        food_name = item['food_name'].lower().replace(' ', '_')
        assert food_name not in meat_items, f"Meat item found: {food_name}"
    
    print(f"\n✓ Budget: ${result['budget']:.2f}")
    print(f"✓ Total Cost: ${result['total_cost']:.2f}")
    print(f"✓ Total Meals: {len(result['meal_plan_items'])}")
    print("✓ No meat items found in meal plan")
    print("\n✓ Test PASSED\n")
    return result


def test_shopping_list():
    """Test shopping list generation."""
    print("=" * 60)
    print("TEST 4: Shopping List Generation")
    print("=" * 60)
    
    optimizer = MealOptimizer(
        budget=100.0,
        inventory_items=[],
        dietary_restrictions=None,
        dietary_pref=None
    )
    
    result = optimizer.optimize_weekly_plan()
    shopping_list = result['shopping_list']
    
    print(f"\n✓ Shopping List Items: {len(shopping_list)}")
    print("\nShopping List:")
    print("-" * 60)
    
    total = 0
    for item in shopping_list[:10]:  # Show first 10 items
        print(f"  {item['item']:20} {item['quantity']:6.1f} {item['unit']:4} ${item['estimated_cost']:6.2f}")
        total += item['estimated_cost']
    
    if len(shopping_list) > 10:
        print(f"  ... and {len(shopping_list) - 10} more items")
    
    print("-" * 60)
    print(f"  {'Total':31} ${total:.2f}")
    
    assert len(shopping_list) > 0, "Shopping list is empty!"
    print("\n✓ Test PASSED\n")
    return result


def test_alternatives():
    """Test alternative suggestions."""
    print("=" * 60)
    print("TEST 5: Cost-Saving Alternatives")
    print("=" * 60)
    
    optimizer = MealOptimizer(
        budget=60.0,  # Lower budget to get more alternatives
        inventory_items=[],
        dietary_restrictions=None,
        dietary_pref=None
    )
    
    result = optimizer.optimize_weekly_plan()
    alternatives = result['alternatives']
    
    print(f"\n✓ Alternative Suggestions: {len(alternatives)}")
    
    if alternatives:
        print("\nSuggested Alternatives:")
        print("-" * 60)
        for alt in alternatives[:3]:  # Show first 3
            print(f"\n  Instead of: {alt['original_item']} (${alt['original_cost']:.2f})")
            print(f"  Consider:")
            for option in alt['alternatives']:
                print(f"    • {option['name']} - Save ${option['estimated_savings']:.2f}")
        print()
    
    print("\n✓ Test PASSED\n")
    return result


def test_nutrition_analysis():
    """Test nutrition analysis."""
    print("=" * 60)
    print("TEST 6: Nutrition Analysis")
    print("=" * 60)
    
    optimizer = MealOptimizer(
        budget=100.0,
        inventory_items=[],
        dietary_restrictions=None,
        dietary_pref=None
    )
    
    result = optimizer.optimize_weekly_plan()
    nutrition = result['nutrition_analysis']
    
    print("\nWeekly Nutrition Averages:")
    print("-" * 60)
    for nutrient, value in nutrition['weekly_averages'].items():
        validation = nutrition['weekly_validation'][nutrient]
        status = "✓" if validation['meets_min'] else "✗"
        print(f"  {status} {nutrient.capitalize():12} {value:7.1f} (target: {validation['optimal']:.1f})")
    
    print(f"\n✓ Overall Nutrition Score: {nutrition['overall_score']}/100")
    
    assert nutrition['overall_score'] >= 50, "Nutrition score too low!"
    print("\n✓ Test PASSED\n")
    return result


def test_food_database():
    """Test food database functionality."""
    print("=" * 60)
    print("TEST 7: Food Database")
    print("=" * 60)
    
    # Test getting food data
    chicken = FoodDatabase.get_food('chicken_breast')
    assert chicken is not None, "Chicken not found in database!"
    print(f"✓ Food lookup works: {chicken['category']}")
    
    # Test category filtering
    proteins = FoodDatabase.get_foods_by_category('protein')
    print(f"✓ Protein foods: {len(proteins)} items")
    
    # Test nutrition calculation
    nutrition = FoodDatabase.calculate_nutrition('chicken_breast', 150)
    print(f"✓ Nutrition calculation: {nutrition['protein']:.1f}g protein in 150g chicken")
    
    # Test alternatives
    alternatives = FoodDatabase.find_alternatives('chicken_breast')
    print(f"✓ Alternatives found: {len(alternatives)} options")
    
    print("\n✓ Test PASSED\n")


def run_all_tests():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("MEAL OPTIMIZER TEST SUITE")
    print("=" * 60 + "\n")
    
    try:
        test_food_database()
        test_basic_optimization()
        test_with_inventory()
        test_vegetarian_diet()
        test_shopping_list()
        test_alternatives()
        test_nutrition_analysis()
        
        print("=" * 60)
        print("ALL TESTS PASSED! ✓")
        print("=" * 60)
        print("\nThe Meal Optimizer is working correctly!")
        print("You can now use it via the API endpoints.\n")
        
    except AssertionError as e:
        print(f"\n✗ TEST FAILED: {e}\n")
        raise
    except Exception as e:
        print(f"\n✗ ERROR: {e}\n")
        raise


if __name__ == "__main__":
    run_all_tests()
