export interface Bed {
    id: number;
    roomNumber: number;
    wardType: 'General' | 'ICU' | 'Private';
    status: 'Available' | 'Occupied' | 'Reserved' | 'Under Cleaning';
    patientId: number | null;
    lastCleaned: string;
  }
  
  export interface Room {
    roomNumber: number;
    wardType: 'General' | 'ICU' | 'Private';
    totalBeds: number;
    occupiedBeds: number;
  }
  
  export interface Patient {
    id: number;
    name: string;
    age: number;
    admissionDate: string;
    bedId: number | null;
  }