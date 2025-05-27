import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Search } from 'lucide-react';

const DISCLAIMER = "\n\nIMPORTANT: This information is for educational purposes only and should not be considered medical advice. Always consult a qualified healthcare professional before starting, stopping, or changing any medication. They can provide personalized advice based on your specific medical history and current conditions.";

function App() {
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Use environment variable for the backend API URL
  const API_URL =  'https://healthsphere-flask-3.onrender.com';

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setSelectedFile(acceptedFiles[0]);
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      // Create FormData to send the image file to the backend
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make API call to the backend
      const response = await fetch(`${API_URL}/api/pill/image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.result) {
        setResult(data.result);
      } else {
        setResult(data.error || 'Error analyzing the image. Please try again.');
      }
    } catch (error) {
      console.error('Error in image analysis:', error);
      setResult('Error analyzing the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setLoading(true);
    try {
      // Make API call to the backend for text search
      const response = await fetch(`${API_URL}/api/pill/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchText }),
      });

      const data = await response.json();

      if (response.ok && data.result) {
        setResult(data.result);
      } else {
        setResult(data.error || 'Error searching for medication. Please try again.');
      }
    } catch (error) {
      console.error('Error searching medication:', error);
      setResult('Error searching for medication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/013/218/336/non_2x/herbal-capsule-pill-leaf-medicine-logo-icon-illustration-template-capsule-pharmacy-medical-logo-template-vector.jpg" 
            alt="Pill Identifier Logo" 
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Pill Identifier</h1>
          <p className="text-slate-600">Upload an image or search by name to identify medications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Pill Image</h2>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-4
                ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <p className="text-lg mb-2">Click to upload image</p>
              <p className="text-sm text-gray-500">or drag and drop</p>
              {selectedFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <button
              onClick={analyzeImage}
              disabled={!selectedFile || loading}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${!selectedFile || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
            >
              <Upload className="w-5 h-5" />
              Identify Pill
            </button>
          </div>

          {/* Text Search Section */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Search by Name</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter pill name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-slate-600">Analyzing...</p>
          </div>
        )}
        
        {result && !loading && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="prose max-w-none">
              {result.split('\n').map((line, index) => (
                <p key={index} className={`mb-4 ${line.startsWith('IMPORTANT:') ? 'text-red-600 font-semibold' : ''}`}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;