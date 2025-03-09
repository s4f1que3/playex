// File: frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await login(email, password);
      
      // Redirect to the page the user was trying to access, or home if not applicable
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to sign in');
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
          <h2 className="mt-6 text-3xl font-extrabold text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Or{' '}
            <Link to="/register" className="font-medium text-[#82BC87] hover:text-[#E4D981]">
              create a new account
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-[#82BC87] focus:ring-[#82BC87]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-[#82BC87] hover:text-[#E4D981]">
                  Forgot your password?
                </Link>
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
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;






