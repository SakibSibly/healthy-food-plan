import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/HFP-logo-full.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center group">
            <div className="flex items-center px-2 py-2 rounded-2xl bg-white hover:bg-primary-50 transition-all duration-300 group-hover:scale-105">
              <img src={logo} alt="HealthyFood" className="h-12" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-[#3E7C59] text-white'
                  : 'text-neutral-700 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/logs"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/logs')
                  ? 'bg-[#3E7C59] text-white'
                  : 'text-neutral-700 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
              }`}
            >
              Logs
            </Link>
            <Link
              to="/inventory"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/inventory')
                  ? 'bg-[#3E7C59] text-white'
                  : 'text-neutral-700 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
              }`}
            >
              Inventory
            </Link>
            <Link
              to="/food-database"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/food-database')
                  ? 'bg-[#3E7C59] text-white'
                  : 'text-neutral-700 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
              }`}
            >
              Food DB
            </Link>
            <Link
              to="/analytics"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/analytics')
                  ? 'bg-[#3E7C59] text-white'
                  : 'text-neutral-700 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
              }`}
            >
              Analytics
            </Link>
            <Link
              to="/meal-planner"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/meal-planner')
                  ? 'bg-[#3E7C59] text-white'
                  : 'text-neutral-700 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
              }`}
            >
              Planner
            </Link>
            <Link
              to="/resources"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/resources')
                  ? 'bg-[#3E7C59] text-white'
                  : 'text-neutral-700 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
              }`}
            >
              Resources
            </Link>
          </div>

          {/* User Menu - Merged Profile & Logout */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-neutral-700 hover:text-[#3E7C59] px-3 py-2 rounded-lg hover:bg-[#3E7C59]/10 text-sm font-medium transition-all duration-200">
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline">{user?.username || 'User'}</span>
              <span className="text-xs">▾</span>
            </button>
            
            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]">
                  >
                    Profile Settings
                  </Link>
                  <hr className="my-1 border-neutral-200" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden border-t border-neutral-100/50 bg-white/90 backdrop-blur-xl">
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/dashboard')
                ? 'bg-[#3E7C59] text-white'
                : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-neutral-900'
            }`}>
          >
            Dashboard
          </Link>
          <Link
            to="/logs"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/logs')
                ? 'bg-[#3E7C59] text-white'
                : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-neutral-900'
            }`}>
          >
            Food Logs
          </Link>
          <Link
            to="/inventory"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/inventory')
                ? 'bg-[#3E7C59] text-white'
                : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-neutral-900'
            }`}>
          >
            Inventory
          </Link>
          <Link
            to="/food-database"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/food-database')
                ? 'bg-[#3E7C59] text-white'
                : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-neutral-900'
            }`}>
          >
            Food Database
          </Link>
          <Link
            to="/analytics"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/analytics')
                ? 'bg-[#3E7C59] text-white'
                : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-neutral-900'
            }`}>
          >
            Analytics
          </Link>
          <Link
            to="/meal-planner"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/meal-planner')
                ? 'bg-[#3E7C59] text-white'
                : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-neutral-900'
            }`}>
          >
            Meal Planner
          </Link>
          <Link
            to="/resources"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/resources')
                ? 'bg-[#3E7C59] text-white'
                : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-neutral-900'
            }`}>
          >
            Resources
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;