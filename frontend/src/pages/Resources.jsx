import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resources, resourceCategories } from '../data/seedData';

const Resources = () => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedResources, setSavedResources] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('default'); // 'default', 'title', 'type'

  useEffect(() => {
    // Load saved resources from localStorage
    const saved = JSON.parse(localStorage.getItem('savedResources') || '[]');
    setSavedResources(saved);
  }, []);

  const toggleSaveResource = (resourceId) => {
    let updated;
    if (savedResources.includes(resourceId)) {
      updated = savedResources.filter(id => id !== resourceId);
    } else {
      updated = [...savedResources, resourceId];
    }
    setSavedResources(updated);
    localStorage.setItem('savedResources', JSON.stringify(updated));
  };

  const filteredResources = resources
    .filter((resource) => {
      const matchesCategory = !filterCategory || resource.category === filterCategory;
      const matchesType = !filterType || resource.type === filterType;
      const matchesSearch = !searchQuery || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0; // default order
    });

  // Only show first 6 cards on the main resources page (per request)
  const displayResources = filteredResources.slice(0, 6);

  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl border-2 border-secondary-200">
        <div className="flex items-center space-x-4 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-4xl shadow-xl">
            <span>📚</span>
          </div>
          <h1 className="text-5xl font-bold text-neutral-800 tracking-tight">Sustainable Resources</h1>
        </div>
        <p className="text-neutral-600 text-xl ml-20">
          Tips, guides, and resources for reducing waste and improving nutrition
        </p>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔍</span>
            <h2 className="text-lg font-bold text-gray-900">Find Resources</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Search resources by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field w-full"
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

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field w-full"
            >
              <option value="">All Types</option>
              <option value="article">📄 Articles</option>
              <option value="video">🎥 Videos</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-full"
            >
              <option value="default">Default</option>
              <option value="title">Title (A-Z)</option>
              <option value="type">Type</option>
            </select>
          </div>

          {(filterCategory || filterType || searchQuery) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory('');
                  setFilterType('');
                  setSearchQuery('');
                }}
                className="btn-secondary whitespace-nowrap"
              >
                ✕ Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-primary-600">{filteredResources.length}</span> of {resources.length} resources
            {savedResources.length > 0 && (
              <span className="ml-2">
                • <span className="font-bold text-accent-600">{savedResources.length}</span> saved
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Saved Resources Section */}
      {savedResources.length > 0 && (
        <div className="card mb-6 bg-gradient-to-r from-accent-50 to-primary-50 border-2 border-accent-200">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">⭐</span>
            <h2 className="text-lg font-bold text-gray-900">Your Saved Resources ({savedResources.length})</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {resources
              .filter(r => savedResources.includes(r.id))
              .map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => navigate(`/resources/${resource.id}`)}
                  className="px-3 py-2 bg-white rounded-lg border border-accent-300 hover:border-accent-500 hover:shadow-md transition-all text-sm font-medium text-gray-700 hover:text-accent-700"
                >
                  {resource.type === 'video' ? '🎥' : '📄'} {resource.title}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Resources Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {displayResources.map((resource) => {
          const isSaved = savedResources.includes(resource.id);
          
          if (viewMode === 'list') {
            return (
              <div key={resource.id} className="card hover:shadow-lg transition-all hover:border-primary-200 flex items-center gap-6">
                <div className="text-5xl flex-shrink-0">
                  {resource.type === 'video' ? '🎥' : '📄'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{resource.title}</h3>
                    <button
                      onClick={() => toggleSaveResource(resource.id)}
                      className={`ml-2 text-2xl transition-transform hover:scale-125 ${isSaved ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                      title={isSaved ? 'Remove from saved' : 'Save for later'}
                    >
                      {isSaved ? '⭐' : '☆'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="badge bg-accent-100 text-accent-800 text-xs">
                      {resource.category
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                    <span className="badge bg-primary-100 text-primary-800 text-xs">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                    {resource.relatedCategories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium"
                      >
                        {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/resources/${resource.id}`)}
                  className="btn-primary whitespace-nowrap"
                >
                  View →
                </button>
              </div>
            );
          }
          
          return (
            <div key={resource.id} className="card hover:shadow-xl transition-all hover:border-primary-200 hover:-translate-y-1 group relative flex flex-col">
              <button
                onClick={() => toggleSaveResource(resource.id)}
                className={`absolute top-4 right-4 text-2xl transition-transform hover:scale-125 z-10 ${isSaved ? 'text-yellow-500' : 'text-gray-300 group-hover:text-yellow-400'}`}
                title={isSaved ? 'Remove from saved' : 'Save for later'}
              >
                {isSaved ? '⭐' : '☆'}
              </button>
              
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">
                  {resource.type === 'video' ? '🎥' : '📄'}
                </div>
                <div className="flex flex-col gap-2 mr-8">
                  <span className="badge bg-accent-100 text-accent-800 text-xs">
                    {resource.category
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </span>
                  <span className="badge bg-primary-100 text-primary-800 text-xs">
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">{resource.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

              <div className="mb-4 pb-4 border-b border-gray-100 flex-grow">
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

              <button
                onClick={() => navigate(`/resources/${resource.id}`)}
                className="inline-block w-full text-center btn-primary mt-auto"
              >
                View Resource →
              </button>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="card text-center py-16 bg-slate-50 border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg font-semibold text-gray-900 mb-2">No resources found</p>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? `No results for "${searchQuery}". Try adjusting your search or filters.`
              : 'Try adjusting your filters to see more results'}
          </p>
          <button
            onClick={() => {
              setFilterCategory('');
              setFilterType('');
              setSearchQuery('');
            }}
            className="btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Category Quick Stats */}
      {filteredResources.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {resourceCategories.map((category) => {
            const count = filteredResources.filter(r => r.category === category).length;
            return (
              <div
                key={category}
                className="card text-center hover:shadow-lg transition-all cursor-pointer hover:border-accent-300"
                onClick={() => setFilterCategory(category)}
              >
                <div className="text-3xl mb-2">
                  {category === 'storage' && '📦'}
                  {category === 'budget' && '💰'}
                  {category === 'waste-reduction' && '♻️'}
                  {category === 'meal-planning' && '📅'}
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
                <p className="text-2xl font-bold text-primary-600 mt-1">{count}</p>
                <p className="text-xs text-gray-500">resources</p>
              </div>
            );
          })}
        </div>
      )}
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


