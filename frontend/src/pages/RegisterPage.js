// File: frontend/src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { username, email, password, confirmPassword } = formData;
    
    // Validate form
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await register(username, email, password);
      
      // Redirect to home page after successful registration
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161616] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center">
            <img src="/logo.png" alt="Playex" className="h-12" />
            <span className="ml-2 text-3xl font-bold text-[#82BC87]">Playex</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create a new account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Or{' '}
            <Link to="/login" className="font-medium text-[#82BC87] hover:text-[#E4D981]">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="mt-8 bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Choose a username"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Create a password (min. 8 characters)"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <p className="text-xs text-gray-400">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-[#82BC87] hover:text-[#E4D981]">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#82BC87] hover:text-[#E4D981]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;