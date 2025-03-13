// File: frontend/src/pages/MediaDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import Spinner from '../components/common/Spinner';
import MediaInfo from '../components/media/MediaInfo';
import MediaActions from '../components/media/MediaActions';
import CastList from '../components/media/CastList';
import SeasonsAccordion from '../components/media/SeasonsAccordion';
import MediaCarousel from '../components/media/MediaCarousel';

const MediaDetailsPage = ({ mediaType }) => {
  const { id } = useParams();
  const location = useLocation();
  const [userActions, setUserActions] = useState({
    isInWatchlist: false,
    isInFavorites: false
  });
  
  // Initialize activeSeason with the value from location state if available
  const [activeSeason, setActiveSeason] = useState(() => {
    // Check if we have season info in the location state (from the "All Episodes" button)
    if (location.state && location.state.activeSeason) {
      return location.state.activeSeason;
    }
    // Default to season 1
    return 1;
  });

  // Updated query to properly fetch additional data
  const { data, isLoading, error } = useQuery({
    queryKey: ['mediaDetails', mediaType, id],
    queryFn: async () => {
      const response = await tmdbApi.get(`/${mediaType}/${id}`, {
        params: {
          append_to_response: 'credits,videos,recommendations,similar'
        }
      });
      return response.data;
    },
    staleTime: 300000 // 5 minutes
  });
  
  const handleActionComplete = (actionType, value) => {
    setUserActions(prev => ({
      ...prev,
      [actionType === 'watchlist' ? 'isInWatchlist' : 'isInFavorites']: value
    }));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded my-6">
        <p>Failed to load {mediaType} details. Please try again later.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-2xl mb-2">No {mediaType} found</p>
        <p>The requested {mediaType} doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  console.log('Media Details Data:', data); // Add this to debug

  return (
    <div className="-mx-4 -mt-6">
      <MediaInfo media={data} mediaType={mediaType} />
      
      <div className="container mx-auto px-4 space-y-8"> {/* Added space-y-8 for consistent spacing */}
        <MediaActions
          media={data}
          mediaType={mediaType}
          isInWatchlist={userActions.isInWatchlist}
          isInFavorites={userActions.isInFavorites}
          onActionComplete={handleActionComplete}
          activeSeason={activeSeason}
        />
        
        {/* Cast List with debug logging */}
        {data?.credits?.cast && (
          <div className="mb-8">
            <CastList cast={data.credits.cast} />
          </div>
        )}
        
        {/* Seasons (TV Shows only) */}
        {mediaType === 'tv' && data?.seasons && (
          <div className="mb-8">
            <SeasonsAccordion 
              tvId={id} 
              seasons={data.seasons} 
              activeSeason={activeSeason}
              setActiveSeason={setActiveSeason}
            />
          </div>
        )}
        
        {/* Similar Content with debug logging */}
        {data?.similar?.results && data.similar.results.length > 0 && (
          <div className="mb-8">
            <MediaCarousel
              title="Similar Content"
              items={data.similar.results.map(item => ({ ...item, media_type: mediaType }))}
              loading={false}
              error={null}
            />
          </div>
        )}
        
        {/* Recommended Content with debug logging */}
        {data?.recommendations?.results && data.recommendations.results.length > 0 && (
          <div className="mb-8">
            <MediaCarousel
              title="Recommended For You"
              items={data.recommendations.results.map(item => ({ ...item, media_type: mediaType }))}
              loading={false}
              error={null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaDetailsPage;