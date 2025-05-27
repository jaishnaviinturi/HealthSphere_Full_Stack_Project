import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const { userType } = useParams<{ userType: 'patient' | 'hospital' | 'doctor' }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = {
        patient: '/patients/login',
        hospital: '/hospitals/login',
        doctor: '/doctors/login',
      }[userType!];

      console.log('Logging in with:', { email, password, endpoint });
      const response = await axios.post<{ token: string; hospitalId?: string; patientId?: string; doctorId?: string }>(
        `https://healthsphere-yfr0.onrender.com${endpoint}`,
        { email, password }
      );

      console.log('Login response:', response.data);

      // Store the token and userType
      localStorage.setItem(`${userType}Token`, response.data.token);
      localStorage.setItem('userType', userType!);

      // Store user-specific ID based on userType
      if (userType === 'hospital' && response.data.hospitalId) {
        localStorage.setItem('hospitalId', response.data.hospitalId);
      } else if (userType === 'patient' && response.data.patientId) {
        localStorage.setItem('patientId', response.data.patientId);
      } else if (userType === 'doctor' && response.data.doctorId) {
        localStorage.setItem('doctorId', response.data.doctorId);
      }

      console.log(`${userType} login success:`, {
        token: response.data.token,
        patientId: response.data.patientId,
        hospitalId: response.data.hospitalId,
      });
      navigate(`/${userType}-dashboard`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password for:', email);
  };

  const showSignupLink = userType === 'patient';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/blue-curve-background_53876-113112.jpg)' }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-8">
          <Link to="/user-selection" className="text-blue-600 hover:text-blue-700 mb-6 flex items-center">
            ← Back to user selection
          </Link>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back!</h2>
            <p className="text-gray-600 mb-6">
              Sign in to your {userType} account
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700"
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {showSignupLink && (
              <p className="text-center mt-6 text-gray-600">
                No account?{' '}
                <Link to="/signup/patient" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign Up
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;