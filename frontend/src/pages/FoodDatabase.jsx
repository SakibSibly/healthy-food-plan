import { useState } from 'react';
import { foodItems, categories } from '../data/seedData';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Info, Search, Milk, Apple, Carrot, Drumstick, Wheat, Utensils, Clock, DollarSign, Plus, ArrowRight, X, Minus } from 'lucide-react';

const FoodDatabase = () => {
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'category', 'expiration', 'cost'
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const filteredItems = foodItems
    .filter((item) => {
      const matchesCategory = !filterCategory || item.category === filterCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'expiration':
          return a.expirationDays - b.expirationDays;
        case 'cost':
          return a.costPerUnit - b.costPerUnit;
        default:
          return 0;
      }
    });

  const getCategoryIcon = (category) => {
    const iconProps = { className: "w-full h-full" };
    const icons = {
      dairy: <Milk {...iconProps} />,
      fruit: <Apple {...iconProps} />,
      vegetable: <Carrot {...iconProps} />,
      protein: <Drumstick {...iconProps} />,
      grain: <Wheat {...iconProps} />,
    };
    return icons[category] || <Utensils {...iconProps} />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      dairy: 'from-blue-500 to-blue-600',
      fruit: 'from-red-500 to-orange-500',
      vegetable: 'from-green-500 to-green-600',
      protein: 'from-purple-500 to-purple-600',
      grain: 'from-yellow-500 to-yellow-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl border-2 border-[#3E7C59]/20">
        <div className="flex items-center space-x-4 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-neutral-800 tracking-tight">Food Items Database</h1>
        </div>
        <p className="text-neutral-600 text-xl ml-20">
          Browse {foodItems.length} common household food items with expiration and cost information
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-[#3E7C59]/10 border-l-4 border-[#3E7C59] rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-start">
          <Info className="w-8 h-8 text-[#3E7C59] mr-4 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-[#3E7C59] mb-2 text-lg">Seeded Food Database</h3>
            <p className="text-sm text-neutral-700">
              This database contains {foodItems.length} pre-populated common food items with typical 
              expiration periods and cost estimates. Use this as a reference when adding items to your 
              personal inventory.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex items-center space-x-2 mb-5">
          <Search className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Search & Filter</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="form-label">Search Items</label>
            <input
              type="text"
              placeholder="🔍 Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="form-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="name">Name (A-Z)</option>
              <option value="category">Category</option>
              <option value="expiration">Expiration (Days)</option>
              <option value="cost">Cost (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Badges */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterCategory === ''
                ? 'bg-[#3E7C59] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({foodItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterCategory === cat
                  ? 'bg-[#3E7C59] text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <span className="w-4 h-4">{getCategoryIcon(cat)}</span>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span> (
              {foodItems.filter((item) => item.category === cat).length})
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-bold text-[#3E7C59]">{filteredItems.length}</span> of{' '}
          <span className="font-bold">{foodItems.length}</span> items
        </div>
      </div>

      {/* Items Grid */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800">Food Items</h2>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setQuantity(1);
                }}
                className="border-2 border-neutral-200 rounded-2xl p-5 bg-white hover:border-primary-400 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 text-gray-700">{getCategoryIcon(item.category)}</div>
                  <span className={`badge bg-gradient-to-r ${getCategoryColor(item.category)} text-white text-xs`}>
                    {item.category}
                  </span>
                </div>

                <h3 className="font-bold text-neutral-900 text-lg mb-3">{item.name}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-medium">⏱️ Shelf Life:</span>
                    <span className="font-bold text-blue-600">{item.expirationDays} days</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-medium">💰 Avg. Cost:</span>
                    <span className="font-bold text-green-600">৳{item.costPerUnit.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                    setQuantity(1);
                  }}
                  className="mt-4 w-full btn-secondary text-sm py-2"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No items found</p>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card mt-6 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to manage your inventory?</h3>
            <p className="text-sm text-gray-600">
              Use this database as a reference to add items to your personal food inventory
            </p>
          </div>
          <button
            onClick={() => navigate('/inventory')}
            className="btn-primary"
          >
            Go to My Inventory →
          </button>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 text-gray-700">{getCategoryIcon(selectedItem.category)}</div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900 mb-2">{selectedItem.name}</h2>
                  <span className={`badge bg-gradient-to-r ${getCategoryColor(selectedItem.category)} text-white`}>
                    {selectedItem.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 font-bold leading-none"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-bold text-lg">⏱️ Typical Shelf Life</span>
                  <span className="text-2xl font-bold text-blue-600">{selectedItem.expirationDays} days</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Average time before expiration under proper storage conditions
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-bold text-lg">💰 Average Cost</span>
                  <span className="text-2xl font-bold text-green-600">৳{selectedItem.costPerUnit.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Estimated cost per unit (prices may vary by location)
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                <span className="text-gray-700 font-bold text-lg">📂 Category Information</span>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>{selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}</strong> items 
                  typically require specific storage conditions to maintain freshness. Check resources for storage tips.
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
                <label className="text-gray-700 font-bold text-lg block mb-3">📊 Select Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                    className="w-10 h-10 bg-white border-2 border-orange-300 rounded-lg font-bold text-orange-600 hover:bg-orange-100 transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    min="0.1"
                    step="0.5"
                    className="w-24 text-center text-2xl font-bold text-gray-900 border-2 border-orange-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 0.5)}
                    className="w-10 h-10 bg-white border-2 border-orange-300 rounded-lg font-bold text-orange-600 hover:bg-orange-100 transition-all"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-2">units</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  // Calculate expiration date based on typical days
                  const expirationDate = new Date();
                  expirationDate.setDate(expirationDate.getDate() + selectedItem.expirationDays);
                  
                  // Navigate with pre-filled data
                  navigate('/inventory', {
                    state: {
                      prefillData: {
                        name: selectedItem.name,
                        category: selectedItem.category,
                        quantity: quantity,
                        cost: selectedItem.costPerUnit * quantity,
                        expirationDate: expirationDate.toISOString().split('T')[0],
                      }
                    }
                  });
                  setSelectedItem(null);
                }}
                className="btn-primary flex-1"
              >
                ➕ Add {quantity} to My Inventory
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDatabase;
