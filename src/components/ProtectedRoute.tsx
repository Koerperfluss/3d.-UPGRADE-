
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User, Lecturer, UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  user: User | null;
  lecturer: Lecturer | null;
  allowedRoles?: UserRole[];
  requireLecturer?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  user, 
  lecturer, 
  allowedRoles, 
  requireLecturer = false 
}) => {
  const location = useLocation();

  // If lecturer is required, check for lecturer
  if (requireLecturer) {
    if (!lecturer) {
      return <Navigate to="/dozenten-login" state={{ from: location, message: 'Bitte loggen Sie sich als Dozent ein.' }} replace />;
    }
    return <>{children}</>;
  }

  // If no user is logged in, redirect to login
  if (!user && !lecturer) {
    return <Navigate to="/login" state={{ from: location, message: 'Bitte loggen Sie sich ein.' }} replace />;
  }

  // If specific roles are allowed, check user role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user is not allowed, redirect to dashboard or home
    return <Navigate to="/dashboard" state={{ message: 'Sie haben keine Berechtigung für diesen Bereich.' }} replace />;
  }

  return <>{children}</>;
};
