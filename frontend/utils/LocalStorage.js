// File: frontend/src/utils/localStorage.js

// Storage keys
const FAVORITES_KEY = 'user_favorites';
const WATCHLIST_KEY = 'user_watchlist';
const PROGRESS_KEY = 'media_progress';
const LAST_WATCHED_KEY = 'user_last_watched';
const CONTINUE_WATCHING_KEY = 'user_continue_watching';

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

// Last watched episode tracking
export const getLastWatchedEpisode = (showId) => {
  const lastWatchedData = localStorage.getItem(LAST_WATCHED_KEY);
  const lastWatched = lastWatchedData ? JSON.parse(lastWatchedData) : {};
  return lastWatched[showId] || null;
};

export const setLastWatchedEpisode = (showId, seasonNumber, episodeNumber) => {
  const lastWatchedData = localStorage.getItem(LAST_WATCHED_KEY);
  const lastWatched = lastWatchedData ? JSON.parse(lastWatchedData) : {};
  
  lastWatched[showId] = {
    season: seasonNumber,
    episode: episodeNumber,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(LAST_WATCHED_KEY, JSON.stringify(lastWatched));
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

// Add new functions for continue watching
export const addToContinueWatching = (mediaId, mediaType, details, progress = 0) => {
  const continueWatching = getContinueWatching();
  
  // If progress is 100% and it's either a movie or the last episode of the last season
  if (progress >= 100) {
    if (mediaType === 'movie' || 
        (mediaType === 'tv' && 
         details.season_number === details.total_seasons &&
         details.episode_number === details.total_episodes)) {
      // Remove from continue watching instead of adding
      return removeContinueWatching(mediaId, mediaType);
    }
  }
  
  const newItem = {
    media_id: mediaId,
    media_type: mediaType,
    details,
    progress,
    last_watched: new Date().toISOString()
  };
  
  const filteredList = continueWatching.filter(
    item => !(item.media_id === mediaId && item.media_type === mediaType)
  );
  
  filteredList.unshift(newItem);
  const updatedList = filteredList.slice(0, 20);
  
  localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updatedList));
  return newItem;
};

export const getContinueWatching = () => {
  const data = localStorage.getItem(CONTINUE_WATCHING_KEY);
  return data ? JSON.parse(data) : [];
};

export const removeContinueWatching = (mediaId, mediaType) => {
  const list = getContinueWatching();
  const filteredList = list.filter(
    item => !(item.media_id === mediaId && item.media_type === mediaType)
  );
  
  localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(filteredList));
  return true;
};

export const getMediaProgress = (mediaId, mediaType) => {
  const progressData = localStorage.getItem(PROGRESS_KEY);
  const progress = progressData ? JSON.parse(progressData) : {};
  const key = `${mediaType}_${mediaId}`;
  return progress[key] || 0;
};

export const setMediaProgress = (mediaId, mediaType, progress) => {
  const progressData = localStorage.getItem(PROGRESS_KEY);
  const allProgress = progressData ? JSON.parse(progressData) : {};
  const key = `${mediaType}_${mediaId}`;
  allProgress[key] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
};