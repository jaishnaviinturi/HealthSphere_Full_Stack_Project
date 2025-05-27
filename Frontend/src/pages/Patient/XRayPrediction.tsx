import React, { useState } from 'react';
import { Upload, Brain, Eye, Settings as Lungs, AlertCircle, Loader2 } from 'lucide-react';

type ModelType = 'eye' | 'chest' | 'brain';

interface PredictionResponse {
  prediction: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>('eye');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('model', selectedModel);

    try {
      const response = await fetch('https://healthsphere-flask-3.onrender.com/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data: PredictionResponse = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modelIcons = {
    eye: <Eye className="w-6 h-6" />,
    chest: <Lungs className="w-6 h-6" />,
    brain: <Brain className="w-6 h-6" />,
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80')`,
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-2">
            Medical Image Analysis
          </h1>
          <p className="text-center text-blue-600 mb-8">Advanced AI-powered diagnostic assistance</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Selection */}
            <div className="grid grid-cols-3 gap-4">
              {(['eye', 'chest', 'brain'] as ModelType[]).map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => setSelectedModel(model)}
                  className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                    selectedModel === model
                      ? 'border-blue-500 bg-blue-50/80 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                >
                  {modelIcons[model]}
                  <span className="capitalize font-medium">{model}</span>
                </button>
              ))}
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-white/50 hover:bg-white/80 transition-all">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-blue-400 mb-4" />
                <span className="text-blue-800 font-medium">
                  Click to upload or drag and drop
                </span>
                <span className="text-sm text-blue-600 mt-1">
                  PNG, JPG up to 10MB
                </span>
              </label>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedFile || loading}
              className={`w-full py-4 px-4 rounded-lg text-white font-medium transition-all ${
                !selectedFile || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing...
                </span>
              ) : (
                'Analyze Image'
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm rounded-lg flex items-center text-red-700 border border-red-100">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Prediction Result */}
          {prediction && (
            <div className="mt-6 p-6 bg-green-50/80 backdrop-blur-sm rounded-lg border border-green-100">
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                Analysis Result
              </h2>
              <p className="text-green-800">{prediction}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;