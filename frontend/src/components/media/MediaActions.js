// File: frontend/src/components/media/MediaActions.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { useWatchProgress } from '../../hooks/useWatchProgress';

const MediaActions = ({ media, mediaType, isInWatchlist, isInFavorites, onActionComplete }) => {
  const [loading, setLoading] = useState({
    watchlist: false,
    favorites: false
  });
  const [watchlist, setWatchlist] = useState(isInWatchlist);
  const [favorites, setFavorites] = useState(isInFavorites);
  
  const { currentUser } = useAuth();
  const { getMediaProgress } = useWatchProgress();
  
  // Get watch progress
  const progress = getMediaProgress(media.id, mediaType);
  const hasStarted = progress && progress.watched > 0;
  const progressPercentage = progress ? (progress.watched / progress.duration) * 100 : 0;
  
  // Handle watchlist action
  const handleWatchlist = async () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }
    
    try {
      setLoading({ ...loading, watchlist: true });
      
      if (watchlist) {
        // Remove from watchlist
        await api.delete(`/api/user-media/watchlist/${mediaType}/${media.id}`);
        setWatchlist(false);
      } else {
        // Add to watchlist
        await api.post('/api/user-media/watchlist', {
          mediaId: media.id,
          mediaType
        });
        setWatchlist(true);
      }
      
      if (onActionComplete) {
        onActionComplete('watchlist', !watchlist);
      }
    } catch (error) {
      console.error('Watchlist action error:', error);
    } finally {
      setLoading({ ...loading, watchlist: false });
    }
  };
  
  // Handle favorites action
  const handleFavorites = async () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }
    
    try {
      setLoading({ ...loading, favorites: true });
      
      if (favorites) {
        // Remove from favorites
        await api.delete(`/api/user-media/favorites/${mediaType}/${media.id}`);
        setFavorites(false);
      } else {
        // Add to favorites
        await api.post('/api/user-media/favorites', {
          mediaId: media.id,
          mediaType
        });
        setFavorites(true);
      }
      
      if (onActionComplete) {
        onActionComplete('favorites', !favorites);
      }
    } catch (error) {
      console.error('Favorites action error:', error);
    } finally {
      setLoading({ ...loading, favorites: false });
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-6">
      <div className="flex flex-wrap gap-3">
        {/* Watch Now / Continue Watching */}
        {mediaType === 'movie' ? (
          <Link
            to={`/player/movie/${media.id}`}
            className="btn-primary flex-grow md:flex-grow-0"
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              {hasStarted ? 'Continue Watching' : 'Watch Now'}
            </span>
          </Link>
        ) : (
          <Link
            to={`/tv/${media.id}/seasons`}
            className="btn-primary flex-grow md:flex-grow-0"
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Episodes
            </span>
          </Link>
        )}
        
        {/* Watchlist Button */}
        <button
          onClick={handleWatchlist}
          disabled={loading.watchlist}
          className={`flex-grow md:flex-grow-0 ${
            watchlist
              ? 'bg-[#E4D981] text-[#161616] hover:bg-opacity-80'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          } font-medium py-2 px-4 rounded transition duration-300 flex items-center justify-center`}
        >
          {loading.watchlist ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill={watchlist ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {watchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </>
          )}
        </button>
        
        {/* Favorites Button */}
        <button
          onClick={handleFavorites}
          disabled={loading.favorites}
          className={`flex-grow md:flex-grow-0 ${
            favorites
              ? 'bg-[#E6C6BB] text-[#161616] hover:bg-opacity-80'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          } font-medium py-2 px-4 rounded transition duration-300 flex items-center justify-center`}
        >
          {loading.favorites ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill={favorites ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {favorites ? 'In Favorites' : 'Add to Favorites'}
            </>
          )}
        </button>
      </div>
      
      {/* Progress bar */}
      {hasStarted && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#82BC87] h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaActions;