// File: frontend/src/pages/WatchHistoryPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdbHelpers } from '../utils/api';
import Spinner from '../components/common/Spinner';
import MediaGrid from '../components/media/MediaGrid';
import { useWatchProgress } from '../hooks/useWatchProgress';

const WatchHistoryPage = () => {
  const [mediaType, setMediaType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const { watchProgress, deleteHistoryItem, clearWatchHistory } = useWatchProgress();
  
  // Convert watchProgress object to array and filter out unwatched items or invalid items
  const watchHistoryArray = React.useMemo(() => {
    console.log("Processing watchProgress in WatchHistory:", watchProgress);
    
    if (!watchProgress || Object.keys(watchProgress).length === 0) return [];
    
    const result = Object.values(watchProgress)
      // Filter out items with no meaningful progress
      .filter(item => {
        // Must have progress data
        if (!item.progress || typeof item.progress !== 'object') {
          console.log(`Item ${item.id} has no valid progress object`);
          return false;
        }
        
        // Must have watched more than 0 seconds
        if (item.progress.watched <= 0) {
          console.log(`Item ${item.id} has zero or negative watch time`);
          return false;
        }
        
        // If we have duration, must have watched at least 1%
        if (item.progress.duration > 0 && 
            (item.progress.watched / item.progress.duration) < 0.01) {
          console.log(`Item ${item.id} has insignificant watch progress`);
          return false;
        }
        
        // Must have required fields
        if (!item.id || !item.type) {
          console.log(`Item missing required fields:`, item);
          return false;
        }
        
        return true;
      })
      .map(item => ({
        id: item.id,
        media_id: item.id,
        media_type: item.type,
        title: item.title || "Unknown Title",
        name: item.title || "Unknown Title",
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        watch_progress: item.progress?.watched || 0,
        duration: item.progress?.duration || 0,
        season: item.last_season_watched,
        episode: item.last_episode_watched ? {
          episode_number: item.last_episode_watched,
          name: `Episode ${item.last_episode_watched}`
        } : null,
        watched_at: item.last_updated || new Date().toISOString()
      }))
      .sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at));
    
    console.log("Final watchHistoryArray:", result);
    return result;
  }, [watchProgress]);
  
  // Effect to validate localStorage data on mount
  useEffect(() => {
    try {
      // Get raw data from localStorage for debugging
      const rawData = localStorage.getItem('vidLinkProgress');
      if (rawData) {
        console.log("Raw localStorage data:", JSON.parse(rawData));
      }
    } catch (err) {
      console.error("Error checking localStorage:", err);
    }
  }, []);
  
  // Filter data based on selected media type
  const filteredData = React.useMemo(() => {
    if (mediaType === 'all') {
      return watchHistoryArray;
    }
    
    return watchHistoryArray.filter(item => item.media_type === mediaType);
  }, [watchHistoryArray, mediaType]);
  
  // Handle clearing all watch history
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire watch history?')) {
      setLoading(true);
      
      // Use the hook's function to clear history
      clearWatchHistory();
      
      // No need to reload, just stop loading
      setLoading(false);
    }
  };
  
  // Handle deleting individual history item
  const handleDeleteItem = (item) => {
    setLoading(true);
    
    // Use the hook's function to delete item
    deleteHistoryItem(item.id);
    
    // No need to reload, just stop loading
    setLoading(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Watch History</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* View Mode Toggle */}
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded ${
                viewMode === 'grid' 
                  ? 'bg-[#82BC87] text-white' 
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${
                viewMode === 'list' 
                  ? 'bg-[#82BC87] text-white' 
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Media Type Filter */}
          <div className="flex">
            <button
              onClick={() => setMediaType('all')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                mediaType === 'all' 
                  ? 'bg-[#82BC87] text-white' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMediaType('movie')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                mediaType === 'movie' 
                  ? 'bg-[#82BC87] text-white' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setMediaType('tv')}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                mediaType === 'tv' 
                  ? 'bg-[#82BC87] text-white' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              TV Shows
            </button>
          </div>
          
          {/* Clear History Button */}
          {filteredData.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Clear All'
              )}
            </button>
          )}
        </div>
      </div>
      
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-[#82BC87] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your watch history is empty</h2>
          <p className="text-gray-400 mb-6">
            Watch movies and TV shows to see them appear in your history.
          </p>
          <a href="/" className="btn-primary inline-block">
            Browse Content
          </a>
        </div>
      ) : viewMode === 'grid' ? (
        <MediaGrid items={filteredData} />
      ) : (
        <div className="space-y-4">
          {filteredData.map((item) => {
            const progressPercentage = item.watch_progress && item.duration
              ? Math.min(100, Math.round((item.watch_progress / item.duration) * 100))
              : 0;
              
            const title = item.title || item.name || "Unknown Title";
            const isTV = item.media_type === 'tv';
            const episodeInfo = isTV && item.episode
              ? `S${item.season} E${item.episode.episode_number}: ${item.episode.name}`
              : null;
              
            const watchedDate = new Date(item.watched_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            
            const playLink = isTV
              ? `/player/tv/${item.id}/${item.season}/${item.episode.episode_number}`
              : `/player/movie/${item.id}`;
            
            return (
              <div key={`${item.id}-${item.media_type}-${item.season || ''}-${item.episode?.episode_number || ''}`} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
                <div className="flex">
                  {/* Poster */}
                  <div className="w-1/4 md:w-1/6">
                    <Link to={`/${item.media_type}/${item.id}`}>
                      <img
                        src={tmdbHelpers.getImageUrl(item.poster_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                  
                  {/* Info */}
                  <div className="w-3/4 md:w-5/6 p-4">
                    <div className="flex justify-between">
                      <div>
                        <Link to={`/${item.media_type}/${item.id}`}>
                          <h3 className="font-bold text-white text-lg hover:text-[#82BC87] transition duration-300">
                            {title}
                          </h3>
                        </Link>
                        
                        {episodeInfo && (
                          <p className="text-[#E4D981] text-sm mt-1">{episodeInfo}</p>
                        )}
                        
                        <div className="text-gray-400 text-sm mt-1">
                          <span className="mr-3">
                            {isTV ? 'TV Show' : 'Movie'}
                          </span>
                          <span>Watched: {watchedDate}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          to={playLink}
                          className="bg-[#82BC87] hover:bg-opacity-80 text-white rounded-full p-2 transition duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>
                          {progressPercentage >= 95 
                            ? 'Completed' 
                            : `${Math.round(progressPercentage)}% watched`}
                        </span>
                        
                        {item.duration > 0 && (
                          <span>
                            {Math.floor(item.watch_progress / 60)}:{String(Math.floor(item.watch_progress % 60)).padStart(2, '0')} / 
                            {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <div className="bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-[#82BC87] h-1.5 rounded-full"
                          style={{ width: `${Math.max(1, progressPercentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchHistoryPage;