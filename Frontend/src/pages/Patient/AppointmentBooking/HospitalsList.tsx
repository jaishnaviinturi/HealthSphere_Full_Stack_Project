import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import axios from 'axios';

interface HospitalsListProps {
  specialty: string | null;
  onSelectHospital: (hospital: { id: string; name: string }) => void;
}

interface Hospital {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
}

const HospitalsList: React.FC<HospitalsListProps> = ({ specialty, onSelectHospital }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scrollContainer = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const endpoint = specialty
          ? `https://healthsphere-yfr0.onrender.com/appointments/hospitals/specialization/${specialty}`
          : 'https://healthsphere-yfr0.onrender.com/appointments/hospitals';
        const response = await axios.get<{ hospitals: Hospital[] }>(endpoint);
        setHospitals(response.data.hospitals);
      } catch (err: any) {
        setError('Failed to load hospitals');
        console.error('Error fetching hospitals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [specialty]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading hospitals...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
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
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="flex-none w-80 snap-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
            onClick={() => onSelectHospital({ id: hospital.id, name: hospital.name })}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={hospital.image}
                alt={hospital.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{hospital.location}</span>
                </div>
                <div className="mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{hospital.rating}</span>
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
  );
};

export default HospitalsList;