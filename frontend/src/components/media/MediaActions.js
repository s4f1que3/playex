// File: frontend/src/components/media/MediaActions.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../utils/api';
import { 
  toggleFavorite, 
  toggleWatchlist, 
  isInFavorites, 
  isInWatchlist 
} from '../../utils/LocalStorage';


const MediaActions = ({ 
  media, 
  mediaType, 
  onActionComplete, 
  isInWatchlist: initialWatchlist, 
  isInFavorites: initialFavorites,
  activeSeason = 1
}) => {

  // Add this query to fetch first episode data
  const { data: firstEpisodeData } = useQuery({
    queryKey: ['firstEpisode', media.id, activeSeason],
    queryFn: async () => {
      if (mediaType === 'tv') {
        const response = await tmdbApi.get(`/tv/${media.id}/season/${activeSeason}`);
        return response.data.episodes[0];
      }
      return null;
    },
    enabled: mediaType === 'tv'
  });
  
  // Local state
  const [loading, setLoading] = useState({
    watchlist: false,
    favorites: false
  });
  const [watchlist, setWatchlist] = useState(false);
  const [favorites, setFavorites] = useState(false);

  
  // Load initial state from localStorage or props
  useEffect(() => {
    // Use provided props as initial values if available
    setWatchlist(initialWatchlist !== undefined ? initialWatchlist : isInWatchlist(media.id, mediaType));
    setFavorites(initialFavorites !== undefined ? initialFavorites : isInFavorites(media.id, mediaType));
    
    // Add event listener to refresh data when localStorage changes in other tabs
    const handleStorageChange = () => {
      setWatchlist(isInWatchlist(media.id, mediaType));
      setFavorites(isInFavorites(media.id, mediaType));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [media.id, mediaType, initialWatchlist, initialFavorites]);
  
  // Handle watchlist action
  const handleWatchlist = () => {
    try {
      setLoading({ ...loading, watchlist: true });
      
      // Toggle watchlist status
      const newState = toggleWatchlist(media.id, mediaType, media);
      setWatchlist(newState);
      
      if (onActionComplete) {
        onActionComplete('watchlist', newState);
      }
    } catch (error) {
      console.error('Watchlist action error:', error);
    } finally {
      setLoading({ ...loading, watchlist: false });
    }
  };
  
  // Handle favorites action
  const handleFavorites = () => {
    try {
      setLoading({ ...loading, favorites: true });
      
      // Toggle favorites status
      const newState = toggleFavorite(media.id, mediaType, media);
      setFavorites(newState);
      
      if (onActionComplete) {
        onActionComplete('favorites', newState);
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
              {'Watch Now'}
            </span>
          </Link>
        ) : (
          <Link
            to={`/player/tv/${media.id}/${activeSeason}/1`}
            className="btn-primary flex-grow md:flex-grow-0"
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              {firstEpisodeData ? `Play S${activeSeason} E1` : 'Watch First Episode'}
            </span>
          </Link>
        )}
        
        {/* Watchlist Button */}
        <button
          onClick={handleWatchlist}
          disabled={loading.watchlist}
          className={`flex-grow md:flex-grow-0 ${
            watchlist
              ? 'bg-[#E4D981] text-[#161616] hover:bg-opacity-95 hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(228,217,129,0.35)]'
              : 'bg-gray-700 text-white hover:bg-gray-600 hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(55,65,81,0.35)]'
          } font-medium py-2 px-4 rounded transition-all duration-300 ease-out transform flex items-center justify-center`}
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
              ? 'bg-[#E6C6BB] text-[#161616] hover:bg-opacity-95 hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(230,198,187,0.35)]'
              : 'bg-gray-700 text-white hover:bg-gray-600 hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(55,65,81,0.35)]'
          } font-medium py-2 px-4 rounded transition-all duration-300 ease-out transform flex items-center justify-center`}
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
      
    </div>
  );
};

export default MediaActions;