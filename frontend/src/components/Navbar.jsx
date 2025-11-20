import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center group">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                🍽️ FoodPlan
              </span>
            </Link>
            <div className="hidden md:ml-12 md:flex md:space-x-1">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-slate-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📊</span> Dashboard
              </Link>
              <Link
                to="/logs"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive('/logs')
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📝</span> Food Logs
              </Link>
              <Link
                to="/inventory"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive('/inventory')
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📦</span> Inventory
              </Link>
              <Link
                to="/resources"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive('/resources')
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📚</span> Resources
              </Link>
              <Link
                to="/upload"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive('/upload')
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">📸</span> Upload
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-all duration-200"
            >
              <span className="text-lg">👤</span>
              <span className="hidden sm:inline">{user?.username || 'Profile'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-danger text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-100">
        <div className="pt-2 pb-3 space-y-1 px-2">
          <Link
            to="/dashboard"
            className={`flex items-center px-3 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
              isActive('/dashboard')
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3">📊</span> Dashboard
          </Link>
          <Link
            to="/logs"
            className={`flex items-center px-3 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
              isActive('/logs')
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3">📝</span> Food Logs
          </Link>
          <Link
            to="/inventory"
            className={`flex items-center px-3 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
              isActive('/inventory')
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3">📦</span> Inventory
          </Link>
          <Link
            to="/resources"
            className={`flex items-center px-3 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
              isActive('/resources')
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3">📚</span> Resources
          </Link>
          <Link
            to="/upload"
            className={`flex items-center px-3 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
              isActive('/upload')
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3">📸</span> Upload
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
