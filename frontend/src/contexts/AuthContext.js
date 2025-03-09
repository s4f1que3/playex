/* File: frontend/src/contexts/AuthContext.js */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from local storage on initial render
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/auth/me');
          setCurrentUser(response.data.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      // Store token and set user
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setCurrentUser(response.data.user);
      setError(null);
      
      return response.data.user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { username, email, password });
      
      // Store token and set user
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setCurrentUser(response.data.user);
      setError(null);
      
      return response.data.user;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/api/users/profile', userData);
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/api/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password');
      throw error;
    }
  };

  // Reset password (for forgotten passwords)
  const resetPassword = async (email, newPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', {
        email,
        newPassword
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
      throw error;
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      await api.delete('/api/users');
      logout();
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete account');
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};