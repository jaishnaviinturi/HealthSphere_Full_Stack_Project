import React, { useState } from 'react';
import { Dumbbell, Utensils, Send } from 'lucide-react';

interface FormData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  fitnessLevel: string;
  primaryGoal: string;
  dietaryPreference: string;
  planType: 'diet' | 'workout';
}

interface PlanResponse {
  plan?: string;
  error?: string;
}

function Fitness() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    activityLevel: 'Moderate',
    fitnessLevel: '3',
    primaryGoal: 'Weight Loss',
    dietaryPreference: 'None',
    planType: 'diet'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlan('');

    try {
      const response = await fetch('https://healthsphere-flask-3.onrender.com/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Convert string values to numbers where needed
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          fitnessLevel: parseInt(formData.fitnessLevel)
        }),
      });

      const data: PlanResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.plan) {
        setPlan(data.plan);
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex"
      style={{
        backgroundImage: 'url(https://st5.depositphotos.com/1558912/64911/i/450/depositphotos_649119262-stock-photo-fitness-background-pink-dumbbells-towel.jpg)',
      }}
    >
      {/* Side Navigation */}
      <div className="w-24 bg-white/90 backdrop-blur-sm flex flex-col items-center py-8 shadow-lg">
        <button
          onClick={() => setFormData(prev => ({ ...prev, planType: 'diet' }))}
          className={`p-4 rounded-full mb-4 transition-all ${
            formData.planType === 'diet'
              ? 'bg-rose-500 text-white shadow-lg scale-110'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Utensils className="w-6 h-6" />
        </button>
        <button
          onClick={() => setFormData(prev => ({ ...prev, planType: 'workout' }))}
          className={`p-4 rounded-full transition-all ${
            formData.planType === 'workout'
              ? 'bg-rose-500 text-white shadow-lg scale-110'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Dumbbell className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  {formData.planType === 'diet' ? 'Personalized Diet Plan' : 'Custom Workout Plan'}
                </h1>
                <p className="mt-2 text-gray-600">
                  Get your customized {formData.planType} plan based on your profile
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      required
                      value={formData.age}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      required
                      value={formData.height}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      placeholder="Height in centimeters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      required
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      placeholder="Weight in kilograms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    >
                      <option value="Sedentary">Sedentary</option>
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Active">Active</option>
                      <option value="Very Active">Very Active</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fitness Level (1-5)</label>
                    <select
                      name="fitnessLevel"
                      value={formData.fitnessLevel}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    >
                      <option value="1">1 - Beginner</option>
                      <option value="2">2 - Novice</option>
                      <option value="3">3 - Intermediate</option>
                      <option value="4">4 - Advanced</option>
                      <option value="5">5 - Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Primary Goal</label>
                    <select
                      name="primaryGoal"
                      value={formData.primaryGoal}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    >
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="General Fitness">General Fitness</option>
                      <option value="Athletic Performance">Athletic Performance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dietary Preference</label>
                    <select
                      name="dietaryPreference"
                      value={formData.dietaryPreference}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    >
                      <option value="None">None</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Keto">Keto</option>
                      <option value="Paleo">Paleo</option>
                      <option value="Mediterranean">Mediterranean</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all hover:scale-105"
                  >
                    {loading ? (
                      'Generating Plan...'
                    ) : (
                      <>
                        Generate {formData.planType === 'diet' ? 'Diet' : 'Workout'} Plan
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 rounded-md">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {plan && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Your Personalized {formData.planType === 'diet' ? 'Diet' : 'Workout'} Plan
                  </h2>
                  <div className="prose prose-rose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{plan}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fitness;