// File: frontend/src/pages/FavoritesPage.js
import React, { useState, useEffect } from 'react';
import MediaGrid from '../components/media/MediaGrid';
import Spinner from '../components/common/Spinner';
import { getFavorites, removeFromFavorites } from '../utils/LocalStorage';

const FavoritesPage = () => {
  const [mediaType, setMediaType] = useState('all');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load favorites from localStorage
  useEffect(() => {
    setData(getFavorites());
    setIsLoading(false);
    
    // Add event listener to refresh data when localStorage changes in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'user_favorites') {
        setData(getFavorites());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Filter data based on selected media type
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    
    if (mediaType === 'all') {
      return data;
    }
    
    return data.filter(item => item.media_type === mediaType);
  }, [data, mediaType]);
  
  // Transform data for MediaGrid component
  const transformedData = React.useMemo(() => {
    return filteredData.map(item => ({
      id: item.media_id,
      media_type: item.media_type,
      ...item.details
    }));
  }, [filteredData]);
  
  // Remove item from favorites
  const handleRemoveItem = (mediaId, mediaType) => {
    removeFromFavorites(mediaId, mediaType);
    setData(getFavorites()); // Refresh data after removing an item
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        
        {/* Media Type Filter */}
        <div className="flex space-x-2">
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
      </div>
      
      {transformedData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-[#E6C6BB] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your favorites list is empty</h2>
          <p className="text-gray-400 mb-6">
            Add movies and TV shows to your favorites to save the ones you love.
          </p>
          <a href="/" className="btn-primary inline-block">
            Browse Content
          </a>
        </div>
      ) : (
        <MediaGrid items={transformedData} onRemove={handleRemoveItem} />
      )}
    </div>
  );
};

export default FavoritesPage;