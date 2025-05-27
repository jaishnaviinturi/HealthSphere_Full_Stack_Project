import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Book Your Medical Appointment Online
          </h1>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              Schedule appointments with top healthcare specialists in your area with just a few clicks.
            </p>
            <p className="text-lg text-gray-600">
              Access video consultations and in-person visits based on your convenience.
            </p>
            <p className="text-lg text-gray-600">
              Choose from a wide network of hospitals and experienced doctors.
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
            <ArrowRight size={20} />
          </button>
        </div>
        <div className="hidden md:block">
          <img
            src="https://www.shutterstock.com/image-vector/book-your-doctor-online-patient-600nw-1776815561.jpg"
            alt="Online Doctor Booking"
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;