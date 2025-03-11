import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../utils/api';

// Create context
const AuthContext = createContext();

// API URL for logging purposes only
const API_URL = process.env.REACT_APP_API_URL || 'https://playex-backend.onrender.com';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          console.log('Loading current user data...');
          const { data } = await authApi.getCurrentUser();
          setCurrentUser(data.user);
          console.log('User data loaded successfully');
        } catch (error) {
          console.error('Error loading user:', error.response?.data?.message || error.message);
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);
  
  // Register function
  const register = async (username, email, password) => {
    try {
      console.log(`Registering user with API: ${API_URL}/api/auth/register`);
      
      const { data } = await authApi.register(username, email, password);
      
      console.log('Registration successful');
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      console.log(`Logging in with API: ${API_URL}/api/auth/login`);
      
      const { data } = await authApi.login(email, password);
      
      console.log('Login successful');
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };
  
  // Reset password function
  const resetPassword = async (email, newPassword) => {
    try {
      console.log(`Resetting password for: ${email}`);
      const { data } = await authApi.resetPassword(email, newPassword);
      console.log('Password reset successful');
      return data;
    } catch (error) {
      console.error('Password reset error:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated: !!currentUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};