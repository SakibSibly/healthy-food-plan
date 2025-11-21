"""
Seed Script for Healthy Food Plan Database
Populates database with realistic sample data for analytics testing

Usage:
    python seed_database.py

This will create:
- 90+ food log entries spanning 30 days
- 15+ inventory items with various expiration dates
- Realistic consumption patterns (weekend spikes, category variations)
- Items at risk of waste
"""
import sys
import os
from datetime import datetime, timedelta
import random

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select
from app.db import engine
from app.models import User, FoodLog, InventoryItem
import uuid


class DataSeeder:
    """Generates realistic sample data for testing."""
    
    FOOD_ITEMS = {
        'fruit': [
            ('Apple', 'piece', 150),
            ('Banana', 'piece', 120),
            ('Orange', 'piece', 130),
            ('Strawberries', 'g', 100),
            ('Grapes', 'g', 150),
            ('Blueberries', 'g', 80),
            ('Mango', 'piece', 200),
            ('Pear', 'piece', 140)
        ],
        'vegetable': [
            ('Broccoli', 'g', 150),
            ('Spinach', 'g', 100),
            ('Carrots', 'g', 120),
            ('Bell Peppers', 'g', 150),
            ('Tomatoes', 'g', 100),
            ('Cucumber', 'g', 150),
            ('Lettuce', 'g', 80),
            ('Kale', 'g', 70),
            ('Zucchini', 'g', 150),
            ('Cauliflower', 'g', 150)
        ],
        'grain': [
            ('Brown Rice', 'g', 75),
            ('Whole Wheat Bread', 'slices', 2),
            ('Oatmeal', 'g', 50),
            ('Quinoa', 'g', 60),
            ('Pasta', 'g', 80),
            ('White Rice', 'g', 75),
            ('Cereal', 'g', 40)
        ],
        'protein': [
            ('Chicken Breast', 'g', 150),
            ('Eggs', 'piece', 2),
            ('Salmon', 'g', 150),
            ('Ground Beef', 'g', 120),
            ('Tofu', 'g', 150),
            ('Tuna', 'g', 100),
            ('Turkey', 'g', 150),
            ('Beans', 'g', 100),
            ('Lentils', 'g', 80)
        ],
        'dairy': [
            ('Milk', 'ml', 250),
            ('Greek Yogurt', 'g', 170),
            ('Cheese', 'g', 30),
            ('Cottage Cheese', 'g', 100),
            ('Butter', 'g', 10)
        ]
    }
    
    # Consumption patterns by day of week (multipliers)
    DAY_PATTERNS = {
        0: 1.0,    # Monday - normal
        1: 0.9,    # Tuesday - slightly lower
        2: 1.0,    # Wednesday - normal
        3: 1.1,    # Thursday - slightly higher
        4: 1.2,    # Friday - higher (preparing for weekend)
        5: 1.4,    # Saturday - weekend spike
        6: 1.3     # Sunday - weekend
    }
    
    # Category preferences by day
    WEEKEND_FRUIT_BOOST = 1.6  # More fruit on weekends
    WEEKDAY_GRAIN_BOOST = 1.2  # More grains on weekdays
    
    def __init__(self, session: Session):
        self.session = session
        self.today = datetime.now()
    
    def get_or_create_test_user(self) -> User:
        """Get existing user or create if doesn't exist."""
        # Try to get first user
        statement = select(User).limit(1)
        user = self.session.exec(statement).first()
        
        if user:
            print(f"✓ Using existing user: {user.username} ({user.email})")
            return user
        
        # If no user exists, you need to create one through the API first
        print("✗ No user found. Please register a user first through the application.")
        sys.exit(1)
    
    def clear_existing_data(self, user: User):
        """Clear existing food logs and inventory for the user."""
        # Delete food logs
        statement = select(FoodLog).where(FoodLog.user_id == user.id)
        logs = self.session.exec(statement).unique().all()
        for log in logs:
            self.session.delete(log)
        
        # Delete inventory items
        statement = select(InventoryItem).where(InventoryItem.user_id == user.id)
        items = self.session.exec(statement).unique().all()
        for item in items:
            self.session.delete(item)
        
        self.session.commit()
        print(f"✓ Cleared {len(logs)} food logs and {len(items)} inventory items")
    
    def generate_food_logs(self, user: User, days: int = 30) -> list:
        """Generate realistic food logs for the past N days."""
        food_logs = []
        
        for day_offset in range(days):
            log_date = self.today - timedelta(days=days - day_offset - 1)
            day_of_week = log_date.weekday()
            
            # Base meals per day (varies by day of week)
            base_meals = 3 + random.randint(0, 1)  # 3-4 meals per day
            day_multiplier = self.DAY_PATTERNS[day_of_week]
            total_meals = int(base_meals * day_multiplier)
            
            # Weekend fruit boost
            is_weekend = day_of_week >= 5
            
            # Generate meals for this day
            for meal_num in range(total_meals):
                # Select category based on meal number and day
                if meal_num == 0:  # Breakfast
                    categories = ['grain', 'fruit', 'dairy']
                elif meal_num <= 2:  # Lunch/Dinner
                    categories = ['protein', 'vegetable', 'grain']
                else:  # Snacks
                    categories = ['fruit', 'dairy']
                
                for category in categories:
                    # Skip some randomly for variety
                    if random.random() < 0.2:
                        continue
                    
                    # Apply weekend fruit boost
                    if category == 'fruit' and is_weekend:
                        if random.random() > 0.3:  # 70% chance to log fruit on weekends
                            quantity_boost = self.WEEKEND_FRUIT_BOOST
                        else:
                            continue
                    elif category == 'grain' and not is_weekend:
                        quantity_boost = self.WEEKDAY_GRAIN_BOOST
                    else:
                        quantity_boost = 1.0
                    
                    # Select random food from category
                    foods = self.FOOD_ITEMS.get(category, [])
                    if not foods:
                        continue
                    
                    food_name, unit, base_quantity = random.choice(foods)
                    quantity = base_quantity * quantity_boost * random.uniform(0.8, 1.2)
                    
                    # Add some time variation to the meal
                    base_hour = 7 + (meal_num * 4)
                    hour = min(23, base_hour + random.randint(0, 2))
                    meal_time = log_date.replace(
                        hour=hour,
                        minute=random.randint(0, 59)
                    )
                    
                    food_log = FoodLog(
                        user_id=user.id,
                        item_name=food_name,
                        quantity=round(quantity, 1),
                        unit=unit,
                        category=category,
                        consumed_at=meal_time.isoformat(),
                        created_at=meal_time.isoformat(),
                        notes=f"Auto-generated sample data"
                    )
                    
                    food_logs.append(food_log)
                    self.session.add(food_log)
        
        self.session.commit()
        print(f"✓ Generated {len(food_logs)} food log entries over {days} days")
        return food_logs
    
    def generate_inventory(self, user: User) -> list:
        """Generate realistic inventory items with various expiration dates."""
        inventory_items = []
        
        # Items expiring soon (critical waste risk)
        critical_items = [
            ('Spinach', 'vegetable', 200, 0.60, 2),
            ('Strawberries', 'fruit', 250, 3.50, 3),
            ('Milk', 'dairy', 1000, 3.99, 3)
        ]
        
        # Items expiring within a week (high risk)
        high_risk_items = [
            ('Chicken Breast', 'protein', 500, 6.99, 5),
            ('Bell Peppers', 'vegetable', 300, 2.49, 6),
            ('Greek Yogurt', 'dairy', 500, 4.99, 6),
            ('Lettuce', 'vegetable', 150, 1.99, 4)
        ]
        
        # Items with medium-term expiration
        medium_term_items = [
            ('Broccoli', 'vegetable', 400, 2.99, 10),
            ('Carrots', 'vegetable', 500, 1.99, 14),
            ('Eggs', 'protein', 12, 4.99, 14),
            ('Cheese', 'dairy', 200, 5.99, 21)
        ]
        
        # Long-term storage items
        long_term_items = [
            ('Brown Rice', 'grain', 1000, 3.99, 180),
            ('Pasta', 'grain', 500, 1.99, 365),
            ('Oatmeal', 'grain', 800, 4.99, 270),
            ('Quinoa', 'grain', 400, 6.99, 300)
        ]
        
        all_items = critical_items + high_risk_items + medium_term_items + long_term_items
        
        for name, category, quantity, cost, days_until_expiry in all_items:
            expiration_date = (self.today + timedelta(days=days_until_expiry)).date().isoformat()
            
            item = InventoryItem(
                user_id=user.id,
                name=name,
                category=category,
                quantity=quantity,
                cost=cost,
                expiration_date=expiration_date,
                notes=f"Sample data - expires in {days_until_expiry} days"
            )
            
            inventory_items.append(item)
            self.session.add(item)
        
        self.session.commit()
        print(f"✓ Generated {len(inventory_items)} inventory items")
        print(f"  - Critical risk: {len(critical_items)} items")
        print(f"  - High risk: {len(high_risk_items)} items")
        print(f"  - Medium term: {len(medium_term_items)} items")
        print(f"  - Long term: {len(long_term_items)} items")
        
        return inventory_items
    
    def generate_consumption_imbalance(self, user: User):
        """Add some imbalanced consumption to trigger alerts."""
        # Add extra protein to create over-consumption
        for _ in range(10):
            log_date = self.today - timedelta(days=random.randint(0, 7))
            
            food_log = FoodLog(
                user_id=user.id,
                item_name='Chicken Breast',
                quantity=150,
                unit='g',
                category='protein',
                consumed_at=log_date.isoformat(),
                created_at=log_date.isoformat(),
                notes="Extra protein - creates over-consumption pattern"
            )
            self.session.add(food_log)
        
        self.session.commit()
        print("✓ Added consumption imbalance patterns (high protein)")
    
    def print_summary(self, user: User):
        """Print summary of generated data."""
        # Count food logs
        statement = select(FoodLog).where(FoodLog.user_id == user.id)
        total_logs = len(self.session.exec(statement).unique().all())
        
        # Count by category
        category_counts = {}
        for category in self.FOOD_ITEMS.keys():
            statement = select(FoodLog).where(
                FoodLog.user_id == user.id,
                FoodLog.category == category
            )
            category_counts[category] = len(self.session.exec(statement).unique().all())
        
        # Count inventory
        statement = select(InventoryItem).where(InventoryItem.user_id == user.id)
        total_inventory = len(self.session.exec(statement).unique().all())
        
        print("\n" + "="*60)
        print("DATA GENERATION SUMMARY")
        print("="*60)
        print(f"\nUser: {user.username}")
        print(f"\nFood Logs: {total_logs} total entries")
        print("  Category breakdown:")
        for category, count in sorted(category_counts.items()):
            print(f"    • {category.capitalize()}: {count} entries")
        
        print(f"\nInventory Items: {total_inventory} items")
        
        print("\n" + "="*60)
        print("NEXT STEPS")
        print("="*60)
        print("\n1. Navigate to the Analytics page in your app")
        print("2. You should see:")
        print("   ✓ Weekly trend patterns (weekend fruit spike)")
        print("   ✓ Consumption imbalances (high protein, low veggies)")
        print("   ✓ Waste predictions (critical items expiring soon)")
        print("   ✓ Dietary balance flags")
        print("   ✓ Heatmap visualization data")
        print("\n3. Test the Meal Planner with this inventory")
        print("   ✓ It will prioritize using expiring items")
        print("   ✓ Budget optimization will work with realistic data")
        print("\n" + "="*60 + "\n")


def main():
    """Main seeding function."""
    print("\n" + "="*60)
    print("HEALTHY FOOD PLAN - DATABASE SEEDER")
    print("="*60 + "\n")
    
    try:
        with Session(engine) as session:
            seeder = DataSeeder(session)
            
            # Get or create user
            print("Step 1: Getting user...")
            user = seeder.get_or_create_test_user()
            
            # Ask for confirmation
            print("\n⚠️  WARNING: This will clear all existing food logs and inventory!")
            response = input("Continue? (yes/no): ").strip().lower()
            
            if response != 'yes':
                print("❌ Seeding cancelled")
                return
            
            # Clear existing data
            print("\nStep 2: Clearing existing data...")
            seeder.clear_existing_data(user)
            
            # Generate food logs
            print("\nStep 3: Generating food logs...")
            seeder.generate_food_logs(user, days=30)
            
            # Generate inventory
            print("\nStep 4: Generating inventory...")
            seeder.generate_inventory(user)
            
            # Add some imbalance
            print("\nStep 5: Creating consumption patterns...")
            seeder.generate_consumption_imbalance(user)
            
            # Print summary
            seeder.print_summary(user)
            
            print("✅ Database seeding completed successfully!\n")
            
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
