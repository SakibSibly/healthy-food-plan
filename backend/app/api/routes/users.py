from fastapi import Depends
from fastapi.routing import APIRouter
from fastapi import HTTPException
from app.models import User, InventoryItem
from app.api.deps import get_current_user
from app.db import get_session
from typing import Annotated
from sqlmodel import Session, select, Field, SQLModel
import uuid


class InventoryItemCreate(SQLModel):
    name: str = Field(max_length=100)
    category: str | None = Field(default=None, max_length=50)
    quantity: float = Field(default=0.0, ge=0.0)
    cost: float = Field(default=None, ge=0.0)
    expiration_date: str | None = Field(default=None, max_length=20)
    notes: str | None = Field(default=None, max_length=200)


router = APIRouter(
    prefix="/actions",
    tags=["user features"]
)


# Inventory endpoints

@router.post("/inventory/", response_model=InventoryItem)
def add_inventory_item(
    item: InventoryItemCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Add an item to the user's inventory."""
    db_item = InventoryItem(
        name=item.name,
        category=item.category,
        quantity=item.quantity,
        cost=item.cost,
        expiration_date=item.expiration_date,
        notes=item.notes,
        user_id=current_user.id
    )
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.get("/inventory/", response_model=list[InventoryItem])
def get_inventory_items(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Get all inventory items for the current user."""
    items = session.exec(
        select(InventoryItem).where(InventoryItem.user_id == current_user.id)
    ).all()
    return items


@router.get("/inventory/{item_id}", response_model=InventoryItem)
def get_inventory_item(
    item_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]):
    """Get a specific inventory item by ID for the current user."""
    item = session.get(InventoryItem, item_id)
    if item is None or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

