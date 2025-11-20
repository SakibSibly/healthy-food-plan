import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { foodLogAPI, inventoryAPI } from '../services/api';
import { resources } from '../data/seedData';
import bannerImage from '../assets/banner.png';

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
      // Set empty arrays on error to prevent UI issues
      setLogs([]);
      setInventory([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 group border-4 border-white/50 max-h-80">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
        
        <img 
          src={bannerImage} 
          alt="Healthy Food Plan Banner" 
          className="w-full h-auto max-h-80 object-cover transition-all duration-700 group-hover:scale-105 brightness-100 group-hover:brightness-105"
        />
        
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full"></div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stat-card group cursor-pointer bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">Total Logs</p>
              <p className="text-6xl font-bold text-white mb-2">{logs.length}</p>
              <p className="text-sm text-white/70 font-medium">Food entries tracked</p>
            </div>
            <div className="text-7xl opacity-80 group-hover:opacity-100 transition-opacity">📝</div>
          </div>
        </div>

        <div className="stat-card group cursor-pointer bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">Inventory Items</p>
              <p className="text-6xl font-bold text-white mb-2">{inventory.length}</p>
              <p className="text-sm text-white/70 font-medium">Items in stock</p>
            </div>
            <div className="text-7xl opacity-80 group-hover:opacity-100 transition-opacity">📦</div>
          </div>
        </div>

        <div className="stat-card group cursor-pointer bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">Resources</p>
              <p className="text-6xl font-bold text-white mb-2">{resources.length}</p>
              <p className="text-sm text-white/70 font-medium">Learning materials</p>
            </div>
            <div className="text-7xl opacity-80 group-hover:opacity-100 transition-opacity">📚</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Logs */}
        <div className="card">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl shadow-lg">
                <span>📝</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-800">Recent Food Logs</h2>
            </div>
            <Link to="/logs" className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center space-x-1 hover:underline">
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-primary-50/30 rounded-2xl border border-primary-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex-1">
                    <p className="font-bold text-neutral-800 text-lg">{log.item_name}</p>
                    <p className="text-sm text-neutral-600 mt-1 font-medium">{log.quantity} {log.unit}</p>
                  </div>
                  <span className="badge bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 ml-3 shadow-md">
                    {log.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-neutral-700 mb-4 font-semibold text-lg">No food logs yet. Start tracking your consumption!</p>
              <Link to="/logs" className="btn-primary inline-block">
                Add First Log
              </Link>
            </div>
          )}
        </div>

        {/* Inventory Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-2xl shadow-lg">
                <span>📦</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-800">Inventory</h2>
            </div>
            <Link to="/inventory" className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center space-x-1 hover:underline">
              <span>Manage</span>
              <span>→</span>
            </Link>
          </div>
          {inventory.length > 0 ? (
            <div className="space-y-3">
              {inventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-accent-50/30 rounded-2xl border border-accent-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex-1">
                    <p className="font-bold text-neutral-800 text-lg">{item.name}</p>
                    <p className="text-sm text-neutral-600 mt-1 font-medium">Qty: {item.quantity}</p>
                  </div>
                  <span className="badge bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 ml-3 shadow-md">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-neutral-700 mb-4 font-semibold text-lg">Your inventory is empty. Add items to track!</p>
              <Link to="/inventory" className="btn-primary inline-block">
                Add Items
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Resources */}
        <div className="card lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-primary-100">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-2xl shadow-lg">
              <span>📚</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800">Recommended Resources for You</h2>
          </div>
          {recommendedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedResources.map((resource) => (
                <div key={resource.id} className="bg-white border border-primary-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{resource.type === 'video' ? '🎥' : '📄'}</div>
                    <span className="badge bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1 shadow-md">
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-neutral-800 mb-2 text-lg">{resource.title}</h3>
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{resource.description.substring(0, 100)}...</p>
                  <div className="pt-3 border-t-2 border-primary-100">
                    <p className="text-xs text-neutral-600 font-semibold">
                      Related: {resource.relatedCategories.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-neutral-700 mb-4 font-semibold text-lg">Start logging food to get personalized recommendations!</p>
              <Link to="/logs" className="btn-secondary inline-block">
                Add Your First Log
              </Link>
            </div>
          )}
          <div className="mt-6 text-center pt-6 border-t-2 border-primary-100">
            <Link to="/resources" className="text-primary-600 hover:text-primary-700 text-base font-bold flex items-center justify-center space-x-2 hover:underline">
              <span>View All Resources</span>
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
