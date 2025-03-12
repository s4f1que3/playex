// File: frontend/src/utils/LocalStorage.js

const WATCHLIST_KEY = 'user_watchlist';

// Get watchlist from localStorage
export const getWatchlist = () => {
  try {
    const watchlist = localStorage.getItem(WATCHLIST_KEY);
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

// Add item to watchlist
export const addToWatchlist = (mediaId, mediaType, details) => {
  try {
    const watchlist = getWatchlist();
    
    // Check if item already exists in watchlist
    const existingIndex = watchlist.findIndex(
      item => item.media_id === mediaId && item.media_type === mediaType
    );
    
    // If item doesn't exist, add it
    if (existingIndex === -1) {
      const newWatchlist = [
        ...watchlist,
        {
          media_id: mediaId,
          media_type: mediaType,
          added_at: new Date().toISOString(),
          details
        }
      ];
      
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

// Remove item from watchlist
export const removeFromWatchlist = (mediaId, mediaType) => {
  try {
    const watchlist = getWatchlist();
    
    const newWatchlist = watchlist.filter(
      item => !(item.media_id === mediaId && item.media_type === mediaType)
    );
    
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

// Check if item is in watchlist
export const isInWatchlist = (mediaId, mediaType) => {
  try {
    const watchlist = getWatchlist();
    return watchlist.some(
      item => item.media_id === mediaId && item.media_type === mediaType
    );
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

// Clear entire watchlist
export const clearWatchlist = () => {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing watchlist:', error);
    return false;
  }
};

// Clear selected items from watchlist
export const clearSelectedItems = (selectedKeys) => {
  try {
    const watchlist = getWatchlist();
    
    // Log for debugging
    console.log('Selected keys to remove:', selectedKeys);
    
    const newWatchlist = watchlist.filter(item => {
      const itemKey = `${item.media_type}-${item.media_id}`;
      // Check if this item's key is NOT in the selectedKeys array
      const shouldKeep = !selectedKeys.includes(itemKey);
      return shouldKeep;
    });
    
    // Log for debugging
    console.log('Original watchlist length:', watchlist.length);
    console.log('New watchlist length:', newWatchlist.length);
    
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
    return true;
  } catch (error) {
    console.error('Error clearing selected items:', error);
    return false;
  }
};