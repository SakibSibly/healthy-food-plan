# Healthy Food Plan - Frontend

> AI-Powered Food Management & Sustainability Platform for SDG 2 & SDG 12

A modern, responsive React frontend for managing food inventory, tracking consumption, reducing waste, and promoting sustainable food practices.

## 🎯 Project Overview

This is the **frontend application** for the INNOVATEX Hackathon project, addressing:
- **SDG 2: Zero Hunger** - Improving food security and nutrition
- **SDG 12: Responsible Consumption and Production** - Reducing waste and promoting sustainability

## ✨ Features Implemented (Part 1)

### ✅ Authentication & User Management
- User registration with email validation
- Secure login/logout with JWT tokens
- Automatic token refresh
- Protected routes for authenticated users

### ✅ User Profile Management
- Edit profile with dietary preferences
- Household size configuration
- Budget range selection
- Location settings

### ✅ Food Consumption Logging
- Manual food usage logging
- Category-based organization
- Consumption history tracking
- Quantity and unit tracking

### ✅ Inventory Management
- Add/edit/delete food items
- Category filtering
- Expiration date tracking
- Visual alerts for expiring items
- Seeded food items database (20+ items)

### ✅ Resources Library
- 20+ curated sustainability resources
- Articles and video content
- Category-based filtering
- Personalized recommendations based on logged foods
- Transparent recommendation logic

### ✅ Image Upload Interface
- Receipt and food label upload (JPG/PNG support)
- Image preview before upload
- Gallery of uploaded images
- Storage for future AI processing (Part 2)

### ✅ Dashboard
- Quick overview of logs and inventory
- Recommended resources
- Summary statistics
- Easy navigation to all features

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Containerization**: Docker + Nginx

## 📋 Prerequisites

Choose one of the following methods:

### Option 1: Using Docker (Recommended)
- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

### Option 2: Local Development
- [Node.js](https://nodejs.org/) 18+ installed
- npm or yarn package manager

## 🚀 Quick Start

### Method 1: Using Docker (Production-ready)

1. **Clone the repository**
```bash
git clone https://github.com/mushfiq-nehal/healthy-food-plan-2.git
cd healthy-food-plan-2/frontend
```

2. **Configure environment** (Optional)
```bash
# Copy and edit .env.docker if needed
cp .env.docker .env
```

3. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000 (if running)

### Method 2: Local Development

1. **Clone the repository**
```bash
git clone https://github.com/mushfiq-nehal/healthy-food-plan-2.git
cd healthy-food-plan-2/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env to set your backend API URL
# VITE_API_URL=http://localhost:8000
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the application**
   - Open http://localhost:5173 in your browser

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/            # React Context for state
│   │   └── AuthContext.jsx # Authentication context
│   ├── data/               # Seeded data
│   │   └── seedData.js     # Food items & resources
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Profile.jsx     # User profile
│   │   ├── FoodLogs.jsx    # Food logging
│   │   ├── Inventory.jsx   # Inventory management
│   │   ├── Resources.jsx   # Resources library
│   │   └── ImageUpload.jsx # Image upload
│   ├── services/           # API services
│   │   └── api.js          # API client & endpoints
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── nginx.conf              # Nginx configuration
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Docker
```bash
# Build and start containers
docker-compose up --build

# Start containers (already built)
docker-compose up

# Stop containers
docker-compose down

# View logs
docker-compose logs -f frontend
```

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Frontend port (for Docker)
FRONTEND_PORT=3000
```

## 🔐 Authentication Flow

1. **Register**: Create account with username, email, and password
2. **Login**: Authenticate and receive JWT tokens (access + refresh)
3. **Auto-refresh**: Access token automatically refreshes when expired
4. **Protected Routes**: All pages except login/register require authentication

## 💾 Data Storage

### Connected to Backend:
- User authentication (login, register, logout)
- User profile information (username, email, ID)

### Local Storage (Mock - Ready for Backend):
- Food consumption logs
- Inventory items
- User profile preferences
- Uploaded images

> **Note**: Features using localStorage are ready to connect to backend APIs when implemented.

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Tailwind CSS**: Utility-first styling with custom theme
- **Clean UI**: Modern, accessible interface
- **Visual Feedback**: Loading states, success messages, error handling
- **Intuitive Navigation**: Clear menu structure

## 🔄 Integration with Backend

### Currently Connected:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `GET /auth/users/me` - Get current user

### Ready for Integration (Mock APIs in place):
- Profile updates
- Food logs CRUD
- Inventory CRUD
- Image processing

## 🚀 Deployment

### Using Docker (Production)

```bash
# Build the image
docker build -t healthy-food-plan-frontend .

# Run the container
docker run -p 3000:80 \
  -e VITE_API_URL=http://your-backend-url \
  healthy-food-plan-frontend
```

### Build for Static Hosting

```bash
# Build production bundle
npm run build

# The dist/ folder contains static files ready for deployment
# Deploy to: Vercel, Netlify, GitHub Pages, etc.
```

## 📊 Seeded Data

### Food Items Database
- 20 common household food items
- Categories: dairy, fruit, vegetable, protein, grain
- Typical expiration periods
- Sample cost per unit

### Resources Library
- 20 sustainability resources
- Categories: storage, budget, waste-reduction, meal-planning
- Mix of articles and videos
- Related to specific food categories

## 🔮 Future Enhancements (Part 2)

- AI-powered receipt scanning
- Automated inventory from receipts
- OCR for food labels
- Nutrition analysis
- Smart recommendations based on AI
- Advanced analytics and reporting
- Community features
- Recipe suggestions

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
FRONTEND_PORT=3001

# Or use different port in Docker
docker-compose up --build -e FRONTEND_PORT=3001
```

### Cannot Connect to Backend
1. Ensure backend is running on http://localhost:8000
2. Check CORS configuration in backend
3. Verify VITE_API_URL in .env file

### Docker Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## 👥 Team Collaboration

This frontend is designed to work seamlessly with the backend:
1. Backend runs on port 8000
2. Frontend runs on port 3000 (Docker) or 5173 (dev)
3. API calls automatically include authentication tokens
4. Mock APIs allow frontend development independent of backend

## 📝 License

This project is part of the INNOVATEX Hackathon.

## 🤝 Contributing

For hackathon team members:
1. Create feature branches
2. Test thoroughly before merging
3. Keep mock APIs updated with backend schema
4. Document new features in README

## 📞 Support

For issues or questions during the hackathon:
- Check backend API documentation at http://localhost:8000/docs
- Review console logs for errors
- Test API endpoints with Postman/Thunder Client

---

**Built for INNOVATEX Hackathon - SDG 2 & SDG 12**  
*Zero Hunger | Responsible Consumption and Production*
