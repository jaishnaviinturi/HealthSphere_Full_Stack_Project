import React from 'react';
import { Bed } from '@/types/Bed';
import { BedIcon, User2, Trash2, RefreshCw } from 'lucide-react';

interface BedCardProps {
  bed: Bed;
  onAssign: (bedId: number) => void;
  onRelease: (bedId: number) => void;
  onClean: (bedId: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800';
    case 'Occupied':
      return 'bg-red-100 text-red-800';
    case 'Reserved':
      return 'bg-yellow-100 text-yellow-800';
    case 'Under Cleaning':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const BedCard: React.FC<BedCardProps> = ({ bed, onAssign, onRelease, onClean }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <BedIcon className="w-5 h-5 text-gray-600" />
          <span className="font-semibold">Bed #{bed.id}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bed.status)}`}>
          {bed.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>Room: {bed.roomNumber}</p>
        <p>Ward: {bed.wardType}</p>
        <p>Last Cleaned: {new Date(bed.lastCleaned).toLocaleString()}</p>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        {bed.status === 'Available' && (
          <button
            onClick={() => onAssign(bed.id)}
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <User2 className="w-4 h-4 mr-1" />
            Assign
          </button>
        )}
        {bed.status === 'Occupied' && (
          <button
            onClick={() => onRelease(bed.id)}
            className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Release
          </button>
        )}
        {(bed.status === 'Available' || bed.status === 'Reserved' || bed.status === 'Under Cleaning') && (
          <button
            onClick={() => onClean(bed.id)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Clean
          </button>
        )}
      </div>
    </div>
  );
};