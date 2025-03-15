// File: frontend/src/utils/api.js
import axios from 'axios';
import { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from './LocalStorage';

// Get the API URL from environment variables with fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://playex-backend.onrender.com';

// Log the API URL for debugging
console.log('API connecting to:', API_URL);

// Create the axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to dynamically set token for each request
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
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

// Create a wrapper that intercepts specific API calls and redirects to localStorage
export const api = {
  get: async (url, config) => {
    // Handle favorites endpoint
    if (url === '/api/user-media/favorites') {
      return { data: getFavorites() };
    }
    
    // Handle watchlist endpoint
    if (url === '/api/user-media/watchlist') {
      return { data: getWatchlist() };
    }
    
    // For all other endpoints, use axios
    return axiosInstance.get(url, config);
  },
  
  post: async (url, data, config) => {
    // Handle favorites endpoint
    if (url === '/api/user-media/favorites') {
      const { mediaId, mediaType, details } = data;
      const result = addToFavorites(mediaId, mediaType, details || {});
      return { data: result };
    }
    
    // Handle watchlist endpoint
    if (url === '/api/user-media/watchlist') {
      const { mediaId, mediaType, details } = data;
      const result = addToWatchlist(mediaId, mediaType, details || {});
      return { data: result };
    }
    
    // For all other endpoints, use axios
    return axiosInstance.post(url, data, config);
  },
  
  delete: async (url, config) => {
    // Handle favorites endpoint
    if (url.startsWith('/api/user-media/favorites/')) {
      const parts = url.split('/');
      const mediaType = parts[parts.length - 2];
      const mediaId = parts[parts.length - 1];
      const result = removeFromFavorites(mediaId, mediaType);
      return { data: result };
    }
    
    // Handle watchlist endpoint
    if (url.startsWith('/api/user-media/watchlist/')) {
      const parts = url.split('/');
      const mediaType = parts[parts.length - 2];
      const mediaId = parts[parts.length - 1];
      const result = removeFromWatchlist(mediaId, mediaType);
      return { data: result };
    }
    
    // For all other endpoints, use axios
    return axiosInstance.delete(url, config);
  },
  
  // Add other methods as needed
  put: (url, data, config) => axiosInstance.put(url, data, config),
  patch: (url, data, config) => axiosInstance.patch(url, data, config),
  
  // Add direct access to interceptors for compatibility
  interceptors: {
    request: axiosInstance.interceptors.request,
    response: axiosInstance.interceptors.response
  }
};

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
  getMediaTag: (mediaType, releaseYear, runtime, seasons = null, episodes = null, lastSeasonEpisodes = null) => {
    const tags = [];
    
    if (releaseYear) {
      tags.push(releaseYear.toString());
    }
    
    if (mediaType === 'movie') {
      if (runtime) tags.push(runtime);
      tags.push('Movie');
    } 
    else if (mediaType === 'tv') {
      if (seasons) {
        tags.push(`${seasons} Season(s)`);
      }
      tags.push('TV');
    }
    
    return tags;
  }
};