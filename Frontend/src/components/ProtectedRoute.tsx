import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // Determine the user type based on the path
  let userType: 'patient' | 'hospital' | 'doctor' = 'patient'; // Default to 'patient'

  // Check for the primary route segment to determine user type
  if (path.startsWith('/hospital')) {
    userType = 'hospital';
  } else if (path.startsWith('/doctor')) {
    userType = 'doctor';
  }

  // Check for the appropriate token and userType in localStorage
  const token = localStorage.getItem(`${userType}Token`);
  const storedUserType = localStorage.getItem('userType');

  if (!token || storedUserType !== userType) {
    // Redirect to the appropriate login page if not authenticated
    return <Navigate to={`/login/${userType}`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;