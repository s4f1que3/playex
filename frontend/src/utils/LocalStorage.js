// File: frontend/src/utils/localStorage.js

// Storage keys
const FAVORITES_KEY = 'user_favorites';
const WATCHLIST_KEY = 'user_watchlist';
const PROGRESS_KEY = 'user_watch_progress';

// Favorites helper functions
export const getFavorites = () => {
  const favoritesData = localStorage.getItem(FAVORITES_KEY);
  return favoritesData ? JSON.parse(favoritesData) : [];
};

export const addToFavorites = (mediaId, mediaType, details) => {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(
    item => item.media_id === mediaId && item.media_type === mediaType
  );
  
  const newItem = {
    media_id: mediaId,
    media_type: mediaType,
    details,
    added_at: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    favorites[existingIndex] = newItem;
  } else {
    favorites.push(newItem);
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return newItem;
};

export const removeFromFavorites = (mediaId, mediaType) => {
  const favorites = getFavorites();
  const filteredFavorites = favorites.filter(
    item => !(item.media_id === mediaId && item.media_type === mediaType)
  );
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites));
  return true;
};

export const isInFavorites = (mediaId, mediaType) => {
  const favorites = getFavorites();
  return favorites.some(
    item => item.media_id === mediaId && item.media_type === mediaType
  );
};

// Watchlist helper functions
export const getWatchlist = () => {
  const watchlistData = localStorage.getItem(WATCHLIST_KEY);
  return watchlistData ? JSON.parse(watchlistData) : [];
};

export const addToWatchlist = (mediaId, mediaType, details) => {
  const watchlist = getWatchlist();
  const existingIndex = watchlist.findIndex(
    item => item.media_id === mediaId && item.media_type === mediaType
  );
  
  const newItem = {
    media_id: mediaId,
    media_type: mediaType,
    details,
    added_at: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    watchlist[existingIndex] = newItem;
  } else {
    watchlist.push(newItem);
  }
  
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  return newItem;
};

export const removeFromWatchlist = (mediaId, mediaType) => {
  const watchlist = getWatchlist();
  const filteredWatchlist = watchlist.filter(
    item => !(item.media_id === mediaId && item.media_type === mediaType)
  );
  
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filteredWatchlist));
  return true;
};

export const isInWatchlist = (mediaId, mediaType) => {
  const watchlist = getWatchlist();
  return watchlist.some(
    item => item.media_id === mediaId && item.media_type === mediaType
  );
};

// Media action helper functions
export const toggleFavorites = (mediaId, mediaType, details) => {
  if (isInFavorites(mediaId, mediaType)) {
    removeFromFavorites(mediaId, mediaType);
    return false;
  } else {
    addToFavorites(mediaId, mediaType, details);
    return true;
  }
};

export const toggleWatchlist = (mediaId, mediaType, details) => {
  if (isInWatchlist(mediaId, mediaType)) {
    removeFromWatchlist(mediaId, mediaType);
    return false;
  } else {
    addToWatchlist(mediaId, mediaType, details);
    return true;
  }
};