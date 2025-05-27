import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface Appointment {
  hospitalName: string;
  specialization: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

const PatientHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientId, setPatientId] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('patientToken');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setPatientId(decoded.id);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('patientToken');
        navigate('/login/patient');
      }
    } else {
      navigate('/login/patient');
    }
  }, [navigate]);

  useEffect(() => {
    if (!patientId) return;

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('patientToken');
        const response = await axios.get(
          `https://healthsphere-yfr0.onrender.com/patients/${patientId}/appointments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (err: any) {
        setError('Failed to load appointments');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    navigate('/login/patient');
  };

  if (!patientId) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="bg-white shadow-md fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://marketplace.canva.com/EAE8fLYOzrA/1/0/1600w/canva-health-care-bO8TgMWVszg.jpg"
              alt="Healthsphere Logo"
              className="h-12 w-auto"
            />
            <h1 className="ml-4 text-2xl font-bold text-indigo-600">Healthsphere</h1>
          </div>
          <nav className="space-x-6 flex items-center">
            <Link
              to="/patient/appointments"
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
                alt="Back to Appointments Icon"
                className="h-5 w-5 mr-1"
              />
              Back to Appointments
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="pt-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Appointment History</h2>
        <div className="mb-8">
          <Link
            to="/appointments"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Book New Appointment
          </Link>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Your Appointments</h3>
        {loading ? (
          <div className="text-center text-gray-500">Loading appointments...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-gray-500">No appointments found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-semibold text-gray-900">{appointment.hospitalName}</h4>
                <p className="text-gray-600 mt-2">
                  <strong>Specialty:</strong> {appointment.specialization}
                </p>
                <p className="text-gray-600">
                  <strong>Doctor:</strong> {appointment.doctorName}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {appointment.date}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong> {appointment.time}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`${
                      appointment.status === 'pending'
                        ? 'text-yellow-600'
                        : appointment.status === 'confirmed'
                        ? 'text-green-600'
                        : 'text-red-600'
                    } capitalize`}
                  >
                    {appointment.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;