import { useState, useEffect } from 'react';
import { foodLogAPI, inventoryAPI } from '../services/api';
import { categories } from '../data/seedData';
import { FileText, Plus, X, Trash2, Package, MessageSquare, CheckCircle, Clock, BarChart3 } from 'lucide-react';

const FoodLogs = () => {
  const [logs, setLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    inventoryItemId: '',
    quantity: '',
    notes: '',
  });

  useEffect(() => {
    loadLogs();
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getItems();
      setInventory(response.data.filter(item => item.quantity > 0));
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const response = await foodLogAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    const item = inventory.find(i => i.id === itemId);
    setSelectedItem(item);
    setFormData({
      ...formData,
      inventoryItemId: itemId,
      quantity: item ? '1' : '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedItem) {
      alert('Please select an item from your inventory');
      return;
    }
    
    const quantity = parseFloat(formData.quantity);
    if (quantity > selectedItem.quantity) {
      alert(`You only have ${selectedItem.quantity} units available`);
      return;
    }
    
    try {
      // Transform to backend format
      const backendData = {
        inventory_item_id: formData.inventoryItemId,
        quantity: quantity,
        notes: formData.notes || null,
      };
      
      await foodLogAPI.createLog(backendData);
      setFormData({
        inventoryItemId: '',
        quantity: '',
        notes: '',
      });
      setSelectedItem(null);
      setShowForm(false);
      loadLogs();
      loadInventory(); // Refresh inventory to show updated quantities
    } catch (error) {
      console.error('Failed to create log:', error);
      alert('Failed to create log: ' + (error.response?.data?.detail || error.message));
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
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-8 mb-8 shadow-2xl border-2 border-[#3E7C59]/20">
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-neutral-800 tracking-tight">Food Logs</h1>
          </div>
          <p className="text-neutral-600 text-xl ml-20">Track your daily food usage and consumption history</p>
        </div>
        <button
          onClick={() => {
            if (inventory.length === 0) {
              alert('You need to add items to your inventory first!');
              return;
            }
            setShowForm(!showForm);
          }}
          className={showForm ? 'btn-secondary text-lg px-6 py-3 flex items-center gap-2' : 'btn-primary text-lg px-6 py-3 flex items-center gap-2'}
        >
          {showForm ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Log Consumption</>}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card mb-6 animate-slide-down border-2 border-primary-200">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">✏️</span>
            <h2 className="text-2xl font-bold text-neutral-900">Log Food Consumption</h2>
          </div>
          
          {inventory.length === 0 ? (
            <div className="empty-state bg-secondary-50 border-secondary-300">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-semibold text-neutral-900 mb-2">No items in inventory</p>
              <p className="text-neutral-600">Add items to your inventory first before logging consumption</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="form-label">
                    Select Item from Inventory *
                  </label>
                  <select
                    name="inventoryItemId"
                    value={formData.inventoryItemId}
                    onChange={handleItemSelect}
                    required
                    className="input-field"
                  >
                    <option value="">Choose an item...</option>
                    {inventory.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.quantity} available ({item.category})
                      </option>
                    ))}
                  </select>
                  {selectedItem && (
                    <p className="text-xs text-neutral-600 mt-2 flex items-center space-x-1">
                      <span>💡</span>
                      <span>Available: <strong>{selectedItem.quantity} units</strong>
                      {selectedItem.expiration_date && ` | Expires: ${selectedItem.expiration_date}`}</span>
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Quantity Consumed *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0.1"
                    max={selectedItem?.quantity || 999}
                    step="0.1"
                    className="input-field"
                    placeholder="How much did you consume?"
                    disabled={!selectedItem}
                  />
                  {selectedItem && formData.quantity && parseFloat(formData.quantity) > selectedItem.quantity && (
                    <p className="text-xs text-red-600 mt-2 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>Insufficient quantity! You only have {selectedItem.quantity} available</span>
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 form-group">
                  <label className="form-label">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="input-field resize-none"
                    placeholder="E.g., Breakfast, Lunch, Dinner, Snack, or any other notes..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="submit" 
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={!selectedItem || (formData.quantity && parseFloat(formData.quantity) > selectedItem?.quantity)}
                >
                  <CheckCircle className="w-5 h-5" /> Log Consumption
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      inventoryItemId: '',
                      quantity: '',
                      notes: '',
                    });
                    setSelectedItem(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Logs List */}
      <div className="card">
        <div className="section-header pb-6 border-b-2 border-primary-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3E7C59] to-[#2d5a42] flex items-center justify-center shadow-lg">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Consumption History</h2>
        </div>
        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-6 bg-gradient-to-r from-white to-primary-50/30 rounded-2xl hover:shadow-lg transition-all border border-primary-100 hover:border-primary-300"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-neutral-900 text-lg">{log.item_name}</h3>
                    <span className="badge bg-gradient-to-r from-[#3E7C59] to-[#2d5a42] text-white">
                      {log.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                    <span className="font-semibold flex items-center space-x-1">
                      <span>📊</span>
                      <span>{log.quantity} {log.unit}</span>
                    </span>
                    {log.consumed_at && (
                      <span className="text-xs text-neutral-500 flex items-center space-x-1">
                        <span>🕒</span>
                        <span>{new Date(log.consumed_at).toLocaleDateString()} at{' '}
                        {new Date(log.consumed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-sm text-neutral-700 mt-3 p-4 bg-white rounded-xl border border-primary-100 italic">
                      💬 {log.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="btn-danger text-xs ml-4 whitespace-nowrap flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-neutral-900 mb-2">No food logs yet</p>
            <p className="text-neutral-600 mb-6">Start tracking your food consumption by adding your first log!</p>
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


