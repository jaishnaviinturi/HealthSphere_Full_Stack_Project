import { Bed, Room, Patient } from '@/types/Bed';

export const beds: Bed[] = [
  {
    id: 1,
    roomNumber: 101,
    wardType: 'General',
    status: 'Available',
    patientId: null,
    lastCleaned: '2024-03-10T10:00:00Z'
  },
  {
    id: 2,
    roomNumber: 101,
    wardType: 'General',
    status: 'Occupied',
    patientId: 1,
    lastCleaned: '2024-03-09T15:30:00Z'
  },
  {
    id: 3,
    roomNumber: 102,
    wardType: 'ICU',
    status: 'Available',
    patientId: null,
    lastCleaned: '2024-03-10T09:15:00Z'
  },
  {
    id: 4,
    roomNumber: 103,
    wardType: 'Private',
    status: 'Reserved',
    patientId: null,
    lastCleaned: '2024-03-10T08:45:00Z'
  }
];

export const rooms: Room[] = [
  {
    roomNumber: 101,
    wardType: 'General',
    totalBeds: 2,
    occupiedBeds: 1
  },
  {
    roomNumber: 102,
    wardType: 'ICU',
    totalBeds: 1,
    occupiedBeds: 0
  },
  {
    roomNumber: 103,
    wardType: 'Private',
    totalBeds: 1,
    occupiedBeds: 0
  }
];

export const patients: Patient[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    admissionDate: '2024-03-09T15:30:00Z',
    bedId: 2
  }
];