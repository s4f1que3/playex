// File: frontend/src/utils/api.js
import axios from 'axios';

// Get the API URL from environment variables with fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://playex-backend.onrender.com';

// Log the API URL for debugging
console.log('API connecting to:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to dynamically set token for each request
api.interceptors.request.use(
  (config) => {
    // Get the current token for every request (will grab the most recent token)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    if (error.response && error.response.status === 401) {
      // Token expired or invalid, log the user out
      console.log('Authentication error - logging out user');
      localStorage.removeItem('token');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authApi = {
  register: (username, email, password) => {
    console.log('Registering user with API...');
    return api.post('/api/auth/register', { username, email, password });
  },
  
  login: (email, password) => {
    console.log('Logging in user with API...');
    return api.post('/api/auth/login', { email, password });
  },
  
  getCurrentUser: () => {
    return api.get('/api/auth/me');
  },
  
  resetPassword: (email, newPassword) => {
    return api.post('/api/auth/reset-password', { email, newPassword });
  }
};

// TMDB API client
export const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '879a60fbe7c4e5877279cae559d9cf5c'
  }
});

// Helper functions for common TMDB API calls
export const tmdbHelpers = {
  // Get image URL
  getImageUrl: (path, size = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
  
  // Format runtime
  formatRuntime: (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  },
  
  // Format release date
  formatReleaseDate: (date) => {
    if (!date) return 'N/A';
    return new Date(date).getFullYear();
  },
  
  // Get media tag
  getMediaTag: (mediaType, releaseYear, runtime, seasons = null, episodes = null) => {
    if (mediaType === 'movie') {
      return `${releaseYear} ${runtime} Movie`;
    } else if (mediaType === 'tv' && seasons && episodes) {
      return `ssn ${seasons} ep ${episodes} TV`;
    }
    return mediaType === 'movie' ? 'Movie' : 'TV Show';
  }
};