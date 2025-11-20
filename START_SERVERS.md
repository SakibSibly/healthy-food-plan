# Starting the Application

## Prerequisites
Make sure PostgreSQL is running on port 5432

## Step 1: Start Backend Server

Open a terminal and run:

```powershell
cd C:\Users\mdama\OneDrive\Desktop\healthy-food-plan\backend
$env:PYTHONPATH = (Get-Location).Path
py -m uv run fastapi dev app/api/main.py --host 0.0.0.0 --port 8000
```

Wait until you see:
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Step 2: Start Frontend Server

Open a NEW terminal and run:

```powershell
cd C:\Users\mdama\OneDrive\Desktop\healthy-food-plan\frontend
npm run dev
```

Wait until you see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 3: Access Application

Open your browser and go to: http://localhost:5173

## Troubleshooting

### If you see 401 Unauthorized errors:
1. Make sure the backend is running on port 8000
2. Test backend: http://localhost:8000/docs
3. Clear browser localStorage and refresh

### If backend won't start:
1. Check if PostgreSQL is running
2. Check database connection in `backend/.env` or environment variables
3. Run migrations: `py -m uv run alembic upgrade head`

### If you get CORS errors:
- The Vite proxy is configured to forward `/auth` and `/actions` to `http://localhost:8000`
- Make sure backend is running on port 8000
