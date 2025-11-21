import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Utensils, Sparkles, FileText, Target, DollarSign, Calendar, Package, Trash2, Eye, Loader2, ShoppingCart, Lightbulb, Sun, Moon, Cookie, Sunrise } from 'lucide-react';

export default function MealPlanner() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  
  // Optimization form state
  const [targetBudget, setTargetBudget] = useState(3500);
  const [durationDays, setDurationDays] = useState(7);
  const [useInventory, setUseInventory] = useState(true);
  
  const [activeTab, setActiveTab] = useState('create'); // create, plans, details
  
  useEffect(() => {
    loadMealPlans();
  }, []);
  
  const loadMealPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/meal-plans/');
      setMealPlans(response.data);
    } catch (error) {
      console.error('Error loading meal plans:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOptimizeMealPlan = async () => {
    try {
      setOptimizing(true);
      const response = await api.post('/meal-plans/optimize', {
        target_budget: targetBudget,
        duration_days: durationDays,
        use_inventory: useInventory
      });
      
      setOptimizationResult(response.data);
      setActiveTab('details');
      await loadMealPlans();
    } catch (error) {
      console.error('Error optimizing meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setOptimizing(false);
    }
  };
  
  const handleViewPlan = async (planId) => {
    try {
      setLoading(true);
      const response = await api.get(`/meal-plans/${planId}`);
      setSelectedPlan(response.data);
      setActiveTab('details');
    } catch (error) {
      console.error('Error loading plan details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this meal plan?')) {
      return;
    }
    
    try {
      await api.delete(`/meal-plans/${planId}`);
      await loadMealPlans();
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
        setActiveTab('plans');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };
  
  const getDayName = (dayIndex) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayIndex];
  };
  
  const groupItemsByDay = (items) => {
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.day_of_week]) {
        grouped[item.day_of_week] = {};
      }
      if (!grouped[item.day_of_week][item.meal_type]) {
        grouped[item.day_of_week][item.meal_type] = [];
      }
      grouped[item.day_of_week][item.meal_type].push(item);
    });
    return grouped;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl border-2 border-[#3E7C59]/20">
        <div className="flex items-center space-x-4 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-xl">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-neutral-800 tracking-tight">AI Meal Planner</h1>
        </div>
        <p className="text-neutral-600 text-xl ml-20">Generate optimized meal plans that fit your budget and reduce waste</p>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-white rounded-2xl p-2 shadow-md">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'create'
              ? 'bg-[#3E7C59] text-white shadow-lg'
              : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
          }`}
        >
          <Sparkles className="w-5 h-5" /> Create Plan
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'plans'
              ? 'bg-[#3E7C59] text-white shadow-lg'
              : 'text-neutral-600 hover:bg-[#3E7C59]/10 hover:text-[#3E7C59]'
          }`}
        >
          <FileText className="w-5 h-5" /> My Plans
        </button>
      </div>
      
      {/* Create Plan Tab */}
      {activeTab === 'create' && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-[#3E7C59]/20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Generate Optimized Meal Plan</h2>
              <p className="text-neutral-600 text-sm">
                AI-powered planning that fits your budget and uses your inventory
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#3E7C59]/5 rounded-2xl p-5 border border-[#3E7C59]/20">
              <label className="block text-sm font-bold text-neutral-800 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" /> Weekly Budget (৳)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                value={targetBudget}
                onChange={(e) => setTargetBudget(parseFloat(e.target.value))}
                className="w-full px-4 py-3 border-2 border-[#3E7C59]/30 rounded-xl focus:ring-2 focus:ring-[#3E7C59] focus:border-[#3E7C59] transition-all font-semibold text-lg"
              />
            </div>
            
            <div className="bg-[#3E7C59]/5 rounded-2xl p-5 border border-[#3E7C59]/20">
              <label className="block text-sm font-bold text-neutral-800 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" /> Plan Duration (days)
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-[#3E7C59]/30 rounded-xl focus:ring-2 focus:ring-[#3E7C59] focus:border-[#3E7C59] transition-all font-semibold text-lg"
              >
                <option value={7}>7 days (1 week)</option>
                <option value={14}>14 days (2 weeks)</option>
                <option value={21}>21 days (3 weeks)</option>
                <option value={30}>30 days (1 month)</option>
              </select>
            </div>
            
            <div className="bg-[#3E7C59]/5 rounded-2xl p-5 border border-[#3E7C59]/20">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="useInventory"
                  checked={useInventory}
                  onChange={(e) => setUseInventory(e.target.checked)}
                  className="h-5 w-5 text-[#3E7C59] focus:ring-[#3E7C59] border-[#3E7C59]/30 rounded mt-1"
                />
                <label htmlFor="useInventory" className="ml-3 block text-sm font-semibold text-neutral-800 flex items-start">
                  <Package className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /> 
                  <span>
                    Use items from my inventory
                    <span className="block text-xs text-neutral-600 mt-1 font-normal">Recommended to reduce waste and save money</span>
                  </span>
                </label>
              </div>
            </div>
            
            <button
              onClick={handleOptimizeMealPlan}
              disabled={optimizing}
              className="w-full bg-gradient-to-r from-[#3E7C59] to-[#2d5a42] text-white py-4 px-6 rounded-xl hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              {optimizing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Meal Plan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" /> Generate Meal Plan
                </span>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* My Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {loading ? (
            <div className="card text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E7C59] mx-auto mb-4"></div>
              <p className="text-neutral-600 font-medium">Loading your meal plans...</p>
            </div>
          ) : mealPlans.length === 0 ? (
            <div className="card text-center py-12">
              <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">No Meal Plans Yet</h3>
              <p className="text-neutral-600 mb-6">Start by creating your first AI-optimized meal plan!</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-gradient-to-r from-[#3E7C59] to-[#2d5a42] text-white py-3 px-8 rounded-xl hover:shadow-xl font-bold transition-all duration-200 inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> Create Your First Plan
              </button>
            </div>
          ) : (
            mealPlans.map(plan => (
              <div key={plan.id} className="card hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-800">{plan.name}</h3>
                    </div>
                    <p className="text-neutral-600 mb-4 ml-13">{plan.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-13">
                      <div className="flex items-center bg-[#3E7C59]/5 rounded-xl p-3 border border-[#3E7C59]/20">
                        <Calendar className="w-6 h-6 mr-2 text-[#3E7C59]" />
                        <div>
                          <p className="text-xs text-neutral-600 font-semibold">Duration</p>
                          <p className="text-sm font-bold text-neutral-800">{plan.start_date} to {plan.end_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-[#3E7C59]/5 rounded-xl p-3 border border-[#3E7C59]/20">
                        <DollarSign className="w-6 h-6 mr-2 text-[#3E7C59]" />
                        <div>
                          <p className="text-xs text-neutral-600 font-semibold">Budget</p>
                          <p className="text-sm font-bold text-neutral-800">৳{plan.total_cost.toFixed(2)} / ৳{plan.target_budget.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-[#3E7C59]/5 rounded-xl p-3 border border-[#3E7C59]/20">
                        <Utensils className="w-6 h-6 mr-2 text-[#3E7C59]" />
                        <div>
                          <p className="text-xs text-neutral-600 font-semibold">Meals</p>
                          <p className="text-sm font-bold text-neutral-800">{plan.items_count} planned</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:ml-4">
                    <button
                      onClick={() => handleViewPlan(plan.id)}
                      className="bg-gradient-to-r from-[#3E7C59] to-[#2d5a42] text-white py-2 px-6 rounded-xl hover:shadow-lg font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="bg-red-50 text-red-600 border-2 border-red-200 py-2 px-6 rounded-xl hover:bg-red-100 hover:border-red-300 font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
                
                {/* Budget Progress Bar */}
                <div className="mt-6 pt-4 border-t-2 border-[#3E7C59]/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-neutral-700">Budget Usage</span>
                    <span className="text-sm font-bold text-[#3E7C59]">
                      {((plan.total_cost / plan.target_budget) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 shadow-md ${
                        (plan.total_cost / plan.target_budget) > 0.9
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : (plan.total_cost / plan.target_budget) > 0.75
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : 'bg-gradient-to-r from-[#3E7C59] to-[#2d5a42]'
                      }`}
                      style={{ width: `${Math.min(100, (plan.total_cost / plan.target_budget) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Plan Details Tab */}
      {activeTab === 'details' && (optimizationResult || selectedPlan) && (
        <div className="space-y-6">
          {/* Summary Cards */}
          {optimizationResult && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="stat-card bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] text-white cursor-default">
                <div className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-2">Total Cost</div>
                <div className="text-4xl font-bold mb-2">
                  ৳{optimizationResult.total_cost.toFixed(2)}
                </div>
                <div className="text-xs text-white/70">💰 Budget spend</div>
              </div>
              <div className="stat-card bg-white border-2 border-[#3E7C59]/30">
                <div className="text-sm font-semibold uppercase tracking-wider text-neutral-600 mb-2">Budget Remaining</div>
                <div className="text-4xl font-bold text-[#3E7C59] mb-2">
                  ৳{optimizationResult.budget_remaining.toFixed(2)}
                </div>
                <div className="text-xs text-neutral-500">💵 Still available</div>
              </div>
              <div className="stat-card bg-white border-2 border-purple-200">
                <div className="text-sm font-semibold uppercase tracking-wider text-neutral-600 mb-2">Budget Used</div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {optimizationResult.budget_utilization.toFixed(1)}%
                </div>
                <div className="text-xs text-neutral-500">📊 Utilization</div>
              </div>
              <div className="stat-card bg-white border-2 border-orange-200">
                <div className="text-sm font-semibold uppercase tracking-wider text-neutral-600 mb-2">Nutrition Score</div>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {optimizationResult.nutrition_analysis.overall_score}/100
                </div>
                <div className="text-xs text-neutral-500">🥗 Health rating</div>
              </div>
            </div>
          )}
          
          {/* Inventory Usage */}
          {optimizationResult?.inventory_usage && (
            <div className="card bg-gradient-to-br from-[#3E7C59]/5 to-[#2d5a42]/5 border-2 border-[#3E7C59]/20">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-[#3E7C59]/20">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-lg">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">Inventory Usage</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border-2 border-[#3E7C59]/20">
                  <div className="text-sm font-semibold text-neutral-600 mb-1">Meals from Inventory</div>
                  <div className="text-3xl font-bold text-[#3E7C59]">
                    {optimizationResult.inventory_usage.meals_from_inventory} / {optimizationResult.inventory_usage.total_meals}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-[#3E7C59]/20">
                  <div className="text-sm font-semibold text-neutral-600 mb-1">Cost Saved</div>
                  <div className="text-3xl font-bold text-[#3E7C59]">
                    ৳{optimizationResult.inventory_usage.estimated_cost_saved.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-[#3E7C59]/20">
                <p className="text-sm text-neutral-700 font-medium">
                  <span className="text-lg mr-1">♻️</span> {optimizationResult.inventory_usage.waste_reduction}
                </p>
              </div>
            </div>
          )}
          
          {/* Weekly Meal Plan */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-[#3E7C59]/20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center text-2xl shadow-lg">
                <span>🍽️</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800">Weekly Meal Plan</h3>
            </div>
            <div className="space-y-6">
              {Object.entries(
                groupItemsByDay(optimizationResult?.meal_items || selectedPlan?.items || [])
              ).map(([dayIndex, meals]) => (
                <div key={dayIndex} className="border-b-2 border-[#3E7C59]/10 pb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#3E7C59] text-white flex items-center justify-center font-bold mr-3">
                      {parseInt(dayIndex) + 1}
                    </div>
                    <h4 className="text-xl font-bold text-neutral-800">{getDayName(parseInt(dayIndex))}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
                      <div key={mealType} className="bg-gradient-to-br from-[#3E7C59]/5 to-[#2d5a42]/5 rounded-xl p-4 border-2 border-[#3E7C59]/20">
                        <div className="text-xs font-bold text-[#3E7C59] uppercase tracking-wider mb-3 flex items-center">
                          <span className="mr-1 w-4 h-4">
                            {mealType === 'breakfast' && <Sunrise className="w-full h-full" />}
                            {mealType === 'lunch' && <Sun className="w-full h-full" />}
                            {mealType === 'dinner' && <Moon className="w-full h-full" />}
                            {mealType === 'snack' && <Cookie className="w-full h-full" />}
                          </span>
                          {mealType}
                        </div>
                        {meals[mealType] ? (
                          <div className="space-y-3">
                            {meals[mealType].map((item, idx) => (
                              <div key={idx} className="bg-white rounded-lg p-3 border border-[#3E7C59]/20">
                                <div className="font-bold text-neutral-800 text-sm">{item.food_name}</div>
                                <div className="text-neutral-600 text-xs mt-1 flex items-center justify-between">
                                  <span>{item.quantity} {item.unit}</span>
                                  <span className="font-semibold text-[#3E7C59]">৳{item.estimated_cost.toFixed(2)}</span>
                                </div>
                                {item.uses_inventory && (
                                  <div className="text-[#3E7C59] text-xs font-semibold mt-1 flex items-center">
                                    <span className="mr-1">📦</span> From inventory
                                  </div>
                                )}
                                {item.calories && (
                                  <div className="text-neutral-500 text-xs mt-1">
                                    🔥 {Math.round(item.calories)} cal
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-neutral-400 text-xs italic text-center py-4">No items</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shopping List */}
          {optimizationResult?.shopping_list && optimizationResult.shopping_list.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-[#3E7C59]/20">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">Shopping List</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimizationResult.shopping_list.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#3E7C59]/5 rounded-xl p-4 border-2 border-[#3E7C59]/20">
                    <div className="flex-1">
                      <div className="font-bold text-neutral-800">{item.item}</div>
                      <div className="text-sm text-neutral-600 mt-1">
                        {item.quantity} {item.unit} • <span className="font-semibold">{item.category}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#3E7C59] ml-4">
                      ৳{item.estimated_cost.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t-2 border-[#3E7C59]/20 flex justify-between items-center bg-gradient-to-r from-[#3E7C59]/10 to-[#2d5a42]/10 rounded-xl p-4">
                <span className="text-lg font-bold text-neutral-800">Total Shopping Cost:</span>
                <span className="text-3xl font-bold text-[#3E7C59]">
                  ৳{optimizationResult.shopping_list.reduce((sum, item) => sum + item.estimated_cost, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          {/* Alternatives */}
          {optimizationResult?.alternatives && optimizationResult.alternatives.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-[#3E7C59]/20">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">Cost-Saving Alternatives</h3>
              </div>
              <div className="space-y-4">
                {optimizationResult.alternatives.map((alt, idx) => (
                  <div key={idx} className="border-l-4 border-[#3E7C59] pl-6 bg-[#3E7C59]/5 rounded-r-xl p-4">
                    <div className="font-bold text-neutral-800 text-lg mb-2">
                      Instead of <span className="text-[#3E7C59]">{alt.original_item}</span> (৳{alt.original_cost.toFixed(2)})
                    </div>
                    <div className="text-sm font-semibold text-neutral-600 mb-3">Consider these alternatives:</div>
                    <div className="space-y-2">
                      {alt.alternatives.map((option, optIdx) => (
                        <div key={optIdx} className="bg-white rounded-lg p-3 border border-[#3E7C59]/20 flex items-center justify-between">
                          <span className="font-semibold text-neutral-800">{option.name}</span>
                          <span className="text-sm font-bold text-[#3E7C59] bg-[#3E7C59]/10 px-3 py-1 rounded-full">
                            Save ৳{option.estimated_savings.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={() => {
                setOptimizationResult(null);
                setSelectedPlan(null);
                setActiveTab('plans');
              }}
              className="bg-neutral-100 text-neutral-800 py-3 px-8 rounded-xl hover:bg-neutral-200 font-bold border-2 border-neutral-300 transition-all duration-200 inline-flex items-center"
            >
              <span className="mr-2">←</span> Back to My Plans
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
