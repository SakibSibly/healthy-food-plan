from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
import uuid


class UserBase(SQLModel):
    username: str = Field(default=None, unique=True, index=True, max_length=50)
    email: EmailStr = Field(default=None, unique=True, index=True, max_length=100)
    full_name: str | None = Field(default=None, max_length=100)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    account_type: str | None = Field(default=None, max_length=50)
    housing_size: int = Field(default=1, ge=1, le=100)
    budget_pref: float = Field(default=0.0, ge=0.0)
    dietary_pref: str | None = Field(default=None, max_length=50)
    dietary_restrictions: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=100)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    hashed_password: str = Field(default=None, max_length=256)
    inventory_items: list["InventoryItem"] = Relationship(back_populates="user")
    food_logs: list["FoodLog"] = Relationship(back_populates="user")
    meal_plans: list["MealPlan"] = Relationship(back_populates="user")


class UserWithUtils(UserBase):
    id: uuid.UUID
    inventory_items: list["InventoryItem"] = []
    food_logs: list["FoodLog"] = []
    meal_plans: list["MealPlan"] = []


class UserPublic(UserBase):
    id: uuid.UUID


class UserLogin(SQLModel):
    username: str = Field(default=None, max_length=50)
    password: str = Field(default=None, max_length=256)


class UserCreate(UserBase):
    password: str = Field(default=None, max_length=256)


class InventoryItemBase(SQLModel):
    name: str = Field(default=None, max_length=100)
    category: str | None = Field(default=None, max_length=50)
    quantity: float = Field(default=0.0, ge=0.0)
    cost: float = Field(default=None, ge=0.0)
    expiration_date: str | None = Field(default=None, max_length=20)
    notes: str | None = Field(default=None, max_length=200)
    user_id: uuid.UUID | None = Field(foreign_key="user.id", ondelete="CASCADE")


class InventoryItem(InventoryItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    user: User | None = Relationship(back_populates="inventory_items")


class TokenResponse(SQLModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(SQLModel):
    refresh_token: str


class TokenBlacklist(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    token: str = Field(index=True, unique=True)


class FoodLogBase(SQLModel):
    item_name: str = Field(max_length=100)
    quantity: float = Field(ge=0.0)
    unit: str = Field(max_length=50)
    category: str = Field(max_length=50)
    notes: str | None = Field(default=None, max_length=500)
    consumed_at: str | None = Field(default=None, max_length=30)
    inventory_item_id: uuid.UUID | None = Field(default=None, foreign_key="inventoryitem.id", ondelete="SET NULL")


class FoodLog(FoodLogBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", ondelete="CASCADE")
    created_at: str = Field(max_length=30)
    user: User | None = Relationship(back_populates="food_logs")


# Meal Planning Models

class MealPlanBase(SQLModel):
    name: str = Field(max_length=100)
    description: str | None = Field(default=None, max_length=500)
    start_date: str = Field(max_length=20)
    end_date: str = Field(max_length=20)
    target_budget: float = Field(ge=0.0)
    total_cost: float | None = Field(default=0.0, ge=0.0)
    status: str = Field(default="active", max_length=20)  # active, completed, archived
    user_id: uuid.UUID = Field(foreign_key="user.id", ondelete="CASCADE")


class MealPlan(MealPlanBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    created_at: str = Field(max_length=30)
    user: User | None = Relationship(back_populates="meal_plans")


class MealPlanItemBase(SQLModel):
    meal_plan_id: uuid.UUID = Field(foreign_key="mealplan.id", ondelete="CASCADE")
    day_of_week: int = Field(ge=0, le=6)  # 0=Monday, 6=Sunday
    meal_type: str = Field(max_length=20)  # breakfast, lunch, dinner, snack
    food_name: str = Field(max_length=100)
    quantity: float = Field(ge=0.0)
    unit: str = Field(max_length=20)
    estimated_cost: float = Field(ge=0.0)
    calories: float | None = Field(default=None, ge=0.0)
    protein: float | None = Field(default=None, ge=0.0)
    carbs: float | None = Field(default=None, ge=0.0)
    fats: float | None = Field(default=None, ge=0.0)
    uses_inventory: bool = Field(default=False)
    inventory_item_id: uuid.UUID | None = Field(default=None)
    notes: str | None = Field(default=None, max_length=200)


class MealPlanItem(MealPlanItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)


# Chatbot Models

class ChatSessionBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id", ondelete="CASCADE")
    title: str = Field(default="New Chat", max_length=200)
    is_active: bool = Field(default=True)


class ChatSession(ChatSessionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    created_at: str = Field(max_length=30)
    updated_at: str = Field(max_length=30)
    user: User | None = Relationship(sa_relationship_kwargs={"lazy": "joined"})


class ChatMessageBase(SQLModel):
    session_id: uuid.UUID = Field(foreign_key="chatsession.id", ondelete="CASCADE")
    role: str = Field(max_length=20)  # user, assistant, system
    content: str = Field(max_length=10000)


class ChatMessage(ChatMessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    created_at: str = Field(max_length=30)


class ChatRequest(SQLModel):
    message: str = Field(max_length=5000)
    session_id: uuid.UUID | None = None


class ChatResponse(SQLModel):
    session_id: uuid.UUID
    message: str
    timestamp: str