import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, Trash2 } from 'lucide-react';

// Define the Doctor type
type Doctor = {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
  experience: string;
  rating: number;
  image: string;
};

// DoctorCard Component
type DoctorCardProps = {
  doctor: Doctor;
  onDelete: (id: string) => void;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={
            doctor.image.startsWith('http')
              ? doctor.image
              : `https://healthsphere-yfr0.onrender.com${doctor.image}` || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop'
          }
          alt={doctor.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop'; // Fallback image
            console.log(`Image load failed for ${doctor.image}, using fallback`); // Debug
          }}
        />
        <button
          onClick={() => onDelete(doctor.id)}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Delete doctor"
        >
          <Trash2 size={20} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{doctor.fullName}</h3>
        <p className="text-gray-600">{doctor.specialization}</p>
        <div className="mt-2 flex items-center gap-1">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="text-gray-700">{doctor.rating.toFixed(1)}</span>
        </div>
        <p className="mt-2 text-gray-600">
          {doctor.experience} years of experience
        </p>
      </div>
    </div>
  );
};

// StaffManagement Component
const StaffManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch hospital ID and token from localStorage
  const hospitalId = localStorage.getItem('hospitalId');
  const token = localStorage.getItem('hospitalToken');
  const userType = localStorage.getItem('userType');

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      if (userType !== 'hospital') {
        setError('You must be logged in as a hospital to view this page.');
        setLoading(false);
        navigate('/login/hospital');
        return;
      }

      if (!hospitalId || !token) {
        setError('Hospital ID or token not found. Please log in again.');
        setLoading(false);
        navigate('/login/hospital');
        return;
      }

      try {
        console.log('Fetching doctors with:', { hospitalId, token }); // Debugging log
        const response = await fetch(`https://healthsphere-yfr0.onrender.com/doctors/${hospitalId}/doctors`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch doctors');
        }

        const data = await response.json();
        console.log('Fetched doctors:', data); // Debugging log
        const mappedDoctors = data.map((doctor: any) => ({
          id: doctor._id, // Ensure this matches the backend's ID field
          fullName: doctor.fullName,
          email: doctor.email,
          specialization: doctor.specialization,
          experience: doctor.experience,
          rating: doctor.rating,
          image: doctor.image,
        }));
        setDoctors(mappedDoctors);
      } catch (err: any) {
        console.error('Fetch doctors error:', err); // Debugging log
        setError(err.message || 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [hospitalId, token, userType, navigate]);

  const handleDeleteDoctor = async (id: string) => {
    if (!hospitalId || !token) {
      setError('Hospital ID or token not found. Please log in again.');
      navigate('/login/hospital');
      return;
    }

    try {
      const response = await fetch(`https://healthsphere-yfr0.onrender.com/doctors/${hospitalId}/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete doctor');
      }

      setDoctors(doctors.filter(doctor => doctor.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hospitalId');
    localStorage.removeItem('hospitalToken');
    localStorage.removeItem('userType');
    navigate('/login/hospital');
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat pt-20 px-6"
      style={{ 
        backgroundImage: 'url(https://img.freepik.com/free-photo/health-still-life-with-copy-space_23-2148854031.jpg)'
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Staff Management</h1>
            <div>
              <button
                onClick={() => navigate('/hospital/staff-management/add-doctor')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4"
              >
                <Plus size={20} />
                Add Doctor
              </button>
              {/* <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button> */}
            </div>
          </div>

          {error && (
            <div className="text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => navigate('/login/hospital')}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Log in
              </button>
            </div>
          )}

          {doctors.length === 0 && !error ? (
            <p className="text-center text-white">No doctors found. Add a doctor to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  onDelete={handleDeleteDoctor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;