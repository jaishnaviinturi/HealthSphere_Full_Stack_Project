import React, { useState } from 'react';
import { beds as initialBeds, rooms, patients } from '@/types/BedData';
import { BedCard } from './BedCard';
import { Building2 as Hospital, Filter, PlusCircle } from 'lucide-react';
import { Bed } from '@/types/Bed';

export const Dashboard: React.FC = () => {
  const [beds, setBeds] = useState(initialBeds);
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [showAddBed, setShowAddBed] = useState(false);
  const [newBed, setNewBed] = useState({
    roomNumber: '',
    wardType: 'General'
  });

  const handleAssignBed = (bedId: number) => {
    setBeds(beds.map(bed => 
      bed.id === bedId ? { ...bed, status: 'Occupied', patientId: Date.now() } : bed
    ));
  };

  const handleReleaseBed = (bedId: number) => {
    setBeds(beds.map(bed => 
      bed.id === bedId ? { ...bed, status: 'Under Cleaning', patientId: null } : bed
    ));
  };

  const handleCleanBed = (bedId: number) => {
    setBeds(beds.map(bed => 
      bed.id === bedId ? {
        ...bed,
        status: 'Available',
        lastCleaned: new Date().toISOString()
      } : bed
    ));
  };

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    const newBedEntry: Bed = {
      id: Math.max(...beds.map(b => b.id)) + 1,
      roomNumber: parseInt(newBed.roomNumber),
      wardType: newBed.wardType as 'General' | 'ICU' | 'Private',
      status: 'Available',
      patientId: null,
      lastCleaned: new Date().toISOString()
    };
    setBeds([...beds, newBedEntry]);
    setShowAddBed(false);
    setNewBed({ roomNumber: '', wardType: 'General' });
  };

  const filteredBeds = selectedWard === 'all' 
    ? beds 
    : beds.filter(bed => bed.wardType === selectedWard);

  const stats = {
    total: beds.length,
    available: beds.filter(bed => bed.status === 'Available').length,
    occupied: beds.filter(bed => bed.status === 'Occupied').length,
    cleaning: beds.filter(bed => bed.status === 'Under Cleaning').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
          height: '200px'
        }}
      >
        <div className="h-full bg-black bg-opacity-50 flex items-center px-8">
          <div className="text-white">
            <div className="flex items-center space-x-2">
              <Hospital className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Hospital Bed Management</h1>
            </div>
            <p className="mt-2 text-gray-200">Real-time bed and room availability tracking</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">Total Beds</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Available</p>
              <p className="text-2xl font-bold text-green-800">{stats.available}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-600 text-sm font-medium">Occupied</p>
              <p className="text-2xl font-bold text-red-800">{stats.occupied}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-600 text-sm font-medium">Under Cleaning</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.cleaning}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Filter by Ward:</span>
            </div>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Wards</option>
              <option value="General">General</option>
              <option value="ICU">ICU</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddBed(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Bed
          </button>
        </div>

        {showAddBed && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Bed</h2>
              <form onSubmit={handleAddBed}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number
                  </label>
                  <input
                    type="number"
                    value={newBed.roomNumber}
                    onChange={(e) => setNewBed({ ...newBed, roomNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ward Type
                  </label>
                  <select
                    value={newBed.wardType}
                    onChange={(e) => setNewBed({ ...newBed, wardType: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="General">General</option>
                    <option value="ICU">ICU</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBed(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Bed
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeds.map(bed => (
            <BedCard
              key={bed.id}
              bed={bed}
              onAssign={handleAssignBed}
              onRelease={handleReleaseBed}
              onClean={handleCleanBed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};