import React, { useState, useEffect } from 'react';
import { Calendar, Video } from 'lucide-react';
import axios from 'axios';

interface AppointmentBookingProps {
  hospital: { id: string; name: string };
  specialty: string;
  doctor: { id: string; name: string };
  patientId: string;
  onBookingSubmit: () => void;
  isBookingSubmitted: boolean;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  hospital,
  specialty,
  doctor,
  patientId,
  onBookingSubmit,
  isBookingSubmitted,
}) => {
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'video'>('in-person');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [patientName, setPatientName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch patient name on component mount
  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = localStorage.getItem('patientToken');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }
        const response = await axios.get(`https://healthsphere-yfr0.onrender.com/patients/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatientName(response.data.fullName);
      } catch (err: any) {
        setError('Failed to load patient profile');
        console.error('Error fetching patient profile:', err);
      }
    };

    fetchPatientProfile();
  }, [patientId]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate) return;
      try {
        const response = await axios.get('https://healthsphere-yfr0.onrender.com/appointments/timeslots', {
          params: {
            hospitalId: hospital.id,
            doctorId: doctor.id,
            date: selectedDate,
          },
        });
        setTimeSlots(response.data.availableSlots);
      } catch (err: any) {
        setError('Failed to load time slots');
        console.error('Error fetching time slots:', err);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, hospital.id, doctor.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('patientToken');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await axios.post(
        `https://healthsphere-yfr0.onrender.com/appointments/${patientId}/book`,
        {
          patientName,
          problem: 'General checkup',
          specialization: specialty,
          hospitalId: hospital.id,
          doctorId: doctor.id,
          date: selectedDate,
          time: selectedTime,
          appointmentType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Appointment booked:', response.data);
      onBookingSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        {isBookingSubmitted ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-600">
              Your booking application is successfully sent
            </h2>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Book Your Appointment
            </h2>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                <div>
                  <p className="font-medium">Hospital</p>
                  <p>{hospital.name}</p>
                </div>
                <div>
                  <p className="font-medium">Specialty</p>
                  <p>{specialty}</p>
                </div>
                <div>
                  <p className="font-medium">Doctor</p>
                  <p>{doctor.name}</p>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Appointment Type</h3>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setAppointmentType('in-person')}
                    className={`flex-1 p-4 rounded-lg border-2 ${
                      appointmentType === 'in-person'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    disabled={loading}
                  >
                    <Calendar className="mx-auto mb-2" size={24} />
                    <p className="text-center font-medium">In-Person Visit</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppointmentType('video')}
                    className={`flex-1 p-4 rounded-lg border-2 ${
                      appointmentType === 'video'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    disabled={loading}
                  >
                    <Video className="mx-auto mb-2" size={24} />
                    <p className="text-center font-medium">Video Consultation</p>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Select Time</h3>
                {timeSlots.length === 0 && selectedDate && (
                  <p className="text-gray-500">No available slots for this date.</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border ${
                        selectedTime === time
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                      disabled={loading}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={loading || !selectedTime}
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;