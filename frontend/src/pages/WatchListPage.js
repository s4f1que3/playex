// File: frontend/src/pages/WatchlistPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Spinner from '../components/common/Spinner';

const WatchlistPage = () => {
  const [mediaType, setMediaType] = useState('all');
  
  // Fetch watchlist data
  const { data, isLoading, error, refetch } = useQuery(
    'watchlist',
    () => api.get('/api/user-media/watchlist').then(res => res.data),
    {
      staleTime: 300000 // 5 minutes
    }
  );
  
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
  
  // Remove item from watchlist
  const handleRemoveItem = async (mediaId, mediaType) => {
    try {
      await api.delete(`/api/user-media/watchlist/${mediaType}/${mediaId}`);
      refetch(); // Refresh data after removing an item
    } catch (error) {
      console.error('Failed to remove item from watchlist:', error);
    }
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
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        
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
      
      {error ? (
        <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded my-6">
          <p>Failed to load your watchlist. Please try again later.</p>
        </div>
      ) : transformedData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-[#E4D981] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h2>
          <p className="text-gray-400 mb-6">
            Add movies and TV shows to your watchlist to keep track of what you want to watch.
          </p>
          <a href="/" className="btn-primary inline-block">
            Browse Content
          </a>
        </div>
      ) : (
        <MediaGrid items={transformedData} />
      )}
    </div>
  );
};

export default WatchlistPage;
