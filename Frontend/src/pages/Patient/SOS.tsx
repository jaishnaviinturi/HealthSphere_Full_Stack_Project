import React, { useState, useEffect } from 'react';
import { Phone, Plus, AlertCircle, X, Bell } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

function App() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [audio] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    let timer: number;
    if (countdown !== null && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown(prev => (prev as number) - 1);
      }, 1000);
    } else if (countdown === 0) {
      triggerEmergencyCalls();
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (isAlarmActive) {
      audio.loop = true;
      audio.play().catch(error => console.log('Audio playback failed:', error));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isAlarmActive, audio]);

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
      setNewContact({ name: '', phone: '' });
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const startSOS = () => {
    setCountdown(5);
    setIsSOSActive(true);
    setIsAlarmActive(true);
  };

  const cancelSOS = () => {
    setCountdown(null);
    setIsSOSActive(false);
    setIsAlarmActive(false);
  };

  const triggerEmergencyCalls = () => {
    setIsSOSActive(false);
    setCountdown(null);
    contacts.forEach(contact => {
      window.location.href = `tel:${contact.phone}`;
    });
  };

  const callSingleContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const toggleAlarm = () => {
    setIsAlarmActive(!isAlarmActive);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://as1.ftcdn.net/jpg/01/04/16/40/1000_F_104164065_A5DX80QGB5H45XpLdWK0V256mN4HcTgc.jpg)',
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src="https://cdn.vectorstock.com/i/500p/04/37/sos-icon-emergency-alarm-button-sign-symbol-vector-26830437.jpg"
              alt="SOS Emergency"
              className="w-24 h-24 mb-4 rounded-full shadow-lg"
            />
            <h1 className="text-3xl font-bold text-white text-center text-shadow">Emergency SOS</h1>
          </div>

          {/* SOS and Alarm Buttons */}
          <div className="text-center space-y-4">
            {!isSOSActive ? (
              <>
                <button
                  onClick={startSOS}
                  className="bg-red-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-red-700 transition-colors w-full transform hover:scale-105"
                >
                  <AlertCircle className="inline-block mr-2" />
                  SOS EMERGENCY
                </button>
                <button
                  onClick={toggleAlarm}
                  className={`${
                    isAlarmActive ? 'bg-red-700' : 'bg-yellow-600'
                  } text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-yellow-700 transition-colors w-full transform hover:scale-105`}
                >
                  <Bell className="inline-block mr-2" />
                  {isAlarmActive ? 'Stop Alarm' : 'Sound Alarm'}
                </button>
              </>
            ) : (
              <div className="bg-red-100 p-4 rounded-lg shadow-lg">
                <p className="text-2xl font-bold text-red-600 mb-2">
                  Emergency call in {countdown} seconds
                </p>
                <button
                  onClick={cancelSOS}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel Emergency Call
                </button>
              </div>
            )}
          </div>

          {/* Emergency Contacts Form */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Add Emergency Contact</h2>
            <form onSubmit={addContact} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors transform hover:scale-105"
              >
                <Plus className="inline-block mr-2" />
                Add Contact
              </button>
            </form>
          </div>

          {/* Emergency Contacts List */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Emergency Contacts</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-500">No emergency contacts added yet.</p>
            ) : (
              <ul className="space-y-3">
                {contacts.map((contact) => (
                  <li
                    key={contact.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded shadow-sm hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-gray-600">{contact.phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => callSingleContact(contact.phone)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Call contact"
                      >
                        <Phone size={20} />
                      </button>
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Remove contact"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;