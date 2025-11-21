import { useParams, useNavigate } from 'react-router-dom';
import { resources } from '../data/seedData';
import { Video, FileText, X, BookOpen, Tag, ExternalLink, Info, ArrowLeft } from 'lucide-react';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resourceId = Number(id);
  const resource = resources.find((r) => r.id === resourceId);

  if (!resource) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 text-center py-12 px-6">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Resource not found</h2>
          <p className="text-gray-600 mb-6">The requested resource does not exist.</p>
          <button onClick={() => navigate('/resources')} className="btn-primary">← Back to Resources</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 text-gray-700">
                {resource.type === 'video' ? <Video className="w-full h-full" /> : <FileText className="w-full h-full" />}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{resource.title}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge bg-accent-100 text-accent-800 px-4 py-2">
                    {resource.category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <span className="badge bg-primary-100 text-primary-800 px-4 py-2">
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" /> About This Resource
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">{resource.description}</p>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4" /> Related Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {resource.relatedCategories.map((cat, idx) => (
              <span key={idx} className="text-sm bg-white text-gray-700 px-4 py-2 rounded-full font-semibold shadow-sm border border-gray-200">
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center text-lg px-8 py-4 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" /> Open Resource
          </a>
          <button 
            onClick={() => navigate('/resources')} 
            className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Resources
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center flex items-center justify-center gap-2">
          <Info className="w-4 h-4" /> Clicking "Open Resource" will open the external link in a new tab
        </p>
      </div>
    </div>
  );
};

export default ResourceDetail;
