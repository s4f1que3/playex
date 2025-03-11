// File: frontend/src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Modified to always allow access when using localStorage
const ProtectedRoute = () => {
  const { currentUser, isUsingLocalStorage } = useAuth();
  
  // If using localStorage or authenticated, allow access
  if (isUsingLocalStorage || currentUser) {
    return <Outlet />;
  }
  
  // Otherwise, redirect to login
  return <Navigate to="/login" />;
};

export default ProtectedRoute;