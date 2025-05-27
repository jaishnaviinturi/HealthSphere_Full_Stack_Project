import React, { useState } from 'react';
import { Pill, Phone, AlertCircle } from 'lucide-react';
import { DaySelector } from '@/components/DaySelector';
import { TimeSelector } from '@/components/TimeSelector';
import type { ReminderFormData } from '@/types/types.ts';

function App() {
  const [formData, setFormData] = useState<ReminderFormData>({
    phone: '',
    reminder: {
      pill_name: '',
      frequency: 1,
      times: [''],
      days: [],
    },
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('Sending data to backend:', JSON.stringify(formData, null, 2));

    try {
      const response = await fetch('https://healthsphere-flask-3.onrender.com/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response body:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      setSuccess(data.message || 'Reminder created successfully!');
      setFormData({
        phone: '',
        reminder: {
          pill_name: '',
          frequency: 1,
          times: [''],
          days: [],
        },
      });
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to create reminder. Please try again.');
    }
  };

  const handleFrequencyChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      reminder: {
        ...prev.reminder,
        frequency: value,
        times: Array(value).fill(''),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <div className="text-center mb-8">
            <Pill className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Medication Reminder</h2>
            <p className="mt-2 text-gray-600">Never miss your medication again</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1234567890"
                  className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medication Name
              </label>
              <input
                type="text"
                value={formData.reminder.pill_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  reminder: { ...prev.reminder, pill_name: e.target.value }
                }))}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter medication name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daily Frequency
              </label>
              <select
                value={formData.reminder.frequency}
                onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Once a day</option>
                <option value={2}>Twice a day</option>
                <option value={3}>Three times a day</option>
                <option value={4}>Four times a day</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Times
              </label>
              <TimeSelector
                times={formData.reminder.times}
                onChange={(times) => setFormData(prev => ({
                  ...prev,
                  reminder: { ...prev.reminder, times }
                }))}
                frequency={formData.reminder.frequency}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days of the Week
              </label>
              <DaySelector
                selectedDays={formData.reminder.days}
                onChange={(days) => setFormData(prev => ({
                  ...prev,
                  reminder: { ...prev.reminder, days }
                }))}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Reminder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;