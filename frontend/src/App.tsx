import { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageGallery from './components/ImageGallery';

function App() {
  const [uploadedCount, setUploadedCount] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  const [galleryKey, setGalleryKey] = useState(0);

  const handleUploadSuccess = (uploadedFiles: any[]) => {
    setUploadedCount((prev) => prev + uploadedFiles.length);
    // Refresh gallery
    setGalleryKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Image Processor
                </h1>
                <p className="text-sm text-gray-600">
                  Upload and manage your images with ease
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {uploadedCount}
                </p>
                <p className="text-sm text-gray-600">Images Uploaded</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              Upload
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                />
              </svg>
              Gallery
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Upload Images
            </h2>
            <ImageUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <ImageGallery key={galleryKey} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Drag & drop upload</li>
                <li>✓ Progress tracking</li>
                <li>✓ AWS S3 integration</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Technology</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>React + TypeScript</li>
                <li>Node.js + Express</li>
                <li>AWS S3 Storage</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
              <p className="text-sm text-gray-600">
                Max file size: 5MB per image
                <br />
                Supported formats: PNG, JPG, GIF, WebP
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 Image Processor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
