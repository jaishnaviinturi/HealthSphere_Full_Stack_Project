import React from 'react';
import { 
  Heart, 
  Home as HomeIcon, 
  Info, 
  Settings, 
  User, 
  Calendar, 
  Activity, 
  Brain, 
  Pill as Pills, 
  Dumbbell, 
  Microscope, 
  Video, 
  Building as Hospital, 
  Shield, 
  Bell, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Chatbot from '@/components/Chatbot';

function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="https://marketplace.canva.com/EAE8fLYOzrA/1/0/1600w/canva-health-care-bO8TgMWVszg.jpg" alt="HealthSphere" className="h-10" />
              <span className="text-2xl font-bold text-blue-600 ml-2">HealthSphere</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="flex items-center text-gray-700 hover:text-blue-600">
                <HomeIcon className="w-4 h-4 mr-1" /> Home
              </button>
              <button onClick={() => scrollToSection('about')} className="flex items-center text-gray-700 hover:text-blue-600">
                <Info className="w-4 h-4 mr-1" /> About Us
              </button>
              <button onClick={() => scrollToSection('features')} className="flex items-center text-gray-700 hover:text-blue-600">
                <Settings className="w-4 h-4 mr-1" /> Features
              </button>
              <button onClick={() => scrollToSection('services')} className="flex items-center text-gray-700 hover:text-blue-600">
                <Heart className="w-4 h-4 mr-1" /> Services
              </button>
              <Link to="/user-selection" className="bg-blue-600 text-white px-6 py-2 rounded-full">
                Login / Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="pt-24 pb-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-16 md:mb-0">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Your All-in-One Healthcare Companion
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Empowering Health, Simplifying Care, and Enhancing Well-being with AI-driven Insights
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/user-selection" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition">
                Get Started
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img src="https://www.shutterstock.com/image-photo/medical-technology-doctor-use-ai-600nw-2304284475.jpg" alt="Healthcare Technology" className="w-full" />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            About HealthSphere
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto">
            HealthSphere is a revolutionary healthcare platform that combines cutting-edge AI technology with comprehensive medical services. Our mission is to make quality healthcare accessible, efficient, and personalized for everyone.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose HealthSphere?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Sections */}
      <div id="services" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UserSection 
              title="For Patients"
              description="Monitor your health, get personalized recommendations, and consult with doctors."
              icon={<User className="w-12 h-12" />}
            />
            <UserSection 
              title="For Doctors"
              description="Manage patients, approve appointments, and provide AI-powered diagnostics."
              icon={<Heart className="w-12 h-12" />}
            />
            <UserSection 
              title="For Hospitals"
              description="Optimize resources, streamline workflows, and enhance hospital efficiency."
              icon={<Hospital className="w-12 h-12" />}
            />
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">HealthSphere</h4>
              <p className="text-gray-400">Your trusted healthcare companion, powered by AI.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white">
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white">
                    Features
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@healthsphere.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Healthcare Ave, Medical District</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 HealthSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Activity className="w-8 h-8" />,
    title: "Disease Prediction & Prevention",
    description: "Advanced AI algorithms to predict and prevent potential health issues."
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Mental Health Support",
    description: "24/7 mental health support with sentiment analysis and professional guidance."
  },
  {
    icon: <Pills className="w-8 h-8" />,
    title: "Medication Management",
    description: "Smart medication tracking and reminders for better adherence."
  },
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: "Fitness & Nutrition",
    description: "Personalized fitness plans and nutrition guidance for optimal health."
  },
  {
    icon: <Microscope className="w-8 h-8" />,
    title: "Medical Image Analysis",
    description: "AI-powered analysis of X-rays, eye scans, skin conditions, and more."
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Video Consultations",
    description: "Seamless video consultations with healthcare professionals."
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Appointment Booking",
    description: "Easy hospital and doctor appointment scheduling system."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Insurance Assistance",
    description: "Simplified health insurance management and claims processing."
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: "Emergency Alert System",
    description: "Quick emergency response system with SOS alerts."
  }
];

function UserSection({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Home;