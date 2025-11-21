from sqlmodel import Session, select
from app.models import User
from app.db import engine

with Session(engine) as session:
    users = session.exec(select(User.email)).all()
    if users:
        print("Registered users:")
        for email in users:
            print(f"  - {email}")
    else:
        print("No users found. Please register at http://localhost:5173/register")
