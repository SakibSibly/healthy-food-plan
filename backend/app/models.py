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
    inventory_items: list["InventoryItem"] = Relationship(back_populates="user", sa_relationship_kwargs={"lazy": "joined"})
    food_logs: list["FoodLog"] = Relationship(back_populates="user", sa_relationship_kwargs={"lazy": "joined"})


class UserWithInventory(UserBase):
    id: uuid.UUID
    inventory_items: list["InventoryItem"] = []


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
    user: User | None = Relationship(back_populates="inventory_items", sa_relationship_kwargs={"lazy": "joined"})


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
    user: User | None = Relationship(back_populates="food_logs", sa_relationship_kwargs={"lazy": "joined"})