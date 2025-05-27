import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import axios from 'axios';

interface DoctorsListProps {
  hospital: { id: string; name: string };
  specialty: string;
  onSelectDoctor: (doctor: { id: string; name: string }) => void;
}

interface Doctor {
  id: string;
  name: string;
  image: string;
  experience: string;
  rating: number;
}

const DoctorsList: React.FC<DoctorsListProps> = ({ hospital, specialty, onSelectDoctor }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scrollContainer = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('https://healthsphere-yfr0.onrender.com/appointments/doctors', {
          params: {
            hospitalId: hospital.id,
            specialization: specialty,
          },
        });
        console.log('Fetched doctors:', response.data.doctors);
        setDoctors(response.data.doctors);
      } catch (err: any) {
        setError('Failed to load doctors. Please try again later.');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [hospital, specialty]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading doctors...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (doctors.length === 0) return <div className="text-center text-gray-500">No doctors available for this specialty at this hospital.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
          Choose Your Doctor
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {specialty} specialists at {hospital.name}
        </p>
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <div
            ref={scrollContainer}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex-none w-72 snap-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
                onClick={() => onSelectDoctor({ id: doctor.id, name: doctor.name })}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={
                      doctor.image.startsWith('http')
                        ? doctor.image
                        : `https://healthsphere-yfr0.onrender.com${doctor.image}`
                    }
                    alt={doctor.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150';
                      console.error(`Image load failed for doctor ${doctor.id}: ${doctor.image}`);
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-gray-600 mt-1">{doctor.experience}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="fill-yellow-500 text-yellow-500" size={16} />
                      <span>{doctor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;