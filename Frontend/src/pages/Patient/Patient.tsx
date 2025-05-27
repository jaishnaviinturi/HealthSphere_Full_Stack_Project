import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: "Symptom Based Disease Prediction",
    description: "Advanced AI-powered system to predict potential health conditions based on your symptoms",
    image: "https://media.npr.org/assets/img/2020/05/05/gettyimages-1216219034_custom-353b9c86562b231091fe597f9415706c9c66ad43.jpg",
    path: "/patient/symptom-prediction"
  },
  {
    title: "Image/X-Ray Based Disease Prediction",
    description: "Upload medical images and X-rays for AI-assisted diagnosis and analysis",
    image: "https://canhealthnetwork.ca/wp-content/uploads/2024/10/VCH-CFI-768x432.png",
    path: "/patient/xray-prediction"
  },
  {
    title: "Appointment Booking",
    description: "Seamlessly schedule appointments with healthcare providers",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuyp0o1YaEyP2boFnPRCpCogMPJ8myVY2u1g&s",
    path: "/patient/appointments"
  },
  {
    title: "Fitness & Workout Recommendation",
    description: "Personalized fitness plans and workout recommendations based on your health profile",
    image: "https://ut-dms-prod-uthealth-s3-bucket.s3.amazonaws.com/banners/_1200x630_crop_center-center_82_none/Blog_social_thumb_diet.jpg?mtime=1603475060",
    path: "/patient/fitness"
  },
  {
    title: "Chatbot for Medical Health & Queries",
    description: "24/7 AI-powered medical assistant for instant health-related queries",
    image: "https://img.freepik.com/free-vector/chat-bot-concept-illustration_114360-5522.jpg",
    path: "/patient/chatbot"
  },
  {
    title: "Report Analysis",
    description: "Comprehensive analysis and interpretation of your medical reports",
    image: "https://www.similarweb.com/blog/wp-content/uploads/2022/03/BLOG-competitive-analysis-report-THUMBNAIL.png",
    path: "/patient/reports"
  },
  {
    title: "Pill Identification",
    description: "Quick and accurate identification of medications using image recognition",
    image: "https://img.freepik.com/free-photo/pills-tablets-medicine_1339-2254.jpg",
    path: "/patient/pill-identification"
  },
  {
    title: "Pill Remainders",
    description: "Never miss your medications with smart reminders and scheduling",
    image: "https://image.inblog.dev/?url=https%3A%2F%2Ffgobbnslcbjgothosvni.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fimages%2Ffeatured_image%2F2023-12-22T04%3A24%3A08.428Z-e301e664-d115-4f10-ba68-5def660fee1d&w=2048&q=75",
    path: "/patient/pill-reminders"
  },
  {
    title: "Patient Health Tracking",
    description: "Monitor your vital signs and health metrics in real-time",
    image: "https://image.freepik.com/free-vector/patient-doctor-medical-healthcare-tracking_82574-8073.jpg",
    path: "/patient/health-tracking"
  },
  {
    title: "Emergency Features (SOS)",
    description: "Quick access to emergency services and instant alert to emergency contacts",
    image: "https://images.deccanherald.com/deccanherald/2024-08-21/ux6duco0/SOS%20feature%20on%20Pixel%209.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true",
    path: "/patient/emergency"
  },
  {
    title: "Insurance",
    description: "Comprehensive health insurance plans tailored for your needs",
    image: "https://mysuccessproject.in/wp-content/uploads/2023/03/Health-insurance-min_0.jpg",
    path: "/patient/insurance"
  }

];

const Patient = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    navigate('/login/patient');
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
        backgroundImage: `url('https://www.shutterstock.com/image-photo/doctors-hands-gloves-holding-mans-260nw-1701905974.jpg')`,
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
                  <span className="block text-indigo-600 xl:inline">Patient Dashboard</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Manage your health with ease using our AI-powered tools. Access personalized care, track your health, and more.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:right-40 lg:top-40 lg:w-1/4 lg:scale-125">
          <img
            className="h-48 w-full object-cover lg:w-full lg:h-64"
            src="https://topflightapps.com/wp-content/uploads/2022/05/patient-portal-app-development-main-banner.png"
            alt="Patient Portal Banner"
          />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-white/80 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your Healthcare Tools
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              Access all your health management tools in one place
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

export default Patient;