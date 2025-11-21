"""
Seed demo data for testing: inventory items and 30 days of food consumption logs
"""
import sys
from datetime import datetime, timedelta
from pathlib import Path
import random

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlmodel import Session, select
from app.models import User, InventoryItem, FoodLog
from app.db import engine

# Food items with realistic data
FOOD_ITEMS = [
    {"name": "Milk", "category": "dairy", "quantity": 2, "unit": "liters", "cost": 4.50, "expiration_days": 7},
    {"name": "Eggs", "category": "protein", "quantity": 12, "unit": "pieces", "cost": 5.00, "expiration_days": 21},
    {"name": "Chicken Breast", "category": "protein", "quantity": 1.5, "unit": "kg", "cost": 12.00, "expiration_days": 3},
    {"name": "Broccoli", "category": "vegetable", "quantity": 0.5, "unit": "kg", "cost": 3.00, "expiration_days": 5},
    {"name": "Rice", "category": "grain", "quantity": 2, "unit": "kg", "cost": 6.00, "expiration_days": 365},
    {"name": "Apples", "category": "fruit", "quantity": 1, "unit": "kg", "cost": 4.00, "expiration_days": 14},
    {"name": "Tomatoes", "category": "vegetable", "quantity": 0.8, "unit": "kg", "cost": 3.50, "expiration_days": 7},
    {"name": "Pasta", "category": "grain", "quantity": 1, "unit": "kg", "cost": 2.50, "expiration_days": 730},
    {"name": "Yogurt", "category": "dairy", "quantity": 1, "unit": "kg", "cost": 4.00, "expiration_days": 14},
    {"name": "Bananas", "category": "fruit", "quantity": 1.2, "unit": "kg", "cost": 2.00, "expiration_days": 5},
    {"name": "Cheese", "category": "dairy", "quantity": 0.5, "unit": "kg", "cost": 8.00, "expiration_days": 30},
    {"name": "Bread", "category": "grain", "quantity": 1, "unit": "loaf", "cost": 3.00, "expiration_days": 5},
    {"name": "Carrots", "category": "vegetable", "quantity": 1, "unit": "kg", "cost": 2.00, "expiration_days": 21},
    {"name": "Salmon", "category": "protein", "quantity": 0.5, "unit": "kg", "cost": 15.00, "expiration_days": 2},
    {"name": "Lettuce", "category": "vegetable", "quantity": 1, "unit": "head", "cost": 2.50, "expiration_days": 7},
]

# Consumption patterns (quantity consumed per log)
CONSUMPTION_PATTERNS = {
    "Milk": (0.2, 0.3),  # 200-300ml per consumption
    "Eggs": (2, 3),  # 2-3 eggs
    "Chicken Breast": (0.15, 0.25),  # 150-250g
    "Broccoli": (0.1, 0.2),  # 100-200g
    "Rice": (0.1, 0.15),  # 100-150g
    "Apples": (0.15, 0.25),  # 1-2 apples
    "Tomatoes": (0.1, 0.2),  # 100-200g
    "Pasta": (0.1, 0.15),  # 100-150g
    "Yogurt": (0.15, 0.2),  # 150-200g
    "Bananas": (0.15, 0.3),  # 1-2 bananas
    "Cheese": (0.05, 0.1),  # 50-100g
    "Bread": (0.1, 0.2),  # 2-3 slices
    "Carrots": (0.1, 0.15),  # 100-150g
    "Salmon": (0.15, 0.2),  # 150-200g
    "Lettuce": (0.1, 0.15),  # portion
}


def seed_demo_data(user_email: str):
    """Seed demo data for a specific user"""
    
    with Session(engine) as session:
        # Get the user
        statement = select(User).where(User.email == user_email)
        user = session.exec(statement).first()
        
        if not user:
            print(f"❌ User with email '{user_email}' not found!")
            print("Please register a user first in the application.")
            return
        
        print(f"✅ Found user: {user.email}")
        
        # Clear existing data for this user
        print("\n🧹 Cleaning existing data...")
        existing_logs = session.exec(select(FoodLog).where(FoodLog.user_id == user.id)).unique().all()
        for log in existing_logs:
            session.delete(log)
        
        existing_inventory = session.exec(select(InventoryItem).where(InventoryItem.user_id == user.id)).unique().all()
        for item in existing_inventory:
            session.delete(item)
        
        session.commit()
        print("✅ Cleaned existing data")
        
        # Create inventory items
        print("\n📦 Creating inventory items...")
        inventory_items = []
        for item_data in FOOD_ITEMS:
            expiration_date = datetime.now() + timedelta(days=item_data["expiration_days"])
            
            inventory_item = InventoryItem(
                user_id=user.id,
                name=item_data["name"],
                quantity=item_data["quantity"],
                category=item_data["category"],
                expiration_date=str(expiration_date.date()),
                cost=item_data["cost"],
                notes=f"Purchased {random.randint(1, 7)} days ago"
            )
            session.add(inventory_item)
            inventory_items.append(inventory_item)
        
        session.commit()
        print(f"✅ Created {len(inventory_items)} inventory items")
        
        # Create food consumption logs for the last 30 days
        print("\n🍽️  Creating food consumption logs for last 30 days...")
        food_logs = []
        
        for days_ago in range(30):
            # Random number of consumption events per day (2-5)
            num_logs = random.randint(2, 5)
            consumption_date = datetime.now() - timedelta(days=days_ago)
            
            # Select random items to consume on this day
            consumed_items = random.sample(FOOD_ITEMS, min(num_logs, len(FOOD_ITEMS)))
            
            for item_data in consumed_items:
                # Get quantity range for this item
                min_qty, max_qty = CONSUMPTION_PATTERNS[item_data["name"]]
                quantity = round(random.uniform(min_qty, max_qty), 2)
                
                # Add some time variation to the consumption
                hours_offset = random.randint(6, 22)  # Between 6 AM and 10 PM
                minutes_offset = random.randint(0, 59)
                log_time = consumption_date.replace(
                    hour=hours_offset,
                    minute=minutes_offset,
                    second=0,
                    microsecond=0
                )
                
                food_log = FoodLog(
                    user_id=user.id,
                    item_name=item_data["name"],
                    quantity=quantity,
                    unit=item_data["unit"],
                    category=item_data["category"],
                    consumed_at=log_time.isoformat(),
                    created_at=log_time.isoformat(),
                    notes=f"Consumed as part of {'breakfast' if hours_offset < 10 else 'lunch' if hours_offset < 15 else 'dinner'}"
                )
                session.add(food_log)
                food_logs.append(food_log)
        
        session.commit()
        print(f"✅ Created {len(food_logs)} food consumption logs")
        
        # Print summary statistics
        print("\n" + "="*60)
        print("📊 DEMO DATA SUMMARY")
        print("="*60)
        print(f"User: {user.email}")
        print(f"Inventory Items: {len(inventory_items)}")
        print(f"Food Logs (30 days): {len(food_logs)}")
        
        # Category breakdown
        print("\n📈 Consumption by Category:")
        categories = {}
        for log in food_logs:
            categories[log.category] = categories.get(log.category, 0) + 1
        
        for category, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
            print(f"  • {category.capitalize()}: {count} logs")
        
        # Daily average
        print(f"\n📅 Average logs per day: {len(food_logs) / 30:.1f}")
        
        print("\n✅ Demo data seeded successfully!")
        print("\n💡 You can now:")
        print("   • View your inventory at http://localhost:5173/inventory")
        print("   • Check food logs at http://localhost:5173/food-logs")
        print("   • See analytics at http://localhost:5173/analytics")


if __name__ == "__main__":
    print("="*60)
    print("🌱 DEMO DATA SEEDER")
    print("="*60)
    
    if len(sys.argv) > 1:
        user_email = sys.argv[1]
    else:
        user_email = input("\nEnter user email: ").strip()
    
    if not user_email:
        print("❌ Email is required!")
        sys.exit(1)
    
    seed_demo_data(user_email)
