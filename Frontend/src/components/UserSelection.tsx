import React from 'react';
import { Link } from 'react-router-dom';

function UserSelection() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/blue-curve-background_53876-113112.jpg)' }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">HealthSphere</h1>
        <p className="text-gray-600 text-center mb-8">Select your user type to continue</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/login/patient"
            className="flex flex-col items-center p-6 rounded-xl hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-200 bg-white"
          >
            <img 
              src="https://media.istockphoto.com/id/1097493802/vector/patient-icon-customer-icon-with-add-additional-sign-patient-icon-and-new-plus-positive.jpg?s=612x612&w=0&k=20&c=IrugHP6i-oobykGTLg7kCHP-SPENaDFxhQKAIdM9XuI=" 
              alt="Patient"
              className="w-32 h-32 mb-3 object-contain"
            />
            <span className="text-lg font-medium">Patient</span>
          </Link>
          <Link
            to="/login/hospital"
            className="flex flex-col items-center p-6 rounded-xl hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-200 bg-white"
          >
            <img 
              src="https://png.pngtree.com/png-clipart/20200701/original/pngtree-hospital-png-image_5436138.jpg" 
              alt="Hospital"
              className="w-32 h-32 mb-3 object-contain"
            />
            <span className="text-lg font-medium">Hospital</span>
          </Link>
          <Link
            to="/login/doctor"
            className="flex flex-col items-center p-6 rounded-xl hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-200 bg-white"
          >
            <img 
              src="https://img.freepik.com/premium-vector/doctor-icon-with-stethoscope-nurse-logo-medical-health-care-hospital-patient-examination_1234944-1596.jpg" 
              alt="Doctor"
              className="w-32 h-32 mb-3 object-contain"
            />
            <span className="text-lg font-medium">Doctor</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserSelection;