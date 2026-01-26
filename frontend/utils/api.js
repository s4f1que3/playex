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

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

// Update API URL configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'https://playex-backend.vercel.app'
    : 'http://localhost:5000'
);

// Remove any cached values that might be using the old URL
safeLocalStorage.removeItem('api_url');

// Add more detailed logging
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', API_URL);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Log the API URL for debugging
console.log('API connecting to:', API_URL);

// Create the axios instance with updated baseURL
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add a request interceptor to dynamically set token for each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the current token for every request (will grab the most recent token)
    const token = safeLocalStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, log the user out
      console.log('Authentication error - logging out user');
      safeLocalStorage.removeItem('token');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Add these genre IDs if they don't exist
export const movieGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

export const tvGenres = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' }
];

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

// TMDB API client
export const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'accept': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzlhNjBmYmU3YzRlNTg3NzI3OWNhZTU1OWQ5Y2Y1YyIsIm5iZiI6MTczODQ3NTAzNS4xOTcsInN1YiI6IjY3OWYwNjFiYWM1YTc5NTFiOWNiNWNhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w0q9fpYLs93YSUdkNENpaR3kWjfk27kFhQj6ypEkrzE'
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

const getFanFavorites = async (mediaType = 'tv') => {
  try {
    // First fetch to get total pages
    const firstResponse = await tmdbApi.get(`/account/679f061bac5a7951b9cb5caa/watchlist/${mediaType}`, {
      params: {
        language: 'en-US',
        page: 1,
        sort_by: 'created_at.asc'
      }
    });

    const totalPages = firstResponse.data.total_pages;
    let allResults = [...firstResponse.data.results];

    // Fetch remaining pages if any
    if (totalPages > 1) {
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const pagePromises = remainingPages.map(page =>
        tmdbApi.get(`/account/679f061bac5a7951b9cb5caa/watchlist/${mediaType}`, {
          params: {
            language: 'en-US',
            page: page,
            sort_by: 'created_at.asc'
          }
        })
      );

      const responses = await Promise.all(pagePromises);
      const additionalResults = responses.flatMap(response => response.data.results);
      allResults = [...allResults, ...additionalResults];
    }

    return allResults;
  } catch (error) {
    console.error(`Error fetching ${mediaType} fan favorites:`, error);
    return [];
  }
};

// Add to exports
export {
  getFanFavorites
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  }
});

// Add response interceptor for both instances
[api, tmdbApi].forEach(instance => {
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
      }
      return Promise.reject(error);
    }
  );
});

export { api, tmdbApi };