// File: frontend/src/hooks/useWatchProgress.js
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

export function useWatchProgress() {
  const [watchProgress, setWatchProgress] = useState({});
  const [deletedItems, setDeletedItems] = useState([]);
  const { currentUser } = useAuth();

  // Load watch progress and deleted items from localStorage
  useEffect(() => {
    try {
      // Load watch progress
      const storedProgress = localStorage.getItem('vidLinkProgress');
      
      // Load deleted items list
      const storedDeletedItems = localStorage.getItem('playexDeletedItems');
      const deletedList = storedDeletedItems ? JSON.parse(storedDeletedItems) : [];
      setDeletedItems(deletedList);
      
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        
        // Filter out deleted items
        const filteredData = {};
        for (const key in parsed) {
          if (!deletedList.includes(key.toString())) {
            filteredData[key] = parsed[key];
          }
        }
        
        // Additional validation - ensure we only keep items with actual progress
        for (const key in filteredData) {
          const item = filteredData[key];
          // Only keep items with valid progress data
          if (!item.progress || (item.progress.watched <= 0)) {
            delete filteredData[key];
          }
        }
        
        setWatchProgress(filteredData);
        console.log("Loaded initial watch progress:", filteredData);
      }
    } catch (error) {
      console.error('Error loading watch progress:', error);
    }
  }, []);

  // Process player events in a more resilient way
  const processPlayerEvent = useCallback((eventData) => {
    console.log("Processing player event:", eventData);
    
    // Handle MEDIA_DATA events
    if (eventData?.type === 'MEDIA_DATA') {
      const mediaData = eventData.data;
      console.log("Received MEDIA_DATA:", mediaData);
      
      // Get stored deleted items
      const storedDeletedItems = localStorage.getItem('playexDeletedItems');
      const deletedList = storedDeletedItems ? JSON.parse(storedDeletedItems) : [];
      
      // Filter out deleted items and invalid items
      const cleanedMediaData = {};
      for (const key in mediaData) {
        const item = mediaData[key];
        
        // Skip if in deleted list
        if (deletedList.includes(key.toString())) {
          continue;
        }
        
        // Skip if no progress data or progress is 0
        if (!item.progress || item.progress.watched <= 0) {
          continue;
        }
        
        // Ensure the item has required fields
        if (!item.id || !item.type || !item.title) {
          console.warn("Skipping item with missing required fields:", item);
          continue;
        }
        
        cleanedMediaData[key] = item;
      }
      
      console.log("Watch data after filtering:", cleanedMediaData);
      
      // Update localStorage with cleaned data
      localStorage.setItem('vidLinkProgress', JSON.stringify(cleanedMediaData));
      
      // Update state with cleaned data
      setWatchProgress(prevState => {
        const newState = { ...prevState, ...cleanedMediaData };
        console.log("Updated watch progress state:", newState);
        return newState;
      });
      
      return true;
    }
    
    // Handle PLAYER_EVENT events with more detailed tracking
    if (eventData?.type === 'PLAYER_EVENT') {
      const playerData = eventData.data;
      console.log("Received PLAYER_EVENT:", playerData);
      
      // Track meaningful playback events more carefully
      if (playerData?.event === 'timeupdate' && 
          playerData.currentTime > 0 && 
          playerData.duration > 0 && 
          playerData.mtmdbId) {
          
        // Only consider it "watched" if they've viewed a meaningful amount
        // (e.g., more than 30 seconds or 5% of the video)
        const isSignificantProgress = playerData.currentTime > 30 || 
                                     (playerData.duration > 0 && 
                                      playerData.currentTime / playerData.duration > 0.05);
                                      
        if (isSignificantProgress) {
          console.log(`Meaningful playback at ${playerData.currentTime}/${playerData.duration} for ${playerData.mediaType} ${playerData.mtmdbId}`);
          
          // We could update our own state here for more reliable tracking
          const mediaId = playerData.mtmdbId.toString();
          const mediaType = playerData.mediaType === 'movie' ? 'movie' : 'tv';
          
          // Get existing data
          const existingData = JSON.parse(localStorage.getItem('vidLinkProgress') || '{}');
          
          // Create or update the entry
          existingData[mediaId] = {
            ...(existingData[mediaId] || {}),
            id: mediaId,
            type: mediaType,
            title: playerData.title || existingData[mediaId]?.title || `Unknown ${mediaType}`,
            poster_path: existingData[mediaId]?.poster_path || null,
            progress: {
              watched: Math.floor(playerData.currentTime),
              duration: Math.floor(playerData.duration)
            },
            last_updated: new Date().toISOString()
          };
          
          // Update localStorage
          localStorage.setItem('vidLinkProgress', JSON.stringify(existingData));
          
          // Update state
          setWatchProgress(existingData);
        }
      }
      
      return true;
    }
    
    return false;
  }, []);

  // Listen for messages from video player iframe - more flexible version
  useEffect(() => {
    const handleMessage = (event) => {
      // Log all messages for debugging
      console.log("Received postMessage event:", event);
      
      // Be more flexible with origins - accept from any trusted source
      // This is a more relaxed approach for debugging
      const trustedOrigins = ['vidlink.pro', 'vid.link', 'playex.com', 'localhost'];
      const isTrustedOrigin = trustedOrigins.some(origin => 
        event.origin.includes(origin)
      );
      
      if (!isTrustedOrigin && event.origin !== window.location.origin) {
        console.log("Ignoring message from untrusted origin:", event.origin);
        return;
      }
      
      try {
        // Process the event
        const processed = processPlayerEvent(event.data);
        if (processed) {
          console.log("Successfully processed player event");
        } else {
          console.log("Event not processed, unknown format:", event.data);
          
          // Try to handle different message formats
          // Some players might send data in different formats
          if (typeof event.data === 'string') {
            try {
              const parsedData = JSON.parse(event.data);
              console.log("Parsed string message:", parsedData);
              const processed = processPlayerEvent(parsedData);
              if (processed) {
                console.log("Successfully processed parsed string event");
              }
            } catch (e) {
              console.log("Could not parse string message:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error processing player event:", error);
      }
    };
    
    // Add both log statements to diagnose setup issues
    console.log("Setting up message event listener");
    window.addEventListener('message', handleMessage);
    
    // Manual check for existing data
    const manualCheck = setTimeout(() => {
      try {
        const storedProgress = localStorage.getItem('vidLinkProgress');
        if (storedProgress) {
          console.log("Manual check found data:", JSON.parse(storedProgress));
        } else {
          console.log("Manual check: No watch progress data found in localStorage");
        }
      } catch (e) {
        console.error("Error in manual localStorage check:", e);
      }
    }, 2000);
    
    return () => {
      console.log("Removing message event listener");
      window.removeEventListener('message', handleMessage);
      clearTimeout(manualCheck);
    };
  }, [processPlayerEvent]);

  // Delete an item from watch history
  const deleteHistoryItem = (mediaId) => {
    // Add to deleted items list
    const mediaIdStr = mediaId.toString();
    const updatedDeletedItems = [...deletedItems, mediaIdStr];
    setDeletedItems(updatedDeletedItems);
    localStorage.setItem('playexDeletedItems', JSON.stringify(updatedDeletedItems));
    
    // Remove from current watch progress
    const updatedProgress = { ...watchProgress };
    delete updatedProgress[mediaId];
    setWatchProgress(updatedProgress);
    
    // Update localStorage
    localStorage.setItem('vidLinkProgress', JSON.stringify(updatedProgress));
    
    return true;
  };
  
  // Clear all watch history
  const clearWatchHistory = () => {
    // Get all media IDs and add them to deleted items
    const allMediaIds = Object.keys(watchProgress).map(id => id.toString());
    const updatedDeletedItems = [...new Set([...deletedItems, ...allMediaIds])]; // Use Set to remove duplicates
    setDeletedItems(updatedDeletedItems);
    localStorage.setItem('playexDeletedItems', JSON.stringify(updatedDeletedItems));
    
    // Clear watch progress
    setWatchProgress({});
    localStorage.removeItem('vidLinkProgress');
    
    return true;
  };

  // Update server with watch progress
  const updateServerProgress = async (mediaItem) => {
    try {
      const { id, type, progress, last_season_watched, last_episode_watched } = mediaItem;
      
      if (!id || !type || !progress) return;
      
      const payload = {
        mediaId: id,
        mediaType: type,
        progress: progress.watched,
        duration: progress.duration
      };
      
      // Add season and episode for TV shows
      if (type === 'tv' && last_season_watched && last_episode_watched) {
        payload.season = last_season_watched;
        payload.episode = last_episode_watched;
      }
      
      await api.post('/api/user-media/watch-progress', payload);
    } catch (error) {
      console.error('Error updating server with watch progress:', error);
    }
  };

  // Get progress for specific media
  const getMediaProgress = (mediaId, mediaType, season = null, episode = null) => {
    try {
      if (!watchProgress[mediaId]) return null;
      
      const media = watchProgress[mediaId];
      
      if (mediaType === 'tv' && season && episode) {
        const episodeKey = `s${season}e${episode}`;
        return media.show_progress?.[episodeKey]?.progress || null;
      }
      
      return media.progress || null;
    } catch (error) {
      console.error('Error getting media progress:', error);
      return null;
    }
  };

  // Check if a media item is in deleted list
  const isDeleted = (mediaId) => {
    return deletedItems.includes(mediaId.toString());
  };

  // Manual method to add watch progress (for testing or direct use)
  const manuallyAddProgress = (mediaId, mediaType, title, posterPath, watchedTime, duration) => {
    const newEntry = {
      id: mediaId,
      type: mediaType,
      title: title,
      poster_path: posterPath,
      progress: {
        watched: watchedTime,
        duration: duration
      },
      last_updated: new Date().toISOString()
    };
    
    // Don't add if watched time is 0 or very low
    if (watchedTime <= 0 || (duration > 0 && watchedTime/duration < 0.01)) {
      console.log("Skipping adding progress with no meaningful watch time");
      return;
    }
    
    setWatchProgress(prev => {
      const updated = { ...prev, [mediaId]: newEntry };
      localStorage.setItem('vidLinkProgress', JSON.stringify(updated));
      return updated;
    });
  };

  return { 
    watchProgress, 
    setWatchProgress, 
    getMediaProgress, 
    updateServerProgress,
    deleteHistoryItem,
    clearWatchHistory,
    isDeleted,
    manuallyAddProgress
  };
}