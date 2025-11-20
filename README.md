# HealthyFood Plan - AI-Powered Food Management & Sustainability Platform

**INNOVATEX Hackathon Project** | SDG 2: Zero Hunger & SDG 12: Responsible Consumption

A full-stack web application designed to reduce food waste, improve food security, and promote sustainable consumption practices through intelligent food tracking and inventory management.

## 🎯 Project Overview

HealthyFood Plan empowers individuals, families, and communities to:
- **Track food consumption** with detailed logging and history
- **Manage inventory** with expiration tracking and alerts
- **Reduce waste** through smart recommendations and resource education
- **Plan sustainably** with budget-conscious meal planning support
- **Learn best practices** via curated educational resources

This project addresses critical challenges in food security and sustainability by providing accessible tools for mindful food management, helping users make informed decisions about consumption patterns, storage practices, and waste reduction.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3 with Vite 5.x
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.x with custom design system
- **State Management:** React Context API (AuthContext)
- **HTTP Client:** Axios for API communication
- **Build Tool:** Vite (fast HMR, optimized builds)

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL with SQLModel ORM
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing
- **Migration Tool:** Alembic for database version control
- **Package Manager:** uv (ultrafast Python package installer)
- **API Documentation:** Auto-generated Swagger UI & ReDoc

### Infrastructure
- **Database:** PostgreSQL 16+
- **Development:** Hot reload for both frontend and backend
- **Deployment Ready:** Vercel configuration included

## 📋 Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18+ recommended) - [Download](https://nodejs.org/)
2. **Python** (3.8+ required) - [Download](https://www.python.org/)
3. **PostgreSQL** (v16+ recommended) - [Download](https://www.postgresql.org/)
4. **uv** (Python package installer) - Install via: `pip install uv`
5. **Git** - [Download](https://git-scm.com/)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SakibSibly/healthy-food-plan.git
cd healthy-food-plan
```

### 2. Database Setup

**Start PostgreSQL** (ensure it's running on port 5432)

**Create Database:**
```sql
CREATE DATABASE healthy_food_db;
```

**Configure Environment Variables:**

Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/healthy_food_db
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies using uv
uv sync

# Run database migrations
py -m uv run alembic upgrade head

# Start the backend server
py -m uv run fastapi dev app/api/main.py --host 0.0.0.0 --port 8000
```

**Backend will be available at:**
- API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 4. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

### 5. Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account
3. Login with your credentials
4. Start managing your food inventory!

## 📂 Project Structure

```
healthy-food-plan/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── main.py        # FastAPI app entry point
│   │   │   ├── deps.py        # Authentication dependencies
│   │   │   └── routes/        # API route handlers
│   │   │       ├── login.py   # Auth endpoints (register, login, refresh)
│   │   │       └── users.py   # User actions (inventory, logs)
│   │   ├── models.py          # SQLModel database models
│   │   ├── db.py              # Database connection
│   │   └── alembic/           # Database migrations
│   ├── pyproject.toml         # Python dependencies
│   ├── alembic.ini            # Alembic configuration
│   └── README.md              # Backend documentation
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── FoodLogs.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── FoodDatabase.jsx
│   │   │   ├── Resources.jsx
│   │   │   └── ImageUpload.jsx
│   │   ├── data/
│   │   │   └── seedData.js    # Seeded food items & resources
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   └── App.jsx            # Main app component
│   ├── package.json           # Node dependencies
│   └── tailwind.config.js     # Tailwind configuration
│
├── START_SERVERS.md           # Quick start guide
└── README.md                  # This file
```

## 🌟 Features (Part 1 - Pre-Hackathon)

### ✅ 1. Authentication & User Management
- Secure registration with email/password validation
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Protected routes and session management

### ✅ 2. User Profiles
- Comprehensive profile management
- Household size tracking
- Dietary preferences (vegetarian, vegan, gluten-free, etc.)
- Budget range settings
- Location information

### ✅ 3. Food Consumption Logging
- Manual food intake logging
- Quantity and category tracking
- Consumption history with timestamps
- Notes and metadata support
- Integration with inventory items

### ✅ 4. Inventory Management
- Add/edit/delete food items
- Expiration date tracking with alerts
- Category-based organization
- Cost tracking per item
- Quantity management
- Smart depletion when logging consumption

### ✅ 5. Food Items Database (20+ Seeded Items)
- **Dedicated Food Database page** with 20 pre-seeded common household foods
- Each item includes:
  - Item name
  - Category (dairy, fruit, vegetable, protein, grain)
  - Typical expiration period (in days)
  - Sample cost per unit
- **Features:**
  - **List view** with grid display
  - **Filter options** by category
  - **Search functionality** by name/category
  - **Sort options** (name, category, expiration, cost)
  - **Item details modal** with full information
  - Quick navigation to add items to personal inventory

### ✅ 6. Sustainable Resources (20+ Seeded)
- Curated educational content
- Categories: storage tips, waste reduction, budget planning, meal prep
- Article and video resources
- Search and filter functionality
- Save/bookmark feature

### ✅ 7. Basic Tracking Logic
- Dashboard analytics and summaries
- Recent activity views
- **Smart resource recommendations** based on logged food categories
- Transparent recommendation explanations
- Inventory status overview

### ✅ 8. Image Upload Interface
- Upload receipts and food labels (JPG/PNG)
- File validation (type and size limits)
- Image preview functionality
- Manual association with inventory/logs
- Gallery view of uploaded images
- Prepared for AI processing in Part 2

### ✅ 9. User Dashboard
- Quick overview of all activities
- Recent food logs display
- Inventory summary
- Statistics cards (total logs, inventory items, resources)
- Personalized resource recommendations
- Clear navigation to all sections

## 📊 Seeded Data

### Food Items Database (20 Items)
The application includes a comprehensive food database with common household items:
- **Dairy:** Milk, Eggs, Cheese, Yogurt, Butter
- **Fruits:** Apples, Bananas, Oranges
- **Vegetables:** Carrots, Tomatoes, Lettuce, Broccoli, Potatoes, Onions
- **Protein:** Chicken Breast, Ground Beef, Salmon
- **Grains:** Rice, Pasta, Bread

Each item includes expiration estimates (2-365 days) and cost data ($1.50-$12.00).

### Educational Resources (20 Items)
Pre-loaded resources covering:
- Food storage best practices
- Budget meal planning guides
- Waste reduction strategies
- Seasonal eating tips
- Meal prep tutorials
- Nutrition on a budget

## 🔐 Environment Variables

### Backend (.env file required)

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/healthy_food_db

# JWT Authentication
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Optional
ENVIRONMENT=development
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
py -m uv run pytest
```

### API Testing
Visit `http://localhost:8000/docs` for interactive API testing with Swagger UI.

## 📱 Usage Guide

### Getting Started
1. **Register** a new account with email and password
2. **Complete your profile** with household size, dietary preferences, and budget
3. **Browse Food Database** to see common food items and their details
4. **Add items** to your personal inventory
5. **Log food consumption** when you use items
6. **Explore resources** for tips on reducing waste and sustainable eating

### Daily Workflow
1. Check **Dashboard** for inventory status and expiration alerts
2. Log consumed food in **Food Logs**
3. Update **Inventory** when shopping
4. Review **recommended resources** based on your consumption patterns

## 🔮 Part 2 Preview (Coming in Hackathon)

The following AI-powered features will be implemented during the onsite hackathon:
- 🤖 AI-powered receipt scanning (OCR)
- 🧠 Smart expiration predictions
- 📈 Consumption pattern analysis
- 💡 Personalized meal recommendations
- 🎯 Automated inventory management from receipts
- 📊 Advanced analytics and insights

## 🐛 Troubleshooting

### Backend won't start
- Ensure PostgreSQL is running on port 5432
- Verify database credentials in `.env` file
- Run migrations: `py -m uv run alembic upgrade head`

### Frontend shows 401 Unauthorized
- Check that backend is running on port 8000
- Test backend: `curl http://localhost:8000/docs`
- Clear browser localStorage and try logging in again

### Database connection errors
- Confirm PostgreSQL is installed and running
- Verify DATABASE_URL in `.env` matches your setup
- Check firewall settings for port 5432

### Port already in use
- **Backend (8000):** Kill the process or use a different port
- **Frontend (5173):** Vite will auto-increment to 5174 if 5173 is busy

## 👥 Team & Contribution

This project was developed for the INNOVATEX Hackathon, addressing SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption and Production).

**Repository:** [https://github.com/SakibSibly/healthy-food-plan](https://github.com/SakibSibly/healthy-food-plan)

## 📄 License

See the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- INNOVATEX Hackathon organizers
- Open-source community for tools and libraries
- UN Sustainable Development Goals initiative

---

**Built with ❤️ for a sustainable future**
