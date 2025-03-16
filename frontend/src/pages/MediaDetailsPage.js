// File: frontend/src/pages/MediaDetailsPage.js
import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import Spinner from '../components/common/Spinner';
import MediaInfo from '../components/media/MediaInfo';
import MediaActions from '../components/media/MediaActions';
import CastList from '../components/media/CastList';
import SeasonsAccordion from '../components/media/SeasonsAccordion';
import MediaCarousel from '../components/media/MediaCarousel';
import VideosButton from '../components/media/VideosButton';

const MediaDetailsPage = ({ mediaType }) => {
  const { id } = useParams();
  const location = useLocation();
  const [userActions, setUserActions] = useState({
    isInWatchlist: false,
    isInFavorites: false
  });
  const [activeSeason, setActiveSeason] = useState(() => {
    if (location.state && location.state.activeSeason) {
      return location.state.activeSeason;
    }
    return 1;
  });

  const { data: mediaData, isLoading: isLoadingMedia, error: mediaError } = useQuery({
    queryKey: ['mediaDetails', mediaType, id],
    queryFn: () => tmdbApi.get(`/${mediaType}/${id}`).then(res => {
      if (res.data.user_data) {
        setUserActions({
          isInWatchlist: res.data.user_data.in_watchlist,
          isInFavorites: res.data.user_data.in_favorites
        });
      }
      return res.data;
    }),
    staleTime: 300000
  });

  const { data: creditsData, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['mediaCredits', mediaType, id],
    queryFn: () => tmdbApi.get(`/${mediaType}/${id}/credits`).then(res => res.data),
    staleTime: 300000,
    enabled: !!mediaData
  });

  const { data: similarData, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['mediaSimilar', mediaType, id],
    queryFn: () => tmdbApi.get(`/${mediaType}/${id}/similar`).then(res => res.data),
    staleTime: 300000,
    enabled: !!mediaData
  });

  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['mediaRecommendations', mediaType, id],
    queryFn: () => tmdbApi.get(`/${mediaType}/${id}/recommendations`).then(res => res.data),
    staleTime: 300000,
    enabled: !!mediaData
  });

  const handleActionComplete = (actionType, value) => {
    setUserActions(prev => ({
      ...prev,
      [actionType === 'watchlist' ? 'isInWatchlist' : 'isInFavorites']: value
    }));
  };
  
  if (isLoadingMedia) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (mediaError) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded my-6">
        <p>Failed to load {mediaType} details. Please try again later.</p>
        <p className="text-sm">{mediaError.message}</p>
      </div>
    );
  }
  
  if (!mediaData) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-2xl mb-2">No {mediaType} found</p>
        <p>The requested {mediaType} doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const hasCast = creditsData?.cast && creditsData.cast.length > 0;
  const hasSimilar = similarData?.results && similarData.results.length > 0;
  const hasRecommendations = recommendationsData?.results && recommendationsData.results.length > 0;
  
  return (
    <div className="-mx-4 -mt-6">
      <MediaInfo media={mediaData} mediaType={mediaType} />
      
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-6">
          <MediaActions
            media={mediaData}
            mediaType={mediaType}
            isInWatchlist={userActions.isInWatchlist}
            isInFavorites={userActions.isInFavorites}
            onActionComplete={handleActionComplete}
            activeSeason={activeSeason}
            showVideosButton={mediaType === 'movie'}
          />
        </div>

        {mediaType === 'tv' && mediaData.seasons && (
          <SeasonsAccordion 
            tvId={id} 
            seasons={mediaData.seasons} 
            activeSeason={activeSeason}
            setActiveSeason={setActiveSeason}
          />
        )}

        {isLoadingCredits ? (
          <div className="py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Top Cast</h2>
              <div className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300">
                Loading...
              </div>
            </div>
            <div className="flex justify-center">
              <Spinner size="medium" />
            </div>
          </div>
        ) : hasCast ? (
          <CastList cast={creditsData.cast} />
        ) : null}

        {isLoadingRecommendations ? (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Content</h2>
            <div className="flex justify-center">
              <Spinner size="medium" />
            </div>
          </div>
        ) : hasRecommendations ? (
          <div className="mb-8">
            <MediaCarousel
              title={
                <div className="w-full px-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Similar Content</h2>
                  <Link 
                    to={`/${mediaType}/${id}/similar`}
                    className="text-[#E4D981] hover:text-[#c7bd6a] transition-colors text-sm pl-[1200px]"
                  >
                    View All
                  </Link>
                </div>
              }
              items={recommendationsData.results.map(item => ({ ...item, media_type: mediaType }))}
              loading={false}
              error={null}
            />
          </div>
        ) : null}
        
        {isLoadingSimilar ? (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
            <div className="flex justify-center">
              <Spinner size="medium" />
            </div>
          </div>
        ) : hasSimilar ? (
          <div className="mb-8">
            <MediaCarousel
              title={
                <div className="w-full px-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">You May Also Like</h2>
                  <Link 
                    to={`/${mediaType}/${id}/recommended`}
                    className="text-[#E4D981] hover:text-[#c7bd6a] transition-colors text-sm pl-[1100px]"
                  >
                    View All
                  </Link>
                </div>
              }
              items={similarData.results.map(item => ({ ...item, media_type: mediaType }))}
              loading={false}
              error={null}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MediaDetailsPage;