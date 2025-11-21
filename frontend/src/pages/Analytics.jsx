import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Analytics() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await api.get('/actions/analytics/insights');
      setInsights(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setError(err.response?.data?.detail || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'text-red-600 bg-red-100 border-red-300';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing consumption patterns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-6xl text-center mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchInsights}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="text-5xl">🧠</span>
            AI Consumption Analytics
          </h1>
          <p className="text-gray-600">
            Intelligent insights powered by pattern analysis • Last updated: {new Date(insights.generated_at).toLocaleString()}
          </p>
        </div>

        {/* Health Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Overall Health Score</h2>
              <p className="text-gray-600">Based on consumption balance and patterns</p>
            </div>
            <div className="text-center">
              <div className={`text-6xl font-bold ${getHealthScoreColor(insights.summary.health_score)}`}>
                {insights.summary.health_score}
              </div>
              <div className="text-gray-500 text-sm mt-1">out of 100</div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        {insights.summary.insights.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-yellow-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚡</span>
              Priority Insights
            </h2>
            <div className="space-y-3">
              {insights.summary.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-4 rounded-lg ${
                    insight.priority === 'critical'
                      ? 'bg-red-50 border border-red-200'
                      : insight.priority === 'high'
                      ? 'bg-orange-50 border border-orange-200'
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <span className={`text-2xl flex-shrink-0 ${
                      insight.priority === 'critical'
                        ? 'text-red-600'
                        : insight.priority === 'high'
                        ? 'text-orange-600'
                        : 'text-yellow-600'
                    }`}>
                    ℹ️
                  </span>
                  <div>
                    <span className="font-semibold capitalize">{insight.type.replace('_', ' ')}: </span>
                    <span>{insight.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'trends', label: 'Weekly Trends', icon: '📈' },
                { id: 'waste', label: 'Waste Predictions', icon: '⚠️' },
                { id: 'balance', label: 'Dietary Balance', icon: '⚖️' },
                { id: 'heatmap', label: 'Heatmap', icon: '📅' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="text-blue-600 font-semibold text-sm mb-2">Total Logs Analyzed</div>
                    <div className="text-3xl font-bold text-blue-900">{insights.summary.total_logs_analyzed}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="text-green-600 font-semibold text-sm mb-2">Inventory Items</div>
                    <div className="text-3xl font-bold text-green-900">{insights.summary.total_inventory_items}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="text-purple-600 font-semibold text-sm mb-2">Analysis Period</div>
                    <div className="text-3xl font-bold text-purple-900">{insights.summary.analysis_period_days} days</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Consumption Patterns</h3>
                  <div className="space-y-4">
                    {insights.consumption_patterns.patterns.length === 0 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <span className="text-2xl">✅</span>
                        <span>No concerning patterns detected - great job!</span>
                      </div>
                    ) : (
                      insights.consumption_patterns.patterns.map((pattern, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-4 rounded-lg border ${getSeverityColor(pattern.severity)}`}
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">ℹ️</span>
                          <div className="flex-1">
                            <div className="font-semibold capitalize mb-1">{pattern.category}</div>
                            <div className="text-sm">{pattern.message}</div>
                            <div className="text-xs mt-1 opacity-75">
                              Actual: {typeof pattern.actual === 'number' ? pattern.actual.toFixed(2) : pattern.actual} servings/day • Recommended: {pattern.recommended}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Trends Tab */}
            {activeTab === 'trends' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Consumption</h3>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {Object.entries(insights.weekly_trends.daily_consumption).map(([day, total]) => (
                      <div key={day} className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-xs text-gray-600 mb-2">{day.substring(0, 3)}</div>
                        <div className="text-2xl font-bold text-gray-800">{typeof total === 'number' ? total.toFixed(2) : total}</div>
                        <div className="text-xs text-gray-500 mt-1">items</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-gray-600">
                    Average: <span className="font-semibold">{typeof insights.weekly_trends.average_daily === 'number' ? insights.weekly_trends.average_daily.toFixed(2) : insights.weekly_trends.average_daily}</span> items/day
                  </div>
                </div>

                {insights.weekly_trends.patterns.length > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Detected Patterns</h3>
                    <div className="space-y-3">
                      {insights.weekly_trends.patterns.map((pattern, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                          <span className="text-2xl">📈</span>
                          <div>
                            <div className="font-semibold text-gray-800">{pattern.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown by Day</h3>
                  <div className="space-y-4">
                    {Object.entries(insights.weekly_trends.category_by_day).map(([day, categories]) => (
                      <div key={day}>
                        <div className="font-semibold text-gray-700 mb-2">{day}</div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(categories).map(([cat, qty]) => (
                            <span key={cat} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {cat}: {qty}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Waste Predictions Tab */}
            {activeTab === 'waste' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="text-red-600 text-sm font-semibold mb-1">Critical Risk</div>
                    <div className="text-3xl font-bold text-red-900">{insights.waste_predictions.critical_count}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="text-orange-600 text-sm font-semibold mb-1">High Risk</div>
                    <div className="text-3xl font-bold text-orange-900">{insights.waste_predictions.high_risk_count}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="text-yellow-600 text-sm font-semibold mb-1">Total at Risk</div>
                    <div className="text-3xl font-bold text-yellow-900">{insights.waste_predictions.total_at_risk}</div>
                  </div>
                </div>

                {insights.waste_predictions.predictions.length === 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <div className="text-6xl text-green-600 mx-auto mb-4">✅</div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">No Waste Risks Detected!</h3>
                    <p className="text-green-700">All your items are being consumed efficiently.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insights.waste_predictions.predictions.map((pred, idx) => (
                      <div
                        key={idx}
                        className={`bg-white rounded-xl p-6 border-l-4 shadow-md ${
                          pred.waste_risk === 'critical'
                            ? 'border-red-500'
                            : pred.waste_risk === 'high'
                            ? 'border-orange-500'
                            : 'border-yellow-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{pred.name}</h4>
                            <span className="text-sm text-gray-600 capitalize">{pred.category}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getRiskColor(pred.waste_risk)}`}>
                            {pred.waste_risk.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <div className="text-gray-600">Quantity</div>
                            <div className="font-semibold text-gray-800">{pred.quantity}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Days Until Expiry</div>
                            <div className="font-semibold text-gray-800">{pred.days_until_expiry}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Usage Rate</div>
                            <div className="font-semibold text-gray-800">{typeof pred.usage_rate === 'number' ? pred.usage_rate.toFixed(2) : pred.usage_rate}/day</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Est. Days to Consume</div>
                            <div className="font-semibold text-gray-800">{typeof pred.estimated_days_to_consume === 'number' ? pred.estimated_days_to_consume.toFixed(2) : pred.estimated_days_to_consume}</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <span className="text-xl text-blue-600 flex-shrink-0 mt-0.5">ℹ️</span>
                            <div>
                              <div className="font-semibold text-gray-800 mb-1">Recommendation</div>
                              <div className="text-gray-700">{pred.recommendation}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dietary Balance Tab */}
            {activeTab === 'balance' && (
              <div className="space-y-6">
                <div className={`rounded-xl p-6 ${
                  insights.balance_check.balanced
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {insights.balance_check.balanced ? (
                      <span className="text-4xl">✅</span>
                    ) : (
                      <span className="text-4xl">⚠️</span>
                    )}
                    <h3 className="text-2xl font-bold text-gray-800">
                      {insights.balance_check.balanced ? 'Balanced Diet!' : 'Balance Improvements Available'}
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {insights.balance_check.balanced
                      ? 'Your dietary intake is well-balanced across categories.'
                      : 'Some categories need attention to achieve better balance.'}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Category Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(insights.balance_check.category_distribution).map(([cat, percent]) => (
                      <div key={cat}>
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold capitalize text-gray-700">{cat}</span>
                          <span className="text-gray-600">{typeof percent === 'number' ? percent.toFixed(2) : percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600 text-center">
                    Total items: {insights.balance_check.total_items}
                  </div>
                </div>

                {insights.balance_check.flags.length > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Balance Flags</h3>
                    <div className="space-y-3">
                      {insights.balance_check.flags.map((flag, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-4 rounded-lg ${getSeverityColor(flag.severity)}`}
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">ℹ️</span>
                          <div>
                            <div className="font-semibold capitalize mb-1">{flag.type.replace('_', ' ')}</div>
                            <div className="text-sm">{flag.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Heatmap Tab */}
            {activeTab === 'heatmap' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">7-Day Consumption Heatmap</h3>
                  <p className="text-gray-600 mb-4">
                    {insights.heatmap_data.date_range.start} to {insights.heatmap_data.date_range.end}
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-3 text-left text-sm font-semibold text-gray-700 bg-white rounded-tl-lg">Date</th>
                          {insights.heatmap_data.categories.map((cat) => (
                            <th key={cat} className="p-3 text-center text-sm font-semibold text-gray-700 bg-white capitalize">
                              {cat}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {insights.heatmap_data.heatmap.map((day, dayIdx) => (
                          <tr key={day.date} className={dayIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-3 text-sm font-medium text-gray-800">
                              <div>{day.day_name}</div>
                              <div className="text-xs text-gray-500">{day.date}</div>
                            </td>
                            {insights.heatmap_data.categories.map((cat) => {
                              const value = day.categories[cat] || 0;
                              const intensity = Math.min(100, (value / 5) * 100); // Scale to max 5 items
                              return (
                                <td key={cat} className="p-3 text-center">
                                  <div
                                    className="w-full h-12 rounded-lg flex items-center justify-center font-bold transition-all hover:scale-110"
                                    style={{
                                      backgroundColor: value > 0
                                        ? `rgba(34, 197, 94, ${0.2 + intensity / 150})`
                                        : 'rgba(229, 231, 235, 0.5)',
                                      color: value > 2 ? '#ffffff' : '#1f2937'
                                    }}
                                  >
                                    {value || '-'}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex items-center gap-4 justify-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <span>No consumption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.4)' }}></div>
                      <span>Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.7)' }}></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-600 rounded"></div>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchInsights}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Refresh Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
