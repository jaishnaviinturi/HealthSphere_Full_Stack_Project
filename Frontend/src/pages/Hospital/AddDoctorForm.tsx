import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DoctorFormData = {
  fullName: string;
  email: string;
  password: string;
  specialization: string;
  experience: number;
  rating: number;
  image: File | null; // Changed from string to File | null
};

type AddDoctorFormProps = {
  onClose?: () => void;
};

const AddDoctorForm: React.FC<AddDoctorFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: '',
    email: '',
    password: '',
    specialization: '',
    experience: 0,
    rating: 5,
    image: null, // Initial value is null
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const hospitalId = localStorage.getItem('hospitalId');
  const token = localStorage.getItem('hospitalToken');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (userType !== 'hospital' || !token || !hospitalId) {
      setError('You must be logged in as a hospital to add a doctor.');
      setTimeout(() => navigate('/login/hospital'), 2000);
    }
  }, [userType, token, hospitalId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!hospitalId || !token) {
      setError('Hospital ID or token not found. Please log in again.');
      navigate('/login/hospital');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('specialization', formData.specialization);
      formDataToSend.append('experience', formData.experience.toString());
      formDataToSend.append('rating', formData.rating.toString());
      if (formData.image) {
        formDataToSend.append('image', formData.image);
        console.log('Uploading image:', formData.image.name); // Debug
      }
  
      const response = await fetch(`https://healthsphere-yfr0.onrender.com/doctors/${hospitalId}/doctors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add doctor');
      }
  
      const result = await response.json();
      console.log('Doctor added response:', result); // Debug
      if (onClose) onClose();
      navigate('/hospital/staff-management');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setFormData((prev) => ({
        ...prev,
        image: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'experience' || name === 'rating' ? Number(value) : value,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        )}
        
        <h2 className="text-2xl font-bold mb-6">Add New Doctor</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/jpeg,image/jpg,image/png"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorForm;