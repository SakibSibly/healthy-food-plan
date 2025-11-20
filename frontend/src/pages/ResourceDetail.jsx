import { useParams, useNavigate } from 'react-router-dom';
import { resources } from '../data/seedData';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resourceId = Number(id);
  const resource = resources.find((r) => r.id === resourceId);

  if (!resource) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="glass-card text-center py-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Resource not found</h2>
          <p className="text-white/80 mb-6">The requested resource does not exist.</p>
          <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass-card p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">{resource.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="badge bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 shadow-lg">{resource.category}</span>
              <span className="badge bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 shadow-lg">{resource.type}</span>
            </div>
          </div>
          <div className="text-5xl drop-shadow-xl">{resource.type === 'video' ? '🎥' : '📄'}</div>
        </div>

        <p className="text-white/90 mb-6 text-lg leading-relaxed">{resource.description}</p>

        <div className="mb-6 glass-card p-6">
          <p className="text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">Related Categories</p>
          <div className="flex flex-wrap gap-2">
            {resource.relatedCategories.map((cat, idx) => (
              <span key={idx} className="text-sm bg-green-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold shadow-md">{cat === 'all' ? 'All' : cat}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg px-8 py-4"
            onClick={(e) => {
              e.preventDefault();
              window.open(resource.url, '_blank');
            }}
          >
            🔗 Open Resource
          </a>
          <button onClick={() => navigate(-1)} className="btn-secondary text-lg px-8 py-4">
            ← Back to Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
