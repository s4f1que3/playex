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
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error information only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Response Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
    }
    
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

// TMDB API client with built-in caching
const tmdbCache = new Map();
const TMDB_CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Clear old cache on app load (one-time migration for the cache key fix)
if (typeof window !== 'undefined') {
  const cacheVersion = 'v2-with-params';
  const currentVersion = localStorage.getItem('tmdb_cache_version');
  if (currentVersion !== cacheVersion) {
    tmdbCache.clear();
    localStorage.setItem('tmdb_cache_version', cacheVersion);
    console.log('TMDB cache cleared - updated to version', cacheVersion);
  }
}

export const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'accept': 'application/json',
    'Authorization': undefined,  // Explicitly prevent Authorization header
    'authorization': undefined   // Prevent lowercase version
  },
  timeout: 10000
});

// Add request interceptor to ensure API key is always included
tmdbApi.interceptors.request.use(
  (config) => {
    // CRITICAL: Remove any Authorization header - TMDB v3 API uses api_key parameter only
    if (config.headers.Authorization) {
      delete config.headers.Authorization;
    }
    if (config.headers.authorization) {
      delete config.headers.authorization;
    }
    
    // Get user's selected language from localStorage, default to en-US
    const language = localStorage.getItem('tmdbLanguage') || 'en-US';
    
    // Always include the API key and language in params
    config.params = {
      api_key: '08e475403f00932401951b7995894d17',
      language: language,
      ...config.params
    };
    
    console.log('TMDB API Request:', {
      url: config.url,
      params: config.params,
      headers: config.headers
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add caching interceptor to TMDB API
tmdbApi.interceptors.response.use(
  (response) => {
    // Cache successful GET requests
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}?${new URLSearchParams(response.config.params).toString()}`;
      tmdbCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    console.error('TMDB API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Wrap tmdbApi.get to check cache first
const originalGet = tmdbApi.get.bind(tmdbApi);
tmdbApi.get = function(url, config = {}) {
  // Get user's selected language from localStorage, default to en-US
  const language = localStorage.getItem('tmdbLanguage') || 'en-US';
  
  // Ensure API key and language are always included in params and NO Authorization header
  const mergedConfig = {
    ...config,
    params: {
      api_key: '08e475403f00932401951b7995894d17',
      language: language,
      ...config.params
    },
    headers: {
      ...config.headers,
      Authorization: undefined,  // Explicitly remove Authorization
      authorization: undefined   // Remove lowercase version too
    }
  };
  
  const cacheKey = `${url}?${new URLSearchParams(mergedConfig.params).toString()}`;
  const cached = tmdbCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < TMDB_CACHE_TTL) {
    return Promise.resolve({ data: cached.data, config: mergedConfig, status: 200, statusText: 'OK (cached)' });
  }
  
  return originalGet(url, mergedConfig);
};

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
    // Use cache first
    const cacheKey = `fanFavorites_${mediaType}`;
    const cached = tmdbCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < TMDB_CACHE_TTL) {
      return cached.data;
    }
    
    // Fetch first page to determine pagination
    const firstResponse = await tmdbApi.get(`/account/679f061bac5a7951b9cb5caa/watchlist/${mediaType}`, {
      params: {
        language: 'en-US',
        page: 1,
        sort_by: 'created_at.asc'
      }
    });

    const totalPages = firstResponse.data.total_pages;
    let allResults = [...firstResponse.data.results];

    // Batch remaining pages (max 3 concurrent requests)
    if (totalPages > 1) {
      const batchSize = 3;
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      
      for (let i = 0; i < remainingPages.length; i += batchSize) {
        const batch = remainingPages.slice(i, i + batchSize);
        const pagePromises = batch.map(page =>
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
    }

    // Cache the results
    tmdbCache.set(cacheKey, {
      data: allResults,
      timestamp: Date.now()
    });

    return allResults;
  } catch (error) {
    console.error(`Error fetching ${mediaType} fan favorites:`, error);
    return [];
  }
};

// Add prefetch helper - only prefetch when explicitly called
export const prefetchInitialData = async () => {
  try {
    // Only prefetch if not already cached
    const requiredKeys = ['/movie/popular', '/tv/popular', '/trending/all/day', '/genre/movie/list', '/genre/tv/list'];
    const allCached = requiredKeys.every(key => tmdbCache.has(key));
    
    if (!allCached) {
      const promises = [
        tmdbApi.get('/movie/popular'),
        tmdbApi.get('/tv/popular'),
        tmdbApi.get('/trending/all/day'),
        tmdbApi.get('/genre/movie/list'),
        tmdbApi.get('/genre/tv/list')
      ];
      await Promise.all(promises);
    }
  } catch (error) {
    // Silent fail - prefetch is non-critical
  }
};

// Export helper
export {
  getFanFavorites
};