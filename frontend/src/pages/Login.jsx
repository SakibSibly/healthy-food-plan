import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/HFP-logo-full.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-5 bg-white rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-all duration-300 border border-primary-100">
            <img src={logo} alt="HealthyFood Plan" className="h-20" />
          </div>
          <h1 className="text-5xl font-bold text-neutral-800 mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-xl text-neutral-600">Sign in to continue your healthy journey</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-neutral-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error animate-slide-down">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-bold text-sm">Authentication Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-neutral-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500 font-semibold">New to HealthyFood?</span>
            </div>
          </div>

          <div className="text-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center w-full btn-secondary text-base"
            >
              <span>Create an Account</span>
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-100/50">
            <div className="text-3xl mb-2">🍎</div>
            <p className="text-xs font-semibold text-neutral-700">Track Meals</p>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-100/50">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-xs font-semibold text-neutral-700">Analytics</p>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-100/50">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-xs font-semibold text-neutral-700">Goals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;