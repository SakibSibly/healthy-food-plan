import { useState, useEffect } from 'react';
import { imageAPI } from '../services/api';
import { Camera, Upload, Info, Download, Trash2, CheckCircle } from 'lucide-react';

const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [associateWith, setAssociateWith] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await imageAPI.getImages();
      setImages(response.data);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);

    try {
      await imageAPI.uploadImage(selectedFile);
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setAssociateWith('');
      setNotes('');
      
      // Reload images
      loadImages();
      
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await imageAPI.deleteImage(id);
        loadImages();
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="page-header">
        <div className="flex items-center space-x-4 mb-3">
          <div className="icon-circle bg-blue-100 text-blue-600 w-16 h-16 flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Image Upload</h1>
        </div>
        <p className="text-gray-600 text-lg ml-20">
          Upload receipts or food labels for future scanning and processing
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-start">
          <Info className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2 text-lg">AI Processing Coming Soon</h3>
            <p className="text-sm text-blue-800">
              Currently, you can upload and store images. In Part 2 of the hackathon, AI-powered
              scanning will automatically extract data from receipts and food labels to populate
              your inventory and logs.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="card mb-6 border-2 border-primary-100">
        <div className="flex items-center space-x-2 mb-6">
          <Upload className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Upload New Image</h2>
        </div>
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Image (JPG/PNG, max 5MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-slate-50 file:text-slate-700
                hover:file:bg-slate-100
                cursor-pointer"
            />
          </div>

          {previewUrl && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-md max-h-96 rounded-xl border-2 border-gray-200 object-contain shadow-md"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Associate With (Optional)
            </label>
            <select
              value={associateWith}
              onChange={(e) => setAssociateWith(e.target.value)}
              className="input-field"
            >
              <option value="">Select association</option>
              <option value="inventory">Inventory Item</option>
              <option value="log">Food Log</option>
              <option value="receipt">Receipt/Purchase</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="input-field"
              placeholder="Add any notes about this image..."
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      {/* Uploaded Images Gallery */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Uploaded Images ({images.length})
        </h2>
        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={image.data}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-900 mb-1 truncate">{image.filename}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Uploaded: {new Date(image.uploadedAt).toLocaleDateString()} at{' '}
                    {new Date(image.uploadedAt).toLocaleTimeString()}
                  </p>
                  <div className="flex space-x-2">
                    <a
                      href={image.data}
                      download={image.filename}
                      className="btn-secondary text-xs flex-1 text-center"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-xs flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No images uploaded yet</p>
            <p className="mt-2">Upload your first receipt or food label image!</p>
          </div>
        )}
      </div>

      {/* Features Info */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Future Features (Part 2)</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>AI-powered OCR to extract text from receipts</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Automatic food label scanning and nutrition analysis</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Auto-populate inventory from scanned receipts</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Expiration date detection from product labels</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Price tracking and budget analysis from receipts</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;


