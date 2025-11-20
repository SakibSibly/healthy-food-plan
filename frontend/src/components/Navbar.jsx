import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/HFP-logo-full.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/dashboard"
              className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive('/dashboard')
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <span className="mr-2 text-lg">📊</span> Dashboard
            </Link>
            <Link
              to="/logs"
              className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive('/logs')
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <span className="mr-2 text-lg">📝</span> Food Logs
            </Link>
            <Link
              to="/inventory"
              className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive('/inventory')
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <span className="mr-2 text-lg">📦</span> Inventory
            </Link>
            <Link
              to="/food-database"
              className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive('/food-database')
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <span className="mr-2 text-lg">📖</span> Food DB
            </Link>
            <Link
              to="/resources"
              className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive('/resources')
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <span className="mr-2 text-lg">📚</span> Resources
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="flex items-center space-x-3 text-neutral-700 hover:text-primary-700 px-4 py-2.5 rounded-xl hover:bg-primary-50 text-sm font-semibold transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white">
                {user?.username?.charAt(0).toUpperCase() || '👤'}
              </div>
              <span className="hidden sm:inline">{user?.username || 'Profile'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-danger text-sm flex items-center space-x-2"
            >
              <span>Logout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden border-t border-neutral-100/50 bg-white/90 backdrop-blur-xl">
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
              isActive('/dashboard')
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-neutral-900'
            }`}
          >
            <span className="mr-3 text-xl">📊</span> Dashboard
          </Link>
          <Link
            to="/logs"
            className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
              isActive('/logs')
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-neutral-900'
            }`}
          >
            <span className="mr-3 text-xl">📝</span> Food Logs
          </Link>
          <Link
            to="/inventory"
            className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
              isActive('/inventory')
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-neutral-900'
            }`}
          >
            <span className="mr-3 text-xl">📦</span> Inventory
          </Link>
          <Link
            to="/food-database"
            className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
              isActive('/food-database')
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-neutral-900'
            }`}
          >
            <span className="mr-3 text-xl">📖</span> Food Database
          </Link>
          <Link
            to="/resources"
            className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
              isActive('/resources')
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-neutral-900'
            }`}
          >
            <span className="mr-3 text-xl">📚</span> Resources
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;