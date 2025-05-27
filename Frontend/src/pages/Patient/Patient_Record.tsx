import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HealthRecord {
  id: string;
  medicalCondition: string;
  monthsSince: number;
  currentMedications: string;
  date: string;
  fileName?: string;
  filePath?: string;
}

const Patient_Record = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [formData, setFormData] = useState<Omit<HealthRecord, 'id' | 'date'>>({
    medicalCondition: '',
    monthsSince: 0,
    currentMedications: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const patientId = localStorage.getItem('patientId');
  const token = localStorage.getItem('patientToken');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (userType !== 'patient' || !patientId || !token) {
      setError('You must be logged in as a patient to access this page.');
      navigate('/login/patient');
      return;
    }

    const fetchRecords = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://healthsphere-yfr0.onrender.com/patients/${patientId}/health-records`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Unexpected response format: Server returned non-JSON data');
          }
          const errorData = await response.json();
          if (response.status === 401) {
            setError('Session expired. Please log in again.');
            localStorage.clear();
            navigate('/login/patient');
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch health records');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: Expected an array of records');
        }
        setRecords(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patientId, token, userType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!patientId || !token) {
      setError('You must be logged in to add a health record.');
      navigate('/login/patient');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('medicalCondition', formData.medicalCondition);
      formDataToSend.append('monthsSince', formData.monthsSince.toString());
      formDataToSend.append('currentMedications', formData.currentMedications);
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await fetch(`https://healthsphere-yfr0.onrender.com/patients/${patientId}/health-records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Unexpected response format: Server returned non-JSON data');
        }
        const errorData = await response.json();
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.clear();
          navigate('/login/patient');
          return;
        }
        throw new Error(errorData.message || 'Failed to add health record');
      }

      const data = await response.json();
      if (!data.record) {
        throw new Error('Invalid response format: Expected a record object');
      }
      setRecords((prevRecords) => [...prevRecords, data.record]);
      setFormData({ medicalCondition: '', monthsSince: 0, currentMedications: '' });
      setSelectedFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while adding the record');
      const fetchRecords = async () => {
        const response = await fetch(`https://healthsphere-yfr0.onrender.com/patients/${patientId}/health-records`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRecords(data);
        }
      };
      fetchRecords();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!patientId || !token) {
      setError('You must be logged in to delete a health record.');
      navigate('/login/patient');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://healthsphere-yfr0.onrender.com/patients/${patientId}/health-records/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Unexpected response format: Server returned non-JSON data');
        }
        const errorData = await response.json();
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.clear();
          navigate('/login/patient');
          return;
        }
        throw new Error(errorData.message || 'Failed to delete health record');
      }

      setRecords(records.filter(record => record.id !== id));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while deleting the record');
      const fetchRecords = async () => {
        const response = await fetch(`https://healthsphere-yfr0.onrender.com/patients/${patientId}/health-records`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRecords(data);
        }
      };
      fetchRecords();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2F4F4F] p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Record</h1>
          {loading && <p className="text-blue-500 mb-4">Loading...</p>}
          {error && <p className="text-red-500 mb-4 versatile-text">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-lg mb-2">Medical Condition</label>
              <input
                type="text"
                required
                value={formData.medicalCondition}
                onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg mb-2">Months Since Condition Started</label>
              <input
                type="number"
                required
                min="0"
                value={formData.monthsSince}
                onChange={(e) => setFormData({ ...formData, monthsSince: Number(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg mb-2">Current Medications</label>
              <textarea
                required
                value={formData.currentMedications}
                onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg mb-2">Upload Medical Records (PDF/Image)</label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-teal-400"
            >
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Previous Records</h2>
          {loading && <p className="text-blue-500 mb-4">Loading...</p>}
          {error && <p className="text-red-500 mb-4 versatile-text">{error}</p>}
          {records.length === 0 && !loading && !error && (
            <p className="text-gray-500 italic text-lg">No health records found.</p>
          )}
          {!loading && !error && records.length > 0 && (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{record.medicalCondition}</h3>
                      <p className="text-gray-600">Started {record.monthsSince} months ago</p>
                      <p className="text-gray-600 mt-2">Medications: {record.currentMedications}</p>
                      {record.fileName && (
                        <p className="text-gray-600 mt-2">
                          Attached file: <a href={`https://healthsphere-yfr0.onrender.com/${record.filePath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{record.fileName}</a>
                        </p>
                      )}
                      <p className="text-gray-400 text-sm mt-2">Added on {record.date}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(record.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 disabled:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patient_Record;