import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// API URL - update this to your actual backend URL
const API_URL = process.env.REACT_APP_API_URL || 'https://playex-backend.onrender.com';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Initialize axios with token if available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await axios.get(`${API_URL}/api/auth/me`);
          setCurrentUser(data.user);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, [token]);
  
  // Register function
  const register = async (username, email, password) => {
    try {
      console.log(`Registering user with API: ${API_URL}/api/auth/register`);
      
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password
      });
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      console.log(`Logging in with API: ${API_URL}/api/auth/login`);
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.status);
      
      const { data } = response;
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };
  
  // Reset password function
  const resetPassword = async (email, newPassword) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email,
        newPassword
      });
      
      return data;
    } catch (error) {
      console.error('Password reset error:', error);
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