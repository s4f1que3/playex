// File: frontend/src/utils/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, log the user out
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
