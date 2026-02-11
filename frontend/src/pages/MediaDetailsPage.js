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
import { parseMediaUrl } from '../utils/slugify';
import { useSlugResolver } from '../hooks/useSlugResolver';
import SEO from '../components/common/SEO';

const MediaDetailsPage = ({ mediaType }) => {
  const { slug } = useParams();
  const { id, loading: slugLoading } = useSlugResolver(mediaType, slug);
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
    queryFn: () => tmdbApi.get(`/${mediaType}/${id}`, {
      params: {
        append_to_response: mediaType === 'movie' ? 'release_dates' : 'content_ratings'
      }
    }).then(res => {
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

  const { data: mediaDetails, isLoading: mediaLoading } = useQuery({
    queryKey: ['mediaDetails', mediaType, id],
    queryFn: () => tmdbApi.get(`/${mediaType}/${id}`),
    select: (res) => res.data
  });

  const { data: movieDetails } = useQuery({
    queryKey: ['movieDetails', id],
    queryFn: () => tmdbApi.get(`/movie/${id}`).then(res => res.data),
    enabled: mediaType === 'movie', // Only fetch for movies
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

  if (slugLoading || isLoadingMedia) {
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

  const ActionsSection = () => (
    <div className="flex flex-col gap-6 w-full">
      {/* Media Actions Container - Made full width on mobile */}
      <div className="w-full">
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

      {/* Collection Button - Updated responsive styles */}
      {mediaType === 'movie' && movieDetails?.belongs_to_collection && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <Link
            to={`/collection/${movieDetails.belongs_to_collection.id}`}
            className="group relative block p-4 sm:p-6 bg-gradient-to-br from-indigo-500/10 to-transparent 
                       backdrop-blur-sm rounded-xl sm:rounded-2xl border border-indigo-500/20 overflow-hidden
                       transition-all duration-500 hover:border-indigo-500/40 w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                          opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Icon container */}
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-500/10 
                            flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" 
                     className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" 
                     viewBox="0 0 20 20" 
                     fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>

              {/* Text content */}
              <div className="flex-grow min-w-0">
                <h3 className="text-indigo-400 text-sm sm:text-base font-medium mb-1">Part of the Collection</h3>
                <p className="text-lg sm:text-xl text-white font-semibold truncate group-hover:text-indigo-400 transition-colors duration-300">
                  {movieDetails.belongs_to_collection.name}
                </p>
              </div>

              {/* Arrow icon */}
              <div className="hidden sm:flex flex-shrink-0 items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400 transform group-hover:translate-x-1 transition-transform duration-300"
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      <SEO 
        title={mediaDetails?.title}
        description={mediaDetails?.overview}
        image={`https://image.tmdb.org/t/p/w1280${mediaDetails?.poster_path}`}
        type={mediaType === 'movie' ? 'video.movie' : 'video.episode'}
        url={window.location.href}
      />
      <div className="-mx-4 -mt-6">
        <MediaInfo media={mediaData} mediaType={mediaType} />
        
        <div className="container mx-auto px-4">
          {/* Updated container padding for better mobile spacing */}
          <div className="flex items-stretch gap-4 py-4 sm:py-6">
            <ActionsSection />
          </div>

          {mediaType === 'tv' && mediaData.seasons && (
            <SeasonsAccordion 
              tvId={id} 
              tvName={mediaData.name}  // Make sure this is being passed
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


          {/* Similar Section */}
          {recommendedResults.length > 0 && (
            <motion.div className="relative mt-20 pb-8">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-[100px]" />
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px]" />
              </div>

              <div className="container mx-auto px-4">
                <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Similar Content</h2>
                        <p className="text-gray-400 text-sm">More titles likes this</p>
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
                          className="flex-1 px-4 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 
                                     text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2"
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
                          className="flex-1 px-4 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 
                                     text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2"
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

          {/* recommended Section */}
          {similarResults.length > 0 && (
            <motion.div className="relative mt-12 pb-8">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-[100px]" />
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[120px]" />
              </div>

              <div className="container mx-auto px-4">
                <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">You May Also Like</h2>
                        <p className="text-gray-400 text-sm">Some popular titles</p>
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
                          className="flex-1 px-4 py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 
                                     text-indigo-400 transition-all duration-300 flex items-center justify-center gap-2"
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
                          className="flex-1 px-4 py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 
                                     text-indigo-400 transition-all duration-300 flex items-center justify-center gap-2"
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
        </div>
      </div>
    </>
  );
};

export default MediaDetailsPage;