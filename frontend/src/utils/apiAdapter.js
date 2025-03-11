import { 
    getFavorites, 
    addToFavorites, 
    removeFromFavorites, 
    isInFavorites,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  } from './LocalStorage';
  
  // This adapter intercepts API calls and redirects them to localStorage
  export const createLocalStorageAdapter = (originalApi) => {
    // Create a proxy that intercepts API calls
    const apiAdapter = {
      get: async (url) => {
        // Handle favorites endpoint
        if (url === '/api/user-media/favorites') {
          return { data: getFavorites() };
        }
        
        // Handle watchlist endpoint
        if (url === '/api/user-media/watchlist') {
          return { data: getWatchlist() };
        }
        
        // For all other endpoints, use the original API
        return originalApi.get(url);
      },
      
      post: async (url, data) => {
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
        
        // For all other endpoints, use the original API
        return originalApi.post(url, data);
      },
      
      delete: async (url) => {
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
        
        // For all other endpoints, use the original API
        return originalApi.delete(url);
      }
    };
    
    return apiAdapter;
  };