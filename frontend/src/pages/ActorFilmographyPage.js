import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import { useActorResolver } from '../hooks/useActorResolver';
import PremiumLoader from '../components/common/PremiumLoader';
import SEO from '../components/common/SEO';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';

const ActorFilmographyPage = ({ mediaType = 'movie' }) => {
  const { slug } = useParams();
  const { id, loading: resolverLoading, error: resolverError } = useActorResolver(slug);
  const [sortBy, setSortBy] = useState('popularity');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerRow = window.innerWidth >= 1536 ? 6  // 2xl
    : window.innerWidth >= 1280 ? 5  // xl
    : window.innerWidth >= 1024 ? 4  // lg
    : window.innerWidth >= 768 ? 3   // md
    : window.innerWidth >= 640 ? 3   // sm
    : 2;                             // xs
  const itemsPerPage = window.innerWidth >= 768 ? itemsPerRow * 4 : itemsPerRow * 3;

  // Add retries and better error handling for the main query
  const { data: actorData, isLoading, error } = useQuery({
    queryKey: ['actor', id],
    queryFn: async () => {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const response = await tmdbApi.get(`/person/${id}?append_to_response=combined_credits`, {
            timeout: 10000, // 10 second timeout
          });
          return response.data;
        } catch (error) {
          attempts++;
          console.error(`Attempt ${attempts} failed:`, error);
          
          if (attempts === maxAttempts) {
            throw new Error(`Failed to fetch actor data after ${maxAttempts} attempts: ${error.message}`);
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    },
    enabled: !!id && !resolverError,
    staleTime: 300000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  useEffect(() => {
    // Log detailed debugging information
    if (resolverError || error) {
      console.group('Actor Filmography Debug Info');
      console.log('Current State:', {
        slug,
        id,
        resolverLoading,
        resolverError,
        isLoading,
        error,
        actorData: actorData || null
      });
      
      if (resolverError) {
        console.error('Resolver Error Details:', {
          message: resolverError.message,
          code: resolverError.code,
          stack: resolverError.stack
        });
      }
      
      if (error) {
        console.error('Query Error Details:', {
          message: error.message,
          response: error.response,
          request: error.request,
          config: error.config
        });
      }
      console.groupEnd();
    }
  }, [slug, id, resolverError, error, actorData, resolverLoading, isLoading]);

  // Error component with more detailed information
  if (resolverError || error) {
    return (
      <div className="min-h-screen bg-[#161616] pt-24 flex items-center justify-center">
        <div className="text-center max-w-xl mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-400 mb-4">Unable to load actor information.</p>
          <div className="text-sm text-gray-500 mb-4">
            Error Code: {error?.response?.status || resolverError?.code || 'Unknown'}
            {(error?.message || resolverError?.message) && (
              <div className="mt-2 p-2 bg-gray-800 rounded text-left">
                <code className="text-xs text-gray-400">
                  {error?.message || resolverError?.message}
                </code>
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="text-[#82BC87] hover:text-[#E4D981] transition duration-300"
            >
              Try Again
            </button>
            <Link 
              to="/" 
              className="text-[#82BC87] hover:text-[#E4D981] transition duration-300"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (resolverLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#161616] pt-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="animate-pulse"
          >
            <div className="h-[40vh] bg-gray-800/50 rounded-2xl mb-8" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-800/50 rounded-xl w-1/3" />
              <div className="h-8 bg-gray-800/50 rounded-xl w-1/4" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-gray-800/50 rounded-xl" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Filter and deduplicate credits
  let credits = actorData.combined_credits?.cast?.filter(credit => credit.media_type === mediaType) || [];

  if (mediaType === 'tv') {
    // Deduplicate TV shows
    const tvMap = new Map();
    credits.forEach(credit => {
      if (!tvMap.has(credit.id) || tvMap.get(credit.id).popularity < credit.popularity) {
        tvMap.set(credit.id, credit);
      }
    });
    credits = Array.from(tvMap.values());
  }

  // Sort credits
  const sortCredits = (items) => {
    switch (sortBy) {
      case 'release_date':
        return [...items].sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date || 0);
          const dateB = new Date(b.release_date || b.first_air_date || 0);
          return dateB - dateA;
        });
      case 'title':
        return [...items].sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));
      case 'rating':
        return [...items].sort((a, b) => b.vote_average - a.vote_average);
      case 'popularity':
      default:
        return [...items].sort((a, b) => b.popularity - a.popularity);
    }
  };

  const getPaginatedResults = (items) => {
    const sortedItems = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'release_date':
          const dateA = new Date(a.release_date || a.first_air_date || 0);
          const dateB = new Date(b.release_date || b.first_air_date || 0);
          return dateB - dateA;
        case 'title':
          return (a.title || a.name).localeCompare(b.title || b.name);
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil((credits?.length || 0) / itemsPerPage);
  const displayedCredits = getPaginatedResults(credits);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortedCredits = sortCredits(credits);

  const filters = [
    { id: 'popularity', label: 'Popularity', icon: 'trending_up' },
    { id: 'release_date', label: 'Release Date', icon: 'calendar_today' },
    { id: 'title', label: 'Title', icon: 'sort_by_alpha' },
    { id: 'rating', label: 'Rating', icon: 'star' }
  ];

  const toggleFilters = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  // Media Type Toggle component similar to the one in FanFavoritesPage
  const MediaTypeToggle = () => (
    <div className="w-fit flex items-center gap-1 sm:gap-3 bg-black/20 backdrop-blur-sm p-0.5 sm:p-1.5 rounded-lg border border-white/5">
      <Link
        to={`/actor/${slug}/movies`}
        className={`flex-1 sm:flex-none px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-md transition-all duration-300 relative overflow-hidden text-xs sm:text-base
          ${mediaType === 'movie' 
            ? 'text-black' 
            : 'text-gray-400 hover:text-white'
          }`}
      >
        <span className="relative z-10 font-medium flex items-center gap-1 sm:gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
          </svg>
          Movies
        </span>
        {mediaType === 'movie' && (
          <motion.div
            layoutId="activeTabBg"
            className="absolute inset-0 bg-[#E4D981] rounded-md"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
      <Link
        to={`/actor/${slug}/tv`}
        className={`flex-1 sm:flex-none px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-md transition-all duration-300 relative overflow-hidden text-xs sm:text-base
          ${mediaType === 'tv' 
            ? 'text-black' 
            : 'text-gray-400 hover:text-white'
          }`}
      >
        <span className="relative z-10 font-medium flex items-center gap-1 sm:gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
          TV Shows
        </span>
        {mediaType === 'tv' && (
          <motion.div
            layoutId="activeTabBg"
            className="absolute inset-0 bg-[#E4D981] rounded-md"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    </div>
  );

  return (
    <>
      <SEO 
        title={`${actorData?.name} - ${mediaType === 'movie' ? 'Movies' : 'TV Shows'}`}
        description={`Complete list of ${mediaType === 'movie' ? 'movies' : 'TV shows'} featuring ${actorData?.name}`}
        image={actorData?.profile_path ? tmdbHelpers.getImageUrl(actorData.profile_path, 'w780') : undefined}
      />

      <div className="min-h-screen bg-[#161616]">
        {/* Hero Section */}
        <div className="relative pt-16 sm:pt-20 pb-8 sm:pb-12">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]" />
          
          {/* Background Image */}
          {actorData?.profile_path && (
            <div className="absolute inset-0 -z-10">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-md"
                style={{ backgroundImage: `url(${tmdbHelpers.getImageUrl(actorData.profile_path, 'original')})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-[#161616]" />
            </div>
          )}

          {/* Content Container */}
          <div className="container mx-auto px-4 relative z-10">
            {/* Back Button - Mobile */}
            <div className="block sm:hidden mb-6">
              <Link
                to={`/actor/${slug}`}
                className="inline-flex items-center gap-2 text-[#82BC87] hover:text-[#E4D981]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              {/* Profile Image - Mobile Optimized */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden 
                            border-2 border-[#82BC87]/20 shadow-xl order-1 md:order-2">
                <img
                  src={tmdbHelpers.getImageUrl(actorData?.profile_path, 'w342')}
                  alt={actorData?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 order-2 md:order-1 text-center md:text-left">
                {/* Back Button - Desktop */}
                <div className="hidden sm:block mb-6">
                  <Link
                    to={`/actor/${slug}`}
                    className="text-[#82BC87] hover:text-[#E4D981] transition duration-300 flex items-center gap-2 group w-fit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Profile
                  </Link>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full 
                              bg-[#82BC87]/10 border border-[#82BC87]/20 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87]" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#82BC87]" />
                  </span>
                  <span className="text-[#82BC87] text-sm font-medium">Actor Filmography</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  <span className="block">{actorData?.name}</span>
                  <span className="block mt-2 bg-gradient-to-r from-[#82BC87] to-[#E4D981] bg-clip-text text-transparent">
                    {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 max-w-2xl mx-auto md:mx-0">
                  Explore {credits.length} incredible {mediaType === 'movie' ? 'performances on the big screen' : 'roles in television'} 
                  by this talented artist. From unforgettable characters to breakthrough moments, 
                  discover the complete journey of {actorData?.name} in the world of {mediaType === 'movie' ? 'cinema' : 'television'}.
                </p>

                {/* Media Type Toggle */}
                <div className="flex justify-center md:justify-start">
                  <MediaTypeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="container mx-auto px-4 -mt-4 sm:mt-0 relative z-20">
          {/* Sort Button - Full Width on Mobile */}
          <div className="flex mb-6">
            <button
              onClick={toggleFilters}
              className="w-full sm:w-auto bg-[#82BC87]/10 hover:bg-[#82BC87]/20 text-[#82BC87] 
                       px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Sort By: {filters.find(f => f.id === sortBy)?.label}
            </button>
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/5"
          >
            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
                <span className="text-gray-400">
                  Found <span className="text-[#82BC87] font-medium">{credits.length.toLocaleString()}</span> {mediaType === 'movie' ? 'movies' : 'TV shows'}
                </span>
              </div>
            </div>

            {/* Grid and Pagination */}
            <div className="space-y-8">
              <MediaGrid
                items={displayedCredits}
                loading={isLoading}
                showType={mediaType === 'tv'}
                className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4"
              />

              {totalPages > 1 && (
                <div className="pt-4 sm:pt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll to Top Button - Better Mobile Position */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-[#82BC87] p-3 rounded-full 
                   shadow-lg hover:bg-[#6da972] transition-all duration-300 z-50"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 transform group-hover:-translate-y-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default ActorFilmographyPage;
