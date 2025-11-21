import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MealPlanner() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  
  // Optimization form state
  const [targetBudget, setTargetBudget] = useState(100);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Meal Planner</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Create Plan
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'plans'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          My Plans
        </button>
      </div>
      
      {/* Create Plan Tab */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Generate Optimized Meal Plan</h2>
          <p className="text-gray-600 mb-6">
            Our AI will create a personalized meal plan that fits your budget, uses your inventory items,
            and meets nutritional requirements.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Budget ($)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                value={targetBudget}
                onChange={(e) => setTargetBudget(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Duration (days)
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={7}>7 days (1 week)</option>
                <option value={14}>14 days (2 weeks)</option>
                <option value={21}>21 days (3 weeks)</option>
                <option value={30}>30 days (1 month)</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useInventory"
                checked={useInventory}
                onChange={(e) => setUseInventory(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="useInventory" className="ml-2 block text-sm text-gray-900">
                Use items from my inventory (recommended to reduce waste)
              </label>
            </div>
            
            <button
              onClick={handleOptimizeMealPlan}
              disabled={optimizing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {optimizing ? 'Generating Plan...' : 'Generate Meal Plan'}
            </button>
          </div>
        </div>
      )}
      
      {/* My Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : mealPlans.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">You don't have any meal plans yet.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            mealPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-2">{plan.description}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>📅 {plan.start_date} to {plan.end_date}</span>
                      <span>💰 ${plan.total_cost.toFixed(2)} / ${plan.target_budget.toFixed(2)}</span>
                      <span>🍽️ {plan.items_count} meals</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewPlan(plan.id)}
                      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Budget Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (plan.total_cost / plan.target_budget) > 0.9
                          ? 'bg-red-500'
                          : (plan.total_cost / plan.target_budget) > 0.75
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
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
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600">Total Cost</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${optimizationResult.total_cost.toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600">Budget Remaining</div>
                <div className="text-2xl font-bold text-green-600">
                  ${optimizationResult.budget_remaining.toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600">Budget Used</div>
                <div className="text-2xl font-bold text-purple-600">
                  {optimizationResult.budget_utilization.toFixed(1)}%
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600">Nutrition Score</div>
                <div className="text-2xl font-bold text-orange-600">
                  {optimizationResult.nutrition_analysis.overall_score}/100
                </div>
              </div>
            </div>
          )}
          
          {/* Inventory Usage */}
          {optimizationResult?.inventory_usage && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">📦 Inventory Usage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Meals from Inventory:</span>
                  <span className="font-semibold ml-2">
                    {optimizationResult.inventory_usage.meals_from_inventory} / {optimizationResult.inventory_usage.total_meals}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Cost Saved:</span>
                  <span className="font-semibold ml-2 text-green-600">
                    ${optimizationResult.inventory_usage.estimated_cost_saved.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {optimizationResult.inventory_usage.waste_reduction}
              </p>
            </div>
          )}
          
          {/* Weekly Meal Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">🍽️ Weekly Meal Plan</h3>
            <div className="space-y-6">
              {Object.entries(
                groupItemsByDay(optimizationResult?.meal_items || selectedPlan?.items || [])
              ).map(([dayIndex, meals]) => (
                <div key={dayIndex} className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">{getDayName(parseInt(dayIndex))}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
                      <div key={mealType} className="bg-gray-50 rounded p-3">
                        <div className="text-sm font-medium text-gray-700 capitalize mb-2">
                          {mealType}
                        </div>
                        {meals[mealType] ? (
                          <div className="space-y-1">
                            {meals[mealType].map((item, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="font-medium">{item.food_name}</div>
                                <div className="text-gray-600 text-xs">
                                  {item.quantity} {item.unit} • ${item.estimated_cost.toFixed(2)}
                                </div>
                                {item.uses_inventory && (
                                  <div className="text-green-600 text-xs">📦 From inventory</div>
                                )}
                                {item.calories && (
                                  <div className="text-gray-500 text-xs">
                                    {Math.round(item.calories)} cal
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs">No items</div>
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">🛒 Shopping List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimizationResult.shopping_list.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{item.item}</div>
                      <div className="text-sm text-gray-600">
                        {item.quantity} {item.unit} • {item.category}
                      </div>
                    </div>
                    <div className="text-blue-600 font-semibold">
                      ${item.estimated_cost.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-semibold">Total Shopping Cost:</span>
                <span className="text-xl font-bold text-blue-600">
                  ${optimizationResult.shopping_list.reduce((sum, item) => sum + item.estimated_cost, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          {/* Alternatives */}
          {optimizationResult?.alternatives && optimizationResult.alternatives.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">💡 Cost-Saving Alternatives</h3>
              <div className="space-y-4">
                {optimizationResult.alternatives.map((alt, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <div className="font-medium">Instead of {alt.original_item} (${alt.original_cost.toFixed(2)})</div>
                    <div className="text-sm text-gray-600 mt-1">Consider these alternatives:</div>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                      {alt.alternatives.map((option, optIdx) => (
                        <li key={optIdx}>
                          {option.name} - Save ${option.estimated_savings.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setOptimizationResult(null);
                setSelectedPlan(null);
                setActiveTab('plans');
              }}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700"
            >
              Back to Plans
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
