import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Heart, Pill, FileText } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

function PatientRecords() {
  interface PatientRecord {
    id: string;
    username: string;
    healthRecords: {
      condition: string;
      monthsSinceStart: number;
      medications: string[];
      report: string;
    }[];
  }

  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatDate = (date: Date) => {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(new Date(selectedDate));
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate.toISOString().split('T')[0]);
    setShowCalendar(false);
  };

  const selectDay = (day: number | null) => {
    if (day) {
      const newDate = new Date(selectedDate);
      newDate.setDate(day);
      setSelectedDate(newDate.toISOString().split('T')[0]);
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    const fetchPatientRecords = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('doctorToken');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        interface DecodedToken {
          id: string;
          [key: string]: any;
        }

        const decoded = jwtDecode<DecodedToken>(token);
        const doctorId = decoded.id;

        const response = await fetch(
          `https://healthsphere-yfr0.onrender.com/doctors/${doctorId}/patient-records?date=${selectedDate}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch patient records');
        }

        const data = await response.json();
        setPatients(data.patients || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientRecords();
  }, [selectedDate]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: 'url(https://i.pinimg.com/originals/36/42/29/3642291603d80cbf90ee7421ba227a8b.jpg)' }}>
      <div className="min-h-screen bg-white/60">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Patient Medical Records</h1>

          {/* Calendar Dropdown */}
          <div className="relative mb-8">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full md:w-auto bg-white/90 shadow-lg rounded-lg px-6 py-3 flex items-center space-x-3 hover:bg-white transition-colors"
            >
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">{formatDate(new Date(selectedDate))}</span>
            </button>

            {showCalendar && (
              <div className="absolute top-full mt-2 w-full md:w-[400px] bg-white/95 backdrop-blur-sm rounded-lg shadow-xl z-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {months[new Date(selectedDate).getMonth()]} {new Date(selectedDate).getFullYear()}
                  </h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => changeMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      ←
                    </button>
                    <button 
                      onClick={() => changeMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      →
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-1">
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) => (
                    <div 
                      key={index}
                      onClick={() => selectDay(day)}
                      className={`
                        text-center py-1 text-sm rounded-full
                        ${day === null ? '' : 'hover:bg-blue-50 cursor-pointer'}
                        ${day === new Date(selectedDate).getDate() ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                      `}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Patient Records Section */}
          <div className="grid gap-6">
            {patients.length === 0 ? (
              <p className="text-gray-600 text-center">No patient records found for this date.</p>
            ) : (
              patients.map(patient => (
                <div key={patient.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.01]">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100/90 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{patient.username}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {patient.healthRecords.map((record, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start space-x-3">
                          <Heart className="w-5 h-5 text-red-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Medical Condition</p>
                            <p className="font-medium text-gray-900">{record.condition}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Clock className="w-5 h-5 text-yellow-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Months Since Start</p>
                            <p className="font-medium text-gray-900">{record.monthsSinceStart} months</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Pill className="w-5 h-5 text-green-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Current Medications</p>
                            <p className="font-medium text-gray-900">{record.medications.join(", ")}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <FileText className="w-5 h-5 text-purple-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Report</p>
                            {record.report.startsWith('http') ? (
                              <a
                                href={record.report}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:underline"
                              >
                                View Report
                              </a>
                            ) : (
                              <p className="font-medium text-gray-900">{record.report}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientRecords;