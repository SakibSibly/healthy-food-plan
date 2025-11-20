# Healthy Food Plan - Backend

## Prerequisites

- Python 3.8+
- [uv](https://github.com/astral-sh/uv) package installer

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SakibSibly/healthy-food-plan.git
cd healthy-food-plan/backend
```

2. Install dependencies using uv:
```bash
uv sync 
```

## Running the Project

Start the FastAPI development server:
```bash
uv run fastapi dev app/api/main.py
```

The server will be available at `http://localhost:8000`

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── README.md
├── alembic.ini
├── app
│   ├── alembic
│   │   ├── README
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions
│   ├── api
│   │   ├── __init__.py
│   │   ├── main.py            # Main entry point
│   │   └── routes
│   ├── db.py
│   └── models.py
├── pyproject.toml             # Project requirements
├── scripts
│   └── test.sh
├── tests
│   ├── __init__.py
│   └── api
│       ├── __init__.py
│       ├── routes
│       └── test_main.py
├── uv.lock
└── vercel.json
```

## Development

To run with auto-reload on file changes:
```bash
uv run fastapi dev --reload
```

## Additional Commands

```bash
# Install new dependency
uv pip install <package-name>

# Update dependencies
uv sync --upgrade
```