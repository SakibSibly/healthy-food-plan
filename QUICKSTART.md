# Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL 16+
- uv package installer: `pip install uv`

## Database Setup

```powershell
# Start PostgreSQL and create database
createdb healthy_food_db

# Create .env file in backend directory
# Add: DATABASE_URL=postgresql://username:password@localhost:5432/healthy_food_db
```

## Backend Setup

```powershell
cd backend

# Install dependencies
uv sync

# Run migrations
py -m uv run alembic upgrade head

# Start backend server
py -m uv run fastapi dev app/api/main.py --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

## Frontend Setup

**Open a new terminal:**

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Access Application

1. Open browser: `http://localhost:5173`
2. Register a new account
3. Login and start managing your food inventory!

## Troubleshooting

**Backend won't start?**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`

**Frontend shows 401?**
- Ensure backend is running on port 8000
- Clear browser localStorage

---

**For full documentation, see [README.md](README.md)**
