import React, { useState } from 'react';
import { Send, Loader2, ShieldCheck } from 'lucide-react';

interface UserProfile {
  age: string;
  location: string;
  health_status: string;
  smoker: string;
  income_level: string;
  family_status: string;
}

interface ApiResponse {
  status: string;
  plans?: string;
  message?: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserProfile>({
    age: '',
    location: '',
    health_status: 'Excellent',
    smoker: 'No',
    income_level: 'Middle',
    family_status: 'Single'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const response = await fetch('https://healthsphere-flask-3.onrender.com/api/health-insurance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (data.status === 'success' && data.plans) {
        setRecommendations(data.plans); // No need for extra cleaning since backend returns clean text
      } else {
        setError(data.message || 'Failed to get recommendations');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatRecommendations = (text: string) => {
    // Split the text into lines and group by Plan Type and Description
    const lines = text.split('\n').filter(line => line.trim());
    const sections: { planType: string; description: string }[] = [];
    let currentSection: { planType: string; description: string } | null = null;

    for (const line of lines) {
      if (line.startsWith('Plan Type:')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { planType: line.replace('Plan Type:', '').trim(), description: '' };
      } else if (line.startsWith('Description:') && currentSection) {
        currentSection.description = line.replace('Description:', '').trim();
      }
    }

    // Push the last section if it exists
    if (currentSection) {
      sections.push(currentSection);
    }

    // If no sections were found, display a fallback message
    if (sections.length === 0) {
      return <p className="text-gray-700">No recommendations could be parsed from the response.</p>;
    }

    return (
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white/80 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              {section.planType}
            </h3>
            <div className="text-gray-700 space-y-2">
              <p className="leading-relaxed">{section.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(https://medicaldialogues.in/h-upload/2022/10/13/187809-medical-insurance-1.webp)' }}>
      <div className="min-h-screen bg-gradient-to-br from-black/70 to-black/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.15)] p-8 transition-all duration-300">
            <div className="flex items-center justify-center gap-3 mb-8">
              <ShieldCheck className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Health Insurance Advisor
              </h1>
            </div>

            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Get personalized health insurance recommendations based on your profile. Our AI-powered system will analyze your needs and suggest the best plans for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-200"
                    placeholder="Enter your age"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-200"
                    placeholder="Enter your location"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Health Status</label>
                  <select
                    name="health_status"
                    value={formData.health_status}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-200"
                  >
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Smoker</label>
                  <select
                    name="smoker"
                    value={formData.smoker}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-200"
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Income Level</label>
                  <select
                    name="income_level"
                    value={formData.income_level}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-200"
                  >
                    <option>Low</option>
                    <option>Middle</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Family Status</label>
                  <select
                    name="family_status"
                    value={formData.family_status}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-200"
                  >
                    <option>Single</option>
                    <option>Married</option>
                    <option>Family with Children</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                      Analyzing Your Profile...
                    </>
                  ) : (
                    <>
                      <Send className="-ml-1 mr-3 h-6 w-6" />
                      Get Personalized Recommendations
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-700 text-center font-medium">{error}</p>
              </div>
            )}

            {recommendations && (
              <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                  Your Personalized Recommendations
                </h2>
                <div className="prose prose-blue max-w-none">
                  {formatRecommendations(recommendations)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;