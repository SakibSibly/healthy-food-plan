import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { foodLogAPI, inventoryAPI } from '../services/api';
import { resources } from '../data/seedData';

const Dashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logsRes, inventoryRes] = await Promise.all([
        foodLogAPI.getLogs(),
        inventoryAPI.getItems(),
      ]);
      
      setLogs(logsRes.data.slice(0, 5));
      setInventory(inventoryRes.data.slice(0, 5));
      
      // Simple recommendation logic based on logged categories
      const loggedCategories = logsRes.data.map(log => log.category);
      const recommended = resources.filter(resource => 
        resource.relatedCategories.some(cat => loggedCategories.includes(cat) || cat === 'all')
      ).slice(0, 3);
      
      setRecommendedResources(recommended);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="page-header">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back, <span className="font-bold text-primary-600">{user?.username}</span>! Here's your food management overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stat-card border-primary-500 bg-white hover:bg-primary-50 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Logs</p>
              <p className="text-5xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">{logs.length}</p>
              <p className="text-xs text-gray-500 font-medium">Food entries tracked</p>
            </div>
            <div className="text-6xl opacity-70 group-hover:opacity-100 transition-opacity">📝</div>
          </div>
        </div>

        <div className="stat-card border-green-500 bg-white hover:bg-green-50 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Inventory Items</p>
              <p className="text-5xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">{inventory.length}</p>
              <p className="text-xs text-gray-500 font-medium">Items in stock</p>
            </div>
            <div className="text-6xl opacity-70 group-hover:opacity-100 transition-opacity">📦</div>
          </div>
        </div>

        <div className="stat-card border-accent-500 bg-white hover:bg-accent-50 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Resources</p>
              <p className="text-5xl font-bold text-accent-600 mb-2 group-hover:scale-110 transition-transform">{resources.length}</p>
              <p className="text-xs text-gray-500 font-medium">Learning materials</p>
            </div>
            <div className="text-6xl opacity-70 group-hover:opacity-100 transition-opacity">📚</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Logs */}
        <div className="card">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="icon-circle bg-primary-100 text-primary-600">
                <span>📝</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Recent Food Logs</h2>
            </div>
            <Link to="/logs" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center space-x-1">
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-gray-100">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{log.itemName}</p>
                    <p className="text-sm text-gray-600 mt-1">{log.quantity} {log.unit}</p>
                  </div>
                  <span className="badge bg-primary-100 text-primary-800 ml-3">
                    {log.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-600 mb-4">No food logs yet. Start tracking your consumption!</p>
              <Link to="/logs" className="btn-primary inline-block">
                Add First Log
              </Link>
            </div>
          )}
        </div>

        {/* Inventory Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="icon-circle bg-green-100 text-green-600">
                <span>📦</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
            </div>
            <Link to="/inventory" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center space-x-1">
              <span>Manage</span>
              <span>→</span>
            </Link>
          </div>
          {inventory.length > 0 ? (
            <div className="space-y-3">
              {inventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-gray-100">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <span className="badge bg-green-100 text-green-800 ml-3">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-600 mb-4">Your inventory is empty. Add items to track!</p>
              <Link to="/inventory" className="btn-primary inline-block">
                Add Items
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Resources */}
        <div className="card lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
            <div className="icon-circle bg-accent-100 text-accent-600">
              <span>📚</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recommended Resources for You</h2>
          </div>
          {recommendedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedResources.map((resource) => (
                <div key={resource.id} className="border-2 border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-primary-200 transition-all bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{resource.type === 'video' ? '🎥' : '📄'}</div>
                    <span className="badge bg-accent-100 text-accent-800">
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description.substring(0, 100)}...</p>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      Related: {resource.relatedCategories.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-gray-600 mb-4">Start logging food to get personalized recommendations!</p>
              <Link to="/logs" className="btn-secondary inline-block">
                Add Your First Log
              </Link>
            </div>
          )}
          <div className="mt-6 text-center pt-6 border-t border-gray-100">
            <Link to="/resources" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center justify-center space-x-1">
              <span>View All Resources</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
