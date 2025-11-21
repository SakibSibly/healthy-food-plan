"""
AI Meal Optimization Engine
Optimizes weekly meal plans based on budget, inventory, and nutrition requirements
"""
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict
import random


class NutritionRules:
    """Defines minimum daily nutrition requirements."""
    
    # Daily minimum requirements (general guidelines)
    DAILY_REQUIREMENTS = {
        'calories': {'min': 1800, 'max': 2500, 'optimal': 2000},
        'protein': {'min': 50, 'max': 150, 'optimal': 75},  # grams
        'carbs': {'min': 225, 'max': 325, 'optimal': 275},  # grams
        'fats': {'min': 44, 'max': 78, 'optimal': 65},  # grams
        'fiber': {'min': 25, 'max': 35, 'optimal': 30},  # grams
    }
    
    # Meal distribution percentages
    MEAL_DISTRIBUTION = {
        'breakfast': 0.25,
        'lunch': 0.35,
        'dinner': 0.35,
        'snack': 0.05
    }
    
    @classmethod
    def get_meal_requirement(cls, nutrient: str, meal_type: str) -> float:
        """Calculate nutrient requirement for a specific meal."""
        if nutrient not in cls.DAILY_REQUIREMENTS:
            return 0.0
        
        daily_optimal = cls.DAILY_REQUIREMENTS[nutrient]['optimal']
        distribution = cls.MEAL_DISTRIBUTION.get(meal_type, 0.25)
        return daily_optimal * distribution
    
    @classmethod
    def validate_daily_nutrition(cls, daily_totals: Dict[str, float]) -> Dict[str, Any]:
        """Validate if daily nutrition meets requirements."""
        results = {}
        for nutrient, values in cls.DAILY_REQUIREMENTS.items():
            actual = daily_totals.get(nutrient, 0)
            results[nutrient] = {
                'actual': actual,
                'min': values['min'],
                'max': values['max'],
                'optimal': values['optimal'],
                'meets_min': actual >= values['min'],
                'within_range': values['min'] <= actual <= values['max'],
                'percentage': (actual / values['optimal']) * 100 if values['optimal'] > 0 else 0
            }
        return results


class FoodDatabase:
    """Dummy food database with nutritional info and cost data."""
    
    FOODS = {
        # Proteins
        'chicken_breast': {
            'category': 'protein',
            'cost_per_100g': 32,
            'calories': 165,
            'protein': 31,
            'carbs': 0,
            'fats': 3.6,
            'fiber': 0,
            'serving_size': 150,
            'unit': 'g'
        },
        'eggs': {
            'category': 'protein',
            'cost_per_100g': 14,
            'calories': 155,
            'protein': 13,
            'carbs': 1.1,
            'fats': 11,
            'fiber': 0,
            'serving_size': 100,
            'unit': 'g'
        },
        'salmon': {
            'category': 'protein',
            'cost_per_100g': 160,
            'calories': 208,
            'protein': 20,
            'carbs': 0,
            'fats': 13,
            'fiber': 0,
            'serving_size': 150,
            'unit': 'g'
        },
        'ground_beef': {
            'category': 'protein',
            'cost_per_100g': 45,
            'calories': 250,
            'protein': 26,
            'carbs': 0,
            'fats': 15,
            'fiber': 0,
            'serving_size': 150,
            'unit': 'g'
        },
        'tofu': {
            'category': 'protein',
            'cost_per_100g': 25,
            'calories': 76,
            'protein': 8,
            'carbs': 1.9,
            'fats': 4.8,
            'fiber': 0.3,
            'serving_size': 150,
            'unit': 'g'
        },
        
        # Grains
        'brown_rice': {
            'category': 'grain',
            'cost_per_100g': 7,
            'calories': 370,
            'protein': 7.9,
            'carbs': 77,
            'fats': 2.9,
            'fiber': 3.5,
            'serving_size': 75,
            'unit': 'g'
        },
        'whole_wheat_bread': {
            'category': 'grain',
            'cost_per_100g': 10,
            'calories': 247,
            'protein': 13,
            'carbs': 41,
            'fats': 3.4,
            'fiber': 7,
            'serving_size': 60,
            'unit': 'g'
        },
        'oatmeal': {
            'category': 'grain',
            'cost_per_100g': 12,
            'calories': 389,
            'protein': 16.9,
            'carbs': 66,
            'fats': 6.9,
            'fiber': 10.6,
            'serving_size': 50,
            'unit': 'g'
        },
        'pasta': {
            'category': 'grain',
            'cost_per_100g': 8,
            'calories': 371,
            'protein': 13,
            'carbs': 74,
            'fats': 1.5,
            'fiber': 3.2,
            'serving_size': 80,
            'unit': 'g'
        },
        
        # Vegetables
        'broccoli': {
            'category': 'vegetable',
            'cost_per_100g': 8,
            'calories': 34,
            'protein': 2.8,
            'carbs': 7,
            'fats': 0.4,
            'fiber': 2.6,
            'serving_size': 150,
            'unit': 'g'
        },
        'spinach': {
            'category': 'vegetable',
            'cost_per_100g': 6,
            'calories': 23,
            'protein': 2.9,
            'carbs': 3.6,
            'fats': 0.4,
            'fiber': 2.2,
            'serving_size': 100,
            'unit': 'g'
        },
        'carrots': {
            'category': 'vegetable',
            'cost_per_100g': 5,
            'calories': 41,
            'protein': 0.9,
            'carbs': 10,
            'fats': 0.2,
            'fiber': 2.8,
            'serving_size': 100,
            'unit': 'g'
        },
        'bell_peppers': {
            'category': 'vegetable',
            'cost_per_100g': 12,
            'calories': 31,
            'protein': 1,
            'carbs': 6,
            'fats': 0.3,
            'fiber': 2.1,
            'serving_size': 150,
            'unit': 'g'
        },
        'tomatoes': {
            'category': 'vegetable',
            'cost_per_100g': 6,
            'calories': 18,
            'protein': 0.9,
            'carbs': 3.9,
            'fats': 0.2,
            'fiber': 1.2,
            'serving_size': 150,
            'unit': 'g'
        },
        
        # Fruits
        'banana': {
            'category': 'fruit',
            'cost_per_100g': 8,
            'calories': 89,
            'protein': 1.1,
            'carbs': 23,
            'fats': 0.3,
            'fiber': 2.6,
            'serving_size': 120,
            'unit': 'g'
        },
        'apple': {
            'category': 'fruit',
            'cost_per_100g': 18,
            'calories': 52,
            'protein': 0.3,
            'carbs': 14,
            'fats': 0.2,
            'fiber': 2.4,
            'serving_size': 150,
            'unit': 'g'
        },
        'orange': {
            'category': 'fruit',
            'cost_per_100g': 15,
            'calories': 47,
            'protein': 0.9,
            'carbs': 12,
            'fats': 0.1,
            'fiber': 2.4,
            'serving_size': 130,
            'unit': 'g'
        },
        'berries': {
            'category': 'fruit',
            'cost_per_100g': 35,
            'calories': 57,
            'protein': 0.7,
            'carbs': 14,
            'fats': 0.3,
            'fiber': 2.4,
            'serving_size': 100,
            'unit': 'g'
        },
        
        # Dairy
        'milk': {
            'category': 'dairy',
            'cost_per_100g': 11,
            'calories': 42,
            'protein': 3.4,
            'carbs': 5,
            'fats': 1,
            'fiber': 0,
            'serving_size': 250,
            'unit': 'ml'
        },
        'greek_yogurt': {
            'category': 'dairy',
            'cost_per_100g': 44,
            'calories': 59,
            'protein': 10,
            'carbs': 3.6,
            'fats': 0.4,
            'fiber': 0,
            'serving_size': 170,
            'unit': 'g'
        },
        'cheese': {
            'category': 'dairy',
            'cost_per_100g': 90,
            'calories': 402,
            'protein': 25,
            'carbs': 1.3,
            'fats': 33,
            'fiber': 0,
            'serving_size': 30,
            'unit': 'g'
        },
        
        # Healthy fats
        'avocado': {
            'category': 'vegetable',
            'cost_per_100g': 40,
            'calories': 160,
            'protein': 2,
            'carbs': 9,
            'fats': 15,
            'fiber': 7,
            'serving_size': 100,
            'unit': 'g'
        },
        'olive_oil': {
            'category': 'fat',
            'cost_per_100g': 60,
            'calories': 884,
            'protein': 0,
            'carbs': 0,
            'fats': 100,
            'fiber': 0,
            'serving_size': 15,
            'unit': 'ml'
        },
        'nuts_almonds': {
            'category': 'protein',
            'cost_per_100g': 80,
            'calories': 579,
            'protein': 21,
            'carbs': 22,
            'fats': 50,
            'fiber': 12.5,
            'serving_size': 30,
            'unit': 'g'
        }
    }
    
    @classmethod
    def get_food(cls, name: str) -> Optional[Dict]:
        """Get food data by name."""
        return cls.FOODS.get(name)
    
    @classmethod
    def get_foods_by_category(cls, category: str) -> List[str]:
        """Get all foods in a category."""
        return [name for name, data in cls.FOODS.items() 
                if data['category'] == category]
    
    @classmethod
    def calculate_nutrition(cls, food_name: str, quantity: float) -> Dict[str, float]:
        """Calculate nutrition for a given quantity."""
        food = cls.get_food(food_name)
        if not food:
            return {}
        
        # Normalize to per 100g/ml
        factor = quantity / 100
        return {
            'calories': food['calories'] * factor,
            'protein': food['protein'] * factor,
            'carbs': food['carbs'] * factor,
            'fats': food['fats'] * factor,
            'fiber': food['fiber'] * factor,
            'cost': food['cost_per_100g'] * factor
        }
    
    @classmethod
    def find_alternatives(cls, food_name: str, max_cost_ratio: float = 1.2) -> List[str]:
        """Find alternative foods in the same category within cost range."""
        food = cls.get_food(food_name)
        if not food:
            return []
        
        category = food['category']
        max_cost = food['cost_per_100g'] * max_cost_ratio
        
        alternatives = []
        for name, data in cls.FOODS.items():
            if (name != food_name and 
                data['category'] == category and 
                data['cost_per_100g'] <= max_cost):
                alternatives.append(name)
        
        return alternatives


class MealOptimizer:
    """AI-powered meal optimization engine."""
    
    def __init__(self, 
                 budget: float,
                 inventory_items: List[Dict],
                 dietary_restrictions: Optional[str] = None,
                 dietary_pref: Optional[str] = None):
        """
        Initialize the meal optimizer.
        
        Args:
            budget: Weekly budget for meals
            inventory_items: List of available inventory items
            dietary_restrictions: User's dietary restrictions
            dietary_pref: User's dietary preferences
        """
        self.budget = budget
        self.inventory_items = self._process_inventory(inventory_items)
        self.dietary_restrictions = dietary_restrictions or ""
        self.dietary_pref = dietary_pref or ""
        self.food_db = FoodDatabase()
        self.nutrition_rules = NutritionRules()
        
    def _process_inventory(self, items: List[Dict]) -> Dict[str, Dict]:
        """Process inventory items into usable format."""
        inventory = {}
        for item in items:
            # Normalize item name for matching
            normalized_name = item.get('name', '').lower().replace(' ', '_')
            inventory[normalized_name] = {
                'id': item.get('id'),
                'name': item.get('name'),
                'quantity': item.get('quantity', 0),
                'cost': item.get('cost', 0),
                'category': item.get('category', '').lower(),
                'expiration_date': item.get('expiration_date')
            }
        return inventory
    
    def _check_dietary_compatibility(self, food_name: str) -> bool:
        """Check if food is compatible with dietary restrictions."""
        food = self.food_db.get_food(food_name)
        if not food:
            return False
        
        restrictions_lower = self.dietary_restrictions.lower()
        
        # Check common restrictions
        if 'vegetarian' in restrictions_lower:
            if food['category'] == 'protein' and food_name in ['chicken_breast', 'salmon', 'ground_beef']:
                return False
        
        if 'vegan' in restrictions_lower:
            if food['category'] in ['protein', 'dairy'] and food_name in [
                'chicken_breast', 'salmon', 'ground_beef', 'eggs', 
                'milk', 'greek_yogurt', 'cheese'
            ]:
                return False
        
        if 'gluten-free' in restrictions_lower:
            if 'bread' in food_name or 'pasta' in food_name:
                return False
        
        if 'dairy-free' in restrictions_lower or 'lactose' in restrictions_lower:
            if food['category'] == 'dairy':
                return False
        
        return True
    
    def _score_food_choice(self, 
                          food_name: str, 
                          meal_type: str,
                          remaining_budget: float,
                          daily_nutrition: Dict[str, float]) -> float:
        """Score a food choice based on multiple factors."""
        food = self.food_db.get_food(food_name)
        if not food:
            return 0.0
        
        score = 100.0
        
        # Cost efficiency (40% weight)
        serving_cost = (food['cost_per_100g'] * food['serving_size']) / 100
        if serving_cost > remaining_budget:
            score -= 40
        else:
            cost_ratio = serving_cost / remaining_budget if remaining_budget > 0 else 1
            score -= (cost_ratio * 20)  # Lower is better
        
        # Inventory usage (30% weight) - prioritize using inventory
        if food_name in self.inventory_items:
            score += 30
            # Boost score if item is expiring soon
            inv_item = self.inventory_items[food_name]
            if inv_item.get('expiration_date'):
                score += 10
        
        # Nutritional balance (30% weight)
        required_cals = self.nutrition_rules.get_meal_requirement('calories', meal_type)
        actual_cals = food['calories'] * (food['serving_size'] / 100)
        cal_diff = abs(actual_cals - required_cals) / required_cals if required_cals > 0 else 1
        score -= (cal_diff * 15)
        
        # Protein content bonus
        protein_amount = food['protein'] * (food['serving_size'] / 100)
        if protein_amount >= 15:
            score += 10
        
        # Fiber content bonus
        fiber_amount = food['fiber'] * (food['serving_size'] / 100)
        if fiber_amount >= 3:
            score += 5
        
        return max(0, score)
    
    def _select_meal_items(self, 
                          meal_type: str, 
                          day: int,
                          remaining_budget: float,
                          daily_nutrition: Dict[str, float]) -> List[Dict]:
        """Select items for a single meal."""
        selected_items = []
        
        # Meal composition strategy
        if meal_type == 'breakfast':
            categories = ['grain', 'protein', 'fruit', 'dairy']
        elif meal_type in ['lunch', 'dinner']:
            categories = ['protein', 'grain', 'vegetable', 'vegetable']
        else:  # snack
            categories = ['fruit']
        
        for category in categories:
            available_foods = self.food_db.get_foods_by_category(category)
            compatible_foods = [f for f in available_foods 
                              if self._check_dietary_compatibility(f)]
            
            if not compatible_foods:
                continue
            
            # Score all compatible foods
            scored_foods = []
            for food_name in compatible_foods:
                score = self._score_food_choice(
                    food_name, meal_type, remaining_budget, daily_nutrition
                )
                scored_foods.append((food_name, score))
            
            # Sort by score and select top choice
            scored_foods.sort(key=lambda x: x[1], reverse=True)
            
            if scored_foods:
                selected_food = scored_foods[0][0]
                food_data = self.food_db.get_food(selected_food)
                
                quantity = food_data['serving_size']
                nutrition = self.food_db.calculate_nutrition(selected_food, quantity)
                
                # Check if using inventory
                uses_inventory = selected_food in self.inventory_items
                inventory_item_id = None
                
                if uses_inventory:
                    inv_item = self.inventory_items[selected_food]
                    inventory_item_id = inv_item['id']
                    # Reduce inventory quantity
                    inv_item['quantity'] -= (quantity / 100)
                    if inv_item['quantity'] <= 0:
                        del self.inventory_items[selected_food]
                
                meal_item = {
                    'day_of_week': day,
                    'meal_type': meal_type,
                    'food_name': selected_food.replace('_', ' ').title(),
                    'quantity': quantity,
                    'unit': food_data['unit'],
                    'estimated_cost': nutrition['cost'],
                    'calories': nutrition['calories'],
                    'protein': nutrition['protein'],
                    'carbs': nutrition['carbs'],
                    'fats': nutrition['fats'],
                    'uses_inventory': uses_inventory,
                    'inventory_item_id': str(inventory_item_id) if inventory_item_id else None,
                    'notes': f"From inventory - use by {inv_item.get('expiration_date')}" if uses_inventory and inv_item.get('expiration_date') else None
                }
                
                selected_items.append(meal_item)
                remaining_budget -= nutrition['cost']
                
                # Update daily nutrition
                daily_nutrition['calories'] += nutrition['calories']
                daily_nutrition['protein'] += nutrition['protein']
                daily_nutrition['carbs'] += nutrition['carbs']
                daily_nutrition['fats'] += nutrition['fats']
                daily_nutrition['fiber'] += nutrition['fiber']
        
        return selected_items
    
    def optimize_weekly_plan(self) -> Dict[str, Any]:
        """
        Generate an optimized weekly meal plan.
        
        Returns:
            Dictionary containing the meal plan, shopping list, and analysis
        """
        meal_plan_items = []
        daily_budgets = self.budget / 7
        total_cost = 0.0
        
        weekly_nutrition = defaultdict(lambda: defaultdict(float))
        
        # Generate meals for each day
        for day in range(7):  # 0 = Monday, 6 = Sunday
            daily_nutrition = {
                'calories': 0, 'protein': 0, 'carbs': 0, 'fats': 0, 'fiber': 0
            }
            remaining_budget = daily_budgets
            
            # Generate meals for each meal type
            for meal_type in ['breakfast', 'lunch', 'dinner', 'snack']:
                meal_items = self._select_meal_items(
                    meal_type, day, remaining_budget, daily_nutrition
                )
                
                for item in meal_items:
                    meal_plan_items.append(item)
                    total_cost += item['estimated_cost']
                    remaining_budget -= item['estimated_cost']
            
            # Store daily nutrition
            for nutrient, value in daily_nutrition.items():
                weekly_nutrition[day][nutrient] = value
        
        # Generate shopping list (items not from inventory)
        shopping_list = self._generate_shopping_list(meal_plan_items)
        
        # Generate nutrition analysis
        nutrition_analysis = self._analyze_nutrition(weekly_nutrition)
        
        # Generate alternatives for expensive items
        alternatives = self._suggest_alternatives(meal_plan_items, shopping_list)
        
        return {
            'meal_plan_items': meal_plan_items,
            'shopping_list': shopping_list,
            'total_cost': round(total_cost, 2),
            'budget': self.budget,
            'budget_remaining': round(self.budget - total_cost, 2),
            'budget_utilization': round((total_cost / self.budget * 100), 1) if self.budget > 0 else 0,
            'nutrition_analysis': nutrition_analysis,
            'alternatives': alternatives,
            'inventory_usage': self._calculate_inventory_usage(meal_plan_items),
            'generated_at': datetime.now().isoformat()
        }
    
    def _generate_shopping_list(self, meal_items: List[Dict]) -> List[Dict]:
        """Generate shopping list from meal plan items."""
        shopping_dict = defaultdict(lambda: {'quantity': 0, 'cost': 0, 'unit': '', 'category': ''})
        
        for item in meal_items:
            if not item['uses_inventory']:
                food_name = item['food_name'].lower().replace(' ', '_')
                food_data = self.food_db.get_food(food_name)
                
                if food_data:
                    shopping_dict[item['food_name']]['quantity'] += item['quantity']
                    shopping_dict[item['food_name']]['cost'] += item['estimated_cost']
                    shopping_dict[item['food_name']]['unit'] = item['unit']
                    shopping_dict[item['food_name']]['category'] = food_data['category']
        
        # Convert to list and sort by category
        shopping_list = [
            {
                'item': name,
                'quantity': round(data['quantity'], 1),
                'unit': data['unit'],
                'estimated_cost': round(data['cost'], 2),
                'category': data['category']
            }
            for name, data in shopping_dict.items()
        ]
        
        shopping_list.sort(key=lambda x: x['category'])
        return shopping_list
    
    def _analyze_nutrition(self, weekly_nutrition: Dict) -> Dict[str, Any]:
        """Analyze weekly nutrition data."""
        daily_analyses = {}
        weekly_totals = defaultdict(float)
        
        for day, nutrition in weekly_nutrition.items():
            # Validate daily nutrition
            daily_analysis = self.nutrition_rules.validate_daily_nutrition(nutrition)
            daily_analyses[f"day_{day}"] = daily_analysis
            
            # Accumulate weekly totals
            for nutrient, value in nutrition.items():
                weekly_totals[nutrient] += value
        
        # Calculate weekly averages
        weekly_averages = {
            nutrient: round(total / 7, 1)
            for nutrient, total in weekly_totals.items()
        }
        
        # Validate weekly averages against daily requirements
        average_validation = self.nutrition_rules.validate_daily_nutrition(weekly_averages)
        
        return {
            'daily_analyses': daily_analyses,
            'weekly_averages': weekly_averages,
            'weekly_validation': average_validation,
            'overall_score': self._calculate_nutrition_score(average_validation)
        }
    
    def _calculate_nutrition_score(self, validation: Dict) -> int:
        """Calculate overall nutrition score (0-100)."""
        score = 0
        total_nutrients = len(validation)
        
        for nutrient, data in validation.items():
            if data['meets_min']:
                score += 50 / total_nutrients
            if data['within_range']:
                score += 50 / total_nutrients
        
        return round(score)
    
    def _suggest_alternatives(self, meal_items: List[Dict], shopping_list: List[Dict]) -> List[Dict]:
        """Suggest cheaper alternatives for expensive items."""
        alternatives = []
        
        # Find expensive items (top 5 by cost)
        expensive_items = sorted(shopping_list, key=lambda x: x['estimated_cost'], reverse=True)[:5]
        
        for item in expensive_items:
            food_name = item['item'].lower().replace(' ', '_')
            alternative_foods = self.food_db.find_alternatives(food_name, max_cost_ratio=0.8)
            
            if alternative_foods:
                food_data = self.food_db.get_food(food_name)
                alt_suggestions = []
                
                for alt_name in alternative_foods[:3]:  # Top 3 alternatives
                    alt_data = self.food_db.get_food(alt_name)
                    savings = (food_data['cost_per_100g'] - alt_data['cost_per_100g']) * item['quantity']
                    
                    alt_suggestions.append({
                        'name': alt_name.replace('_', ' ').title(),
                        'cost_per_100g': alt_data['cost_per_100g'],
                        'estimated_savings': round(savings, 2)
                    })
                
                if alt_suggestions:
                    alternatives.append({
                        'original_item': item['item'],
                        'original_cost': item['estimated_cost'],
                        'alternatives': alt_suggestions
                    })
        
        return alternatives
    
    def _calculate_inventory_usage(self, meal_items: List[Dict]) -> Dict[str, Any]:
        """Calculate inventory usage statistics."""
        total_items = len(meal_items)
        inventory_items = [item for item in meal_items if item['uses_inventory']]
        
        inventory_cost_saved = sum(item['estimated_cost'] for item in inventory_items)
        
        return {
            'total_meals': total_items,
            'meals_from_inventory': len(inventory_items),
            'inventory_usage_percentage': round((len(inventory_items) / total_items * 100), 1) if total_items > 0 else 0,
            'estimated_cost_saved': round(inventory_cost_saved, 2),
            'waste_reduction': f"{len(inventory_items)} items used from inventory to reduce waste"
        }
