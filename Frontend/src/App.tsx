import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import UserSelection from '@/components/UserSelection';
import Patient from './pages/Patient/Patient';
import Login from '@/pages/Login';
import PatientRegister from '@/components/PatientRegister';
import SymptomPrediction from '@/pages/Patient/SymptomPrediction';
import XRayPrediction from '@/pages/Patient/XRayPrediction';
import Fitness from '@/pages/Patient/Fitness';
import Chatbot from '@/pages/Patient/chatbot';
import Reports from '@/pages/Patient/Report_Analysis';
import PillIdentification from '@/pages/Patient/Pill_Identification';
import PillReminders from '@/pages/Patient/PillRemainder';
import HealthTracking from '@/pages/Patient/Patient_Record';
import Emergency from '@/pages/Patient/SOS';
import Insurance from '@/pages/Patient/Insurance';
import ProtectedRoute from '@/components/ProtectedRoute';
import PatientHistory from '@/pages/Patient/AppointmentBooking/PatientHistory';
import AppointmentBookingPage from '@/pages/Patient/AppointmentBooking/AppointmentBookingPage';

import HospitalDashboard from '@/pages/Hospital/HospitalDashboard';
import AppointmentRequests from '@/pages/Hospital/AppointmentRequests';
import BedManagement from '@/pages/Hospital/BedManagement';
import StockManagement from '@/pages/Hospital/StockManagement';
import StaffManagement from '@/pages/Hospital/StaffManagement';
import AddDoctorForm from '@/pages/Hospital/AddDoctorForm';

import DoctorDashboard from '@/pages/Doctor/DoctorDashBoard';
import Appointments from '@/pages/Doctor/Appointments';
import EPrescription from '@/pages/Doctor/EPrescription';
import PatientRecords from '@/pages/Doctor/PatientRecords';
import DoctorXRayPrediction from '@/pages/Patient/XRayPrediction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-selection" element={<UserSelection />} />
        <Route path="/login/:userType" element={<Login />} />
        <Route path="/signup/patient" element={<PatientRegister />} />
        <Route path="/patient-dashboard" element={<ProtectedRoute><Patient /></ProtectedRoute>} />
        <Route path="/patient/symptom-prediction" element={<ProtectedRoute><SymptomPrediction /></ProtectedRoute>} />
        <Route path="/patient/xray-prediction" element={<ProtectedRoute><XRayPrediction /></ProtectedRoute>} />
        <Route path="/patient/fitness" element={<ProtectedRoute><Fitness /></ProtectedRoute>} />
        <Route path="/patient/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/patient/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/patient/pill-identification" element={<ProtectedRoute><PillIdentification /></ProtectedRoute>} />
        <Route path="/patient/pill-reminders" element={<ProtectedRoute><PillReminders /></ProtectedRoute>} />
        <Route path="/patient/health-tracking" element={<ProtectedRoute><HealthTracking /></ProtectedRoute>} />
        <Route path="/patient/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
        <Route path="/patient/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />

        <Route path="/patient/appointments" element={<ProtectedRoute><AppointmentBookingPage /></ProtectedRoute>}>
          <Route path="specialties/:specialty" element={<AppointmentBookingPage />} />
          <Route path="specialties/:specialty/hospitals/:hospitalId" element={<AppointmentBookingPage />} />
          <Route path="specialties/:specialty/hospitals/:hospitalId/doctors" element={<AppointmentBookingPage />} />
          <Route path="specialties/:specialty/hospitals/:hospitalId/doctors/:doctorId" element={<AppointmentBookingPage />} />
          <Route path="specialties/:specialty/hospitals/:hospitalId/doctors/:doctorId/booking" element={<AppointmentBookingPage />} />
          <Route path="hospitals/:hospitalId" element={<AppointmentBookingPage />} />
          <Route path="hospitals/:hospitalId/specialties/:specialty" element={<AppointmentBookingPage />} />
          <Route path="hospitals/:hospitalId/specialties/:specialty/doctors" element={<AppointmentBookingPage />} />
          <Route path="hospitals/:hospitalId/specialties/:specialty/doctors/:doctorId" element={<AppointmentBookingPage />} />
          <Route path="hospitals/:hospitalId/specialties/:specialty/doctors/:doctorId/booking" element={<AppointmentBookingPage />} />
          <Route path="history" element={<ProtectedRoute><PatientHistory /></ProtectedRoute>} /> {/* New route for history */}
        </Route>

        <Route path="/hospital-dashboard" element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} />
        <Route path="/hospital/appointment-requests" element={<ProtectedRoute><AppointmentRequests /></ProtectedRoute>} />
        <Route path="/hospital/bed-management" element={<ProtectedRoute><BedManagement /></ProtectedRoute>} />
        <Route path="/hospital/stock-management" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />
        <Route path="/hospital/staff-management" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
        <Route path="/hospital/staff-management/add-doctor" element={<ProtectedRoute><AddDoctorForm /></ProtectedRoute>} />

        <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/doctor/eprescription" element={<ProtectedRoute><EPrescription /></ProtectedRoute>} />
        <Route path="/doctor/patientrecords" element={<ProtectedRoute><PatientRecords /></ProtectedRoute>} />
        <Route path="/doctor/xrayprediction" element={<ProtectedRoute><DoctorXRayPrediction /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;