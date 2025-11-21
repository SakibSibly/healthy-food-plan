from fastapi import APIRouter, Depends
from app.models import User
from app.db import get_session
from sqlmodel import Session, select
from typing import Annotated

router = APIRouter(
    prefix="/utils",
    tags=["utility feature"]
)

@router.get("/all-users")
def get_all_users(
    session: Annotated[Session, Depends(get_session)]
):
    users = session.exec(select(User)).all()
    return users

@router.get("/user/{user_id}")
def get_user_by_id(
    user_id: int,
    session: Annotated[Session, Depends(get_session)]
):
    user = session.get(User, user_id)
    if not user:
        return {"error": "User not found"}
    return user