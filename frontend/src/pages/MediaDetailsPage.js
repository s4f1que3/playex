// File: frontend/src/pages/MediaDetailsPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { tmdbApi } from '../utils/api';
import Spinner from '../components/common/Spinner';
import MediaInfo from '../components/media/MediaInfo';
import MediaActions from '../components/media/MediaActions';
import CastList from '../components/media/CastList';
import SeasonsAccordion from '../components/media/SeasonsAccordion';
import MediaCarousel from '../components/media/MediaCarousel';

const MediaDetailsPage = ({ mediaType }) => {
  const { id } = useParams();
  const [userActions, setUserActions] = useState({
    isInWatchlist: false,
    isInFavorites: false
  });
  
  // Fetch media details
  const { data, isLoading, error } = useQuery(
    ['mediaDetails', mediaType, id],
    () => tmdbApi.get(`/${mediaType}/${id}`, {
      params: {
        append_to_response: 'credits,videos,recommendations,similar'
      }
    }).then(res => {
      // Initialize user actions from API if available
      if (res.data.user_data) {
        setUserActions({
          isInWatchlist: res.data.user_data.in_watchlist,
          isInFavorites: res.data.user_data.in_favorites
        });
      }
      return res.data;
    }),
    {
      staleTime: 300000 // 5 minutes
    }
  );
  
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
  
  return (
    <div className="-mx-4 -mt-6"> {/* Extend content to full width */}
      <MediaInfo media={data} mediaType={mediaType} />
      
      <div className="container mx-auto px-4">
        {/* Media Actions (Watch Now, Add to Watchlist, etc.) */}
        <MediaActions
          media={data}
          mediaType={mediaType}
          isInWatchlist={userActions.isInWatchlist}
          isInFavorites={userActions.isInFavorites}
          onActionComplete={handleActionComplete}
        />
        
        {/* Cast List */}
        <CastList cast={data.credits?.cast} />
        
        {/* Seasons and Episodes (TV Shows only) */}
        {mediaType === 'tv' && data.seasons && (
          <SeasonsAccordion tvId={id} seasons={data.seasons} />
        )}
        
        {/* Similar Content */}
        {data.similar?.results?.length > 0 && (
          <MediaCarousel
            title="Similar Content"
            items={data.similar.results.map(item => ({ ...item, media_type: mediaType }))}
            loading={false}
            error={null}
          />
        )}
        
        {/* Recommended Content */}
        {data.recommendations?.results?.length > 0 && (
          <MediaCarousel
            title="Recommended For You"
            items={data.recommendations.results.map(item => ({ ...item, media_type: mediaType }))}
            loading={false}
            error={null}
          />
        )}
      </div>
    </div>
  );
};

export default MediaDetailsPage;