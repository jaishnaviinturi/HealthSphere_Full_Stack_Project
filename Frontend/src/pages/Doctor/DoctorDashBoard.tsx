import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: "Patient Appointments",
    description: "Schedule and manage your medical appointments with ease. Get instant confirmations and reminders.",
    image: "https://www.bookingpressplugin.com/wp-content/uploads/2023/12/Steps-to-Create-a-Patient-Appointment-Scheduling-System-Banner.webp",
    path: "/doctor/appointments",
  },
  {
    title: "E-Prescription",
    description: "Access your prescriptions digitally and get medications delivered to your doorstep.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVCCZyfbZ8CAC7EoJlqIlspS-UhX75nr50PA&s",
    path: "/doctor/eprescription",
  },
  {
    title: "Patient Records",
    description: "Securely store and access your medical history, test results, and health documents.",
    image: "https://5.imimg.com/data5/SELLER/Default/2022/2/NC/OR/OT/2911803/electronic-medical-records-services.jpg",
    path: "/doctor/patientrecords",
  },
  {
    title: "Image/X-Ray Based Disease Prediction",
    description: "Upload medical images and X-rays for AI-assisted diagnosis and analysis",
    image: "https://canhealthnetwork.ca/wp-content/uploads/2024/10/VCH-CFI-768x432.png",
    path: "/doctor/xrayprediction",
  },
];

const Doctor: React.FC = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    navigate('/login/doctor');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: "url('https://media.istockphoto.com/id/1254842513/vector/dna-digital-sequence-code-structure-with-glow-science-concept-and-nano-technology-background.jpg?s=612x612&w=0&k=20&c=3bnYURL84y-u6PQn21kt3EN2giWgZVuYvGsh59hdGU0=')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header */}
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
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
                alt="Home Icon"
                className="h-5 w-5 mr-1"
              />
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1087/1087840.png"
                alt="Features Icon"
                className="h-5 w-5 mr-1"
              />
              Features
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828471.png"
                alt="Logout Icon"
                className="h-5 w-5 mr-1"
              />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div id="home" className="relative bg-white/10 overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to Your</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Doctor Dashboard</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Manage your patients with ease using our AI-powered tools. Access patient records, prescribe medications, and more.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:right-40 lg:top-40 lg:w-1/4 lg:scale-125">
          <img
            className="h-48 w-full object-cover lg:w-full lg:h-64"
            src="https://img.freepik.com/premium-photo/doctor-online-virtual-hospital-concept-diagnostics-online-medical-consultation-smartphone_662214-395958.jpg?w=360"
            alt="Doctor Portal Banner"
          />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-white/80 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your Doctor Tools
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              Access all your patient management tools in one place
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => handleFeatureClick(feature.path)}
              >
                <div className="relative h-48">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-opacity" />
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;