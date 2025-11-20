import { useState, useEffect } from 'react';
import { foodLogAPI } from '../services/api';
import { categories } from '../data/seedData';

const FoodLogs = () => {
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: 'pieces',
    category: '',
    notes: '',
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await foodLogAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await foodLogAPI.createLog(formData);
      setFormData({
        itemName: '',
        quantity: '',
        unit: 'pieces',
        category: '',
        notes: '',
      });
      setShowForm(false);
      loadLogs();
    } catch (error) {
      console.error('Failed to create log:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await foodLogAPI.deleteLog(id);
        loadLogs();
      } catch (error) {
        console.error('Failed to delete log:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between page-header">
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="icon-circle bg-primary-100 text-primary-600 w-16 h-16 text-3xl">
              <span>📝</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Food Consumption Logs</h1>
          </div>
          <p className="text-gray-600 text-lg ml-20">Track your daily food usage and consumption history</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? '✕ Cancel' : '+ Add Log'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 border-2 border-primary-100">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">✏️</span>
            <h2 className="text-xl font-bold text-gray-900">New Food Log</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Milk, Eggs"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="input-field"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="liters">Liters</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="cups">Cups</option>
                  <option value="servings">Servings</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="submit" className="btn-primary flex-1">
                💾 Save Log
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    itemName: '',
                    quantity: '',
                    unit: 'pieces',
                    category: '',
                    notes: '',
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logs List */}
      <div className="card">
        <div className="section-header pb-4 border-b border-gray-100">
          <div className="icon-circle bg-primary-100 text-primary-600">
            <span>📋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Consumption History</h2>
        </div>
        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-gray-100 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{log.itemName}</h3>
                    <span className="badge bg-primary-100 text-primary-800">
                      {log.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-semibold">
                      📊 {log.quantity} {log.unit}
                    </span>
                    {log.date && (
                      <span className="text-xs text-gray-400">
                        🕒 {new Date(log.date).toLocaleDateString()} at{' '}
                        {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-sm text-gray-600 mt-2 p-3 bg-white rounded-lg border border-gray-100 italic">
                      💬 {log.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="btn-danger text-xs ml-4 whitespace-nowrap"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No food logs yet</p>
            <p className="text-gray-600 mb-6">Start tracking your food consumption by adding your first log!</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              + Add Your First Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLogs;


