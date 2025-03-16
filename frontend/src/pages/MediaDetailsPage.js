// File: frontend/src/pages/MediaDetailsPage.js
import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import Spinner from '../components/common/Spinner';
import MediaInfo from '../components/media/MediaInfo';
import MediaActions from '../components/media/MediaActions';
import CastList from '../components/media/CastList';
import SeasonsAccordion from '../components/media/SeasonsAccordion';
import MediaCarousel from '../components/media/MediaCarousel';
import VideosButton from '../components/media/VideosButton';
import { motion, AnimatePresence } from 'framer-motion';
import MediaCard from '../components/common/MediaCard';  // Add this import
import PremiumLoader from '../components/common/PremiumLoader';

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
  const [recommendedPage, setRecommendedPage] = useState(1);  // Add this
  const [similarPage, setSimilarPage] = useState(1);  // Add this

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

  const { data: similarData, isLoading: isLoadingSimilar, isFetchingNextPage: isFetchingMoreSimilar, fetchNextPage: fetchNextSimilar } = useInfiniteQuery({
    queryKey: ['mediaSimilar', mediaType, id],
    queryFn: ({ pageParam = similarPage }) => 
      tmdbApi.get(`/${mediaType}/${id}/similar`, {
        params: { page: pageParam }
      }).then(res => res.data),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    enabled: !!mediaData,
    staleTime: 300000
  });

  const { data: recommendationsData, isLoading: isLoadingRecommendations, isFetchingNextPage: isFetchingMoreRecommendations, fetchNextPage: fetchNextRecommendations } = useInfiniteQuery({
    queryKey: ['mediaRecommendations', mediaType, id],
    queryFn: ({ pageParam = recommendedPage }) => 
      tmdbApi.get(`/${mediaType}/${id}/recommendations`, {
        params: { page: pageParam }
      }).then(res => res.data),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    enabled: !!mediaData,
    staleTime: 300000
  });

  const handleActionComplete = (actionType, value) => {
    setUserActions(prev => ({
      ...prev,
      [actionType === 'watchlist' ? 'isInWatchlist' : 'isInFavorites']: value
    }));
  };
  
  const handleLoadMoreRecommendations = async () => {
    await fetchNextRecommendations();
    setRecommendedPage(prev => prev + 1);
  };

  const handleLoadMoreSimilar = async () => {
    await fetchNextSimilar();
    setSimilarPage(prev => prev + 1);
  };

  // Add new state for expanded sections
  const [expandedSimilar, setExpandedSimilar] = useState(false);
  const [expandedRecommended, setExpandedRecommended] = useState(false);

  // Move the helper function and results initialization up here
  const flattenPages = (data) => {
    return data?.pages?.reduce((acc, page) => [...acc, ...page.results], []) || [];
  };

  // Get flattened results before they are used
  const similarResults = flattenPages(similarData);
  const recommendedResults = flattenPages(recommendationsData);

  // Calculate items to show (2 rows)
  const itemsPerRow = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;
  const initialItems = itemsPerRow * 2;

  // Filter results for display
  const displaySimilar = expandedSimilar ? similarResults : similarResults?.slice(0, initialItems);
  const displayRecommended = expandedRecommended ? recommendedResults : recommendedResults?.slice(0, initialItems);

  if (isLoadingMedia) {
    return <PremiumLoader text="Loading Details" overlay={true} />;
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
  const hasSimilar = similarData?.pages && similarData.pages.length > 0;
  const hasRecommendations = recommendationsData?.pages && recommendationsData.pages.length > 0;

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
            showVideosButton={mediaType === 'movie'} // Add this prop
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

        {/* Similar Content Section */}
        {similarResults.length > 0 && (
          <motion.div className="relative mt-12 pb-8">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#E4D981]/20 rounded-full filter blur-[100px]" />
              <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[120px]" />
            </div>

            <div className="container mx-auto px-4">
              <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#E4D981]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Similar Content</h2>
                      <p className="text-gray-400 text-sm">More titles like this</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <AnimatePresence mode="popLayout">
                      {displaySimilar.map((item, index) => (
                        <motion.div
                          key={`${item.id}-${index}`}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MediaCard media={{ ...item, media_type: mediaType }} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Button Group */}
                  <div className="flex gap-3 mt-6">
                    {/* Show Initial Load More Button or Hide Button */}
                    {similarResults.length > initialItems && (
                      <motion.button
                        layout
                        onClick={() => setExpandedSimilar(!expandedSimilar)}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#E4D981]/10 hover:bg-[#E4D981]/20 
                                   text-[#E4D981] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {expandedSimilar ? (
                          <>
                            <span>Show Less</span>
                            <motion.svg 
                              animate={{ rotate: 180 }}
                              transition={{ duration: 0.3 }}
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </motion.svg>
                          </>
                        ) : (
                          <>
                            <span>Show All {similarResults.length} Items</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </>
                        )}
                      </motion.button>
                    )}

                    {/* Load More Button - Only show when expanded and more pages available */}
                    {expandedSimilar && similarData?.pages[0]?.total_pages > similarPage && (
                      <motion.button
                        layout
                        onClick={handleLoadMoreSimilar}
                        disabled={isFetchingMoreSimilar}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#E4D981]/10 hover:bg-[#E4D981]/20 
                                   text-[#E4D981] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isFetchingMoreSimilar ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Load More</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations Section */}
        {recommendedResults.length > 0 && (
          <motion.div className="relative mt-20 pb-8">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#82BC87]/20 rounded-full filter blur-[100px]" />
              <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#82BC87]/10 rounded-full filter blur-[120px]" />
            </div>

            <div className="container mx-auto px-4">
              <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
                      <p className="text-gray-400 text-sm">Based on your interests</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <AnimatePresence mode="popLayout">
                      {displayRecommended.map((item, index) => (
                        <motion.div
                          key={`${item.id}-${index}`}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MediaCard media={{ ...item, media_type: mediaType }} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Button Group */}
                  <div className="flex gap-3 mt-6">
                    {/* Show Initial Load More Button or Hide Button */}
                    {recommendedResults.length > initialItems && (
                      <motion.button
                        layout
                        onClick={() => setExpandedRecommended(!expandedRecommended)}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#82BC87]/10 hover:bg-[#82BC87]/20 
                                   text-[#82BC87] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {expandedRecommended ? (
                          <>
                            <span>Show Less</span>
                            <motion.svg 
                              animate={{ rotate: 180 }}
                              transition={{ duration: 0.3 }}
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </motion.svg>
                          </>
                        ) : (
                          <>
                            <span>Show All {recommendedResults.length} Items</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </>
                        )}
                      </motion.button>
                    )}

                    {/* Load More Button - Only show when expanded and more pages available */}
                    {expandedRecommended && recommendationsData?.pages[0]?.total_pages > recommendedPage && (
                      <motion.button
                        layout
                        onClick={handleLoadMoreRecommendations}
                        disabled={isFetchingMoreRecommendations}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#82BC87]/10 hover:bg-[#82BC87]/20 
                                   text-[#82BC87] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isFetchingMoreRecommendations ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Load More</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MediaDetailsPage;