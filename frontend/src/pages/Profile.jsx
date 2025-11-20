import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Extended profile data (stored locally until backend implements these fields)
  const [profile, setProfile] = useState({
    fullName: '',
    email: user?.email || '',
    householdSize: '',
    dietaryPreferences: '',
    budgetRange: '',
    location: '',
  });

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      setProfile({ ...profile, ...JSON.parse(savedProfile) });
    } else if (user) {
      setProfile(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      // Save to localStorage (replace with API call when backend is ready)
      localStorage.setItem('user_profile', JSON.stringify(profile));
      await profileAPI.updateProfile(profile);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-4xl">👤</span>
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
        </div>
        <p className="text-gray-600 text-lg ml-14">Manage your account and preferences</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-100">
          <div className="flex items-center space-x-5">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-xl transform hover:scale-105 transition-transform">
              👤
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user?.username}</h2>
              <p className="text-gray-600 text-lg mt-1">{profile.email}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Success!</p>
            <p className="text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field disabled:bg-gray-100"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Household Size
                </label>
                <select
                  name="householdSize"
                  value={profile.householdSize}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field disabled:bg-gray-100"
                >
                  <option value="">Select household size</option>
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3-4">3-4 people</option>
                  <option value="5+">5+ people</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dietary Preferences
                </label>
                <select
                  name="dietaryPreferences"
                  value={profile.dietaryPreferences}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field disabled:bg-gray-100"
                >
                  <option value="">Select preference</option>
                  <option value="none">No restrictions</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="gluten-free">Gluten-free</option>
                  <option value="halal">Halal</option>
                  <option value="kosher">Kosher</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget Range (Monthly)
                </label>
                <select
                  name="budgetRange"
                  value={profile.budgetRange}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field disabled:bg-gray-100"
                >
                  <option value="">Select budget range</option>
                  <option value="<200">Less than $200</option>
                  <option value="200-400">$200 - $400</option>
                  <option value="400-600">$400 - $600</option>
                  <option value="600+">$600+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field disabled:bg-gray-100"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSuccess('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-xs">{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


