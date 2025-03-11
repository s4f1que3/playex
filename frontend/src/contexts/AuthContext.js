// File: frontend/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modified to always provide a non-null user for localStorage usage
  const localStorageUser = {
    id: 'local-user',
    email: 'local@example.com',
    name: 'Local User',
    isLocalStorage: true
  };
  
  useEffect(() => {
    // Check if real authentication is available from local storage
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedUser) {
      // If there's a real logged-in user, use that
      setCurrentUser(JSON.parse(storedUser));
    } else {
      // Otherwise, use our fake local user
      setCurrentUser(localStorageUser);
    }
    
    setLoading(false);
  }, []);
  
  // Auth methods - preserve your existing ones but modify as needed
  const login = async (email, password) => {
    // Keep your existing login implementation
    // But if login fails, you can still allow access with local storage
  };
  
  const logout = async () => {
    // Clear user but keep localStorage data
    localStorage.removeItem('auth_user');
    setCurrentUser(localStorageUser);
  };
  
  const signup = async (userData) => {
    // Keep your existing signup implementation
    // But if signup fails, you can still allow access with local storage
  };
  
  // Value object to provide through context
  const value = {
    currentUser,
    login,
    logout,
    signup,
    isAuthenticated: !!currentUser,
    // Add a flag to indicate if using real auth or localStorage
    isUsingLocalStorage: currentUser ? currentUser.isLocalStorage === true : true
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};