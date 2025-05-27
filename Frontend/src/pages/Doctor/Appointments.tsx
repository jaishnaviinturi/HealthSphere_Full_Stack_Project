import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // To decode the JWT token

function Appointments() {
  interface Appointment {
    id: string;
    patientName: string;
    date: string; // Add date field to match backend response
    status: string;
    time: string;
    reason: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('doctorToken');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        // Decode the token to get the doctorId
        interface DecodedToken {
          id: string;
          [key: string]: any; // Allow other properties if needed
        }

        const decoded = jwtDecode<DecodedToken>(token);
        const doctorId = decoded.id;

        console.log('Fetching appointments for date:', selectedDate); // Debug log

        // Fetch appointments from the backend with the selected date as a query parameter
        const response = await fetch(
          `https://healthsphere-yfr0.onrender.com/doctors/${doctorId}/appointments?date=${selectedDate}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch appointments');
        }

        const data = await response.json();
        console.log('Received appointments:', data.appointments); // Debug log
        setAppointments(data.appointments || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]); // Re-fetch appointments when the selected date changes

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value); // Update the selected date
    setLoading(true); // Set loading state while fetching new data
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80")',
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-20">
          <div className="bg-white rounded-xl shadow-2xl p-6 backdrop-blur-lg bg-opacity-95">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-blue-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="border rounded-lg px-3 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Confirmed Appointments</h2>
              {appointments.length === 0 ? (
                <p className="text-gray-600">No confirmed appointments found for this date.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {appointments.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="text-blue-600" />
                          <span className="font-semibold text-gray-800">{appointment.patientName}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="text-gray-400 w-4 h-4" />
                          <span className="text-gray-600">{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="text-gray-400 w-4 h-4" />
                          <span className="text-gray-600">{appointment.reason}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Quick Stats</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Appointments</h3>
                  <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;