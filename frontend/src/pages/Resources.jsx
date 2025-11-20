import { useState } from 'react';
import { resources, resourceCategories } from '../data/seedData';

const Resources = () => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = !filterCategory || resource.category === filterCategory;
    const matchesType = !filterType || resource.type === filterType;
    return matchesCategory && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="page-header">
        <div className="flex items-center space-x-4 mb-3">
          <div className="icon-circle bg-accent-100 text-accent-600 w-16 h-16 text-3xl">
            <span>📚</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Sustainable Resources</h1>
        </div>
        <p className="text-gray-600 text-lg ml-20">
          Tips, guides, and resources for reducing waste and improving nutrition
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl">🔍</span>
          <h2 className="text-lg font-bold text-gray-900">Filter Resources</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {resourceCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="article">📄 Articles</option>
              <option value="video">🎥 Videos</option>
            </select>
          </div>

          {(filterCategory || filterType) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory('');
                  setFilterType('');
                }}
                className="btn-secondary"
              >
                ✕ Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="card hover:shadow-xl transition-all hover:border-primary-200 hover:-translate-y-1 group">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">
                {resource.type === 'video' ? '🎥' : '📄'}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="badge bg-accent-100 text-accent-800">
                  {resource.category
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
                <span className="badge bg-primary-100 text-primary-800">
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-3">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-xs text-gray-600 font-semibold mb-2">Related to:</p>
              <div className="flex flex-wrap gap-2">
                {resource.relatedCategories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium"
                  >
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center btn-primary"
            >
              View Resource →
            </a>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="card text-center py-16 bg-slate-50 border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg font-semibold text-gray-900 mb-2">No resources found</p>
          <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
          <button
            onClick={() => {
              setFilterCategory('');
              setFilterType('');
            }}
            className="btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="card mt-6">
        <div className="section-header pb-4 border-b border-gray-100">
          <div className="icon-circle bg-accent-100 text-accent-600">
            <span>📊</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Resource Statistics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-slate-50 rounded-xl border border-gray-100">
            <p className="text-4xl font-bold text-primary-600 mb-2">{resources.length}</p>
            <p className="text-sm font-semibold text-gray-600">Total Resources</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {resources.filter((r) => r.type === 'article').length}
            </p>
            <p className="text-sm font-semibold text-gray-600">Articles</p>
          </div>
          <div className="text-center p-4 bg-accent-50 rounded-xl border border-accent-100">
            <p className="text-4xl font-bold text-accent-600 mb-2">
              {resources.filter((r) => r.type === 'video').length}
            </p>
            <p className="text-sm font-semibold text-gray-600">Videos</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-4xl font-bold text-green-600 mb-2">{resourceCategories.length}</p>
            <p className="text-sm font-semibold text-gray-600">Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;


