import React, { useState } from 'react';
import { FileText, Loader2, Image as ImageIcon } from 'lucide-react';

// Define interfaces for the analysis data structure
interface MetricData {
  abnormal: boolean;
  value: string | number;
  unit: string;
  normalRange: string;
}

interface AnalysisSummary {
  summary: string;
  bloodGlucoseAnalysis?: string;
  cholesterolAnalysis?: string;
  hemoglobinAnalysis?: string;
}

interface Recommendations {
  immediate?: string[];
  shortTerm?: string[];
  longTerm?: string[];
}

interface AnalysisData {
  analysis: {
    Metrics: Record<string, MetricData>;
    Analysis: AnalysisSummary;
    Recommendations: Recommendations;
  };
}

function ReportAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const allowedTypes: Record<string, string> = {
    'application/pdf': 'PDF',
    'image/jpeg': 'Image',
    'image/jpg': 'Image',
    'image/png': 'Image',
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile && selectedFile.type in allowedTypes) {
      setFile(selectedFile);
      setError('');
      setAnalysisData(null);

      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            const result =
              typeof reader.result === 'string'
                ? reader.result
                : new TextDecoder().decode(reader.result as ArrayBuffer);
            setPreview(result);
          }
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview('');
      }
    } else {
      setError('Please upload a PDF or image file (JPG, JPEG, PNG)');
      setFile(null);
      setPreview('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://healthsphere-flask-3.onrender.com/analyze-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data: AnalysisData | { error: string } = await response.json();
      console.log('Analysis Data:', data); // Debug log
      if ('error' in data) {
        throw new Error(data.error);
      }

      setAnalysisData(data as AnalysisData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to analyze the file. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysisContent = () => {
    if (!analysisData) return null;

    const { Metrics, Analysis, Recommendations } = analysisData.analysis;

    return (
      <div className="space-y-8">
        {Metrics && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Medical Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(Metrics).map(([metric, data]) => (
                <div
                  key={metric}
                  className={`p-4 rounded-lg border ${
                    !data.abnormal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <h4 className="font-semibold text-gray-800">{metric}</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Value:</span> {data.value} {data.unit}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Normal Range:</span> {data.normalRange}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        !data.abnormal ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      Status: {data.abnormal ? 'Abnormal' : 'Normal'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {Analysis && Analysis.summary && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analysis Summary</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">{Analysis.summary}</p>
              {Analysis.bloodGlucoseAnalysis && (
                <p className="text-gray-700">{Analysis.bloodGlucoseAnalysis}</p>
              )}
              {Analysis.cholesterolAnalysis && (
                <p className="text-gray-700">{Analysis.cholesterolAnalysis}</p>
              )}
              {Analysis.hemoglobinAnalysis && (
                <p className="text-gray-700">{Analysis.hemoglobinAnalysis}</p>
              )}
            </div>
          </div>
        )}

        {Recommendations && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recommendations</h2>
            {Recommendations.immediate && (
              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-700">Immediate</h3>
                <ul className="space-y-2">
                  {Recommendations.immediate.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm">
                        {index + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Recommendations.shortTerm && (
              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-700 mt-4">Short-Term</h3>
                <ul className="space-y-2">
                  {Recommendations.shortTerm.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm">
                        {index + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Recommendations.longTerm && (
              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-700 mt-4">Long-Term</h3>
                <ul className="space-y-2">
                  {Recommendations.longTerm.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm">
                        {index + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://wallpaperaccess.com/full/136949.jpg)',
      }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Medical Analysis AI</h1>
            <p className="text-gray-200 text-lg">
              Upload medical reports (PDF) or medical images for comprehensive AI-powered analysis
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`border-3 border-dashed rounded-xl p-8 text-center transition-all duration-300
                  ${file ? 'border-blue-400 bg-blue-50/80' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'}`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  {preview ? (
                    <div className="relative w-56 h-56 mx-auto mb-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg shadow-md"
                      />
                    </div>
                  ) : file?.type === 'application/pdf' ? (
                    <FileText className="h-16 w-16 text-blue-500 mb-3" />
                  ) : (
                    <div className="flex items-center space-x-4 mb-3">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <span className="text-base text-gray-700 font-medium">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-sm text-gray-500">
                    PDF files or images (JPG, JPEG, PNG)
                  </span>
                </label>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-4 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || loading}
                className={`w-full py-4 px-6 rounded-lg text-white font-medium flex items-center justify-center space-x-3 transition-all duration-300
                  ${!file || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg">Analyzing...</span>
                  </>
                ) : (
                  <>
                    {file?.type === 'application/pdf' ? (
                      <FileText className="h-6 w-6" />
                    ) : (
                      <ImageIcon className="h-6 w-6" />
                    )}
                    <span className="text-lg">
                      Analyze {file?.type === 'application/pdf' ? 'Report' : 'Image'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {analysisData && (
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8">
              {renderAnalysisContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportAnalysis;