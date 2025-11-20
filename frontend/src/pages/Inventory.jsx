import { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';
import { foodItems, categories } from '../data/seedData';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: '',
    expirationDate: '',
    notes: '',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getItems();
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
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
      if (editingItem) {
        await inventoryAPI.updateItem(editingItem.id, formData);
        setEditingItem(null);
      } else {
        await inventoryAPI.createItem(formData);
      }
      setFormData({
        name: '',
        quantity: '',
        category: '',
        expirationDate: '',
        notes: '',
      });
      setShowForm(false);
      loadInventory();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      expirationDate: item.expirationDate || '',
      notes: item.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.deleteItem(id);
        loadInventory();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const filteredInventory = filterCategory
    ? inventory.filter((item) => item.category === filterCategory)
    : inventory;

  const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return null;
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between page-header">
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="icon-circle bg-green-100 text-green-600 w-16 h-16 text-3xl">
              <span>📦</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Food Inventory</h1>
          </div>
          <p className="text-gray-600 text-lg ml-20">Manage your household food items and track expiration</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({
              name: '',
              quantity: '',
              category: '',
              expirationDate: '',
              notes: '',
            });
          }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 border-2 border-primary-100">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">{editingItem ? '✏️' : '➕'}</span>
            <h2 className="text-xl font-bold text-gray-900">
              {editingItem ? 'Edit Item' : 'New Inventory Item'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Milk, Eggs"
                  list="food-items"
                />
                <datalist id="food-items">
                  {foodItems.map((item) => (
                    <option key={item.id} value={item.name} />
                  ))}
                </datalist>
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
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="input-field"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="submit" className="btn-primary flex-1">
                {editingItem ? '💾 Update Item' : '➕ Add to Inventory'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setFormData({
                    name: '',
                    quantity: '',
                    category: '',
                    expirationDate: '',
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

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-xl">🔍</span>
          <label className="text-sm font-semibold text-gray-700">Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          {filterCategory && (
            <button onClick={() => setFilterCategory('')} className="text-sm text-slate-600 hover:text-slate-700">
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Inventory List */}
      <div className="card">
        <div className="section-header pb-4 border-b border-gray-100">
          <div className="icon-circle bg-green-100 text-green-600">
            <span>📋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Inventory Items <span className="text-primary-600">({filteredInventory.length})</span>
          </h2>
        </div>
        {filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInventory.map((item) => {
              const daysUntilExp = getDaysUntilExpiration(item.expirationDate);
              const isExpiringSoon = daysUntilExp !== null && daysUntilExp <= 7 && daysUntilExp > 0;
              const isExpired = daysUntilExp !== null && daysUntilExp < 0;

              return (
                <div
                  key={item.id}
                  className={`border-2 rounded-xl p-5 transition-all hover:shadow-lg ${
                    isExpired
                      ? 'border-red-300 bg-red-50'
                      : isExpiringSoon
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-100 bg-white hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                    <span className="badge bg-primary-100 text-primary-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold mb-3">📊 Quantity: {item.quantity}</p>
                  {item.expirationDate && (
                    <div className="text-sm mb-3 p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-gray-600 mb-1">
                        📅 Expires: {new Date(item.expirationDate).toLocaleDateString()}
                      </p>
                      {daysUntilExp !== null && (
                        <p
                          className={`font-bold ${
                            isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-700' : 'text-green-600'
                          }`}
                        >
                          {isExpired
                            ? '⚠️ Expired!'
                            : isExpiringSoon
                            ? `⏰ Expires in ${daysUntilExp} days`
                            : `✅ ${daysUntilExp} days remaining`}
                        </p>
                      )}
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-sm text-gray-600 italic mb-3 p-3 bg-white rounded-lg border border-gray-100">
                      💬 {item.notes}
                    </p>
                  )}
                  <div className="flex space-x-2 pt-2 border-t border-gray-200">
                    <button onClick={() => handleEdit(item)} className="btn-secondary text-xs flex-1">
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-danger text-xs flex-1"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No items in inventory</p>
            <p className="text-gray-600 mb-6">Start adding items to track your food storage!</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              + Add Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Seeded Food Items Reference */}
      <div className="card mt-6 bg-slate-50 border-2 border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">📖</span>
          <h2 className="text-xl font-bold text-gray-900">Common Food Items Reference</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">Use these as reference when adding items to your inventory</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {foodItems.slice(0, 15).map((item) => (
            <div key={item.id} className="text-sm p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all">
              <p className="font-bold text-gray-900 mb-1">{item.name}</p>
              <p className="text-xs text-gray-600 mb-1">📂 {item.category}</p>
              <p className="text-xs text-green-600 font-semibold">⏱️ ~{item.expirationDays} days</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;


