import React, { useState, useEffect } from 'react';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tmdbApi, getFanFavorites } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';
import FilterPanel from '../components/common/FilterPanel';
import RequestForm from '../components/requests/RequestForm';
import SEO from '../components/common/SEO';

const FanFavoritesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Add mediaType state
  const [selectedMediaType, setSelectedMediaType] = useState('tv');

  // Parse query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const with_genres = queryParams.get('with_genres') ? queryParams.get('with_genres').split(',').map(Number) : [];
  const primary_release_year = queryParams.get('primary_release_year') || '';
  const sort_by = queryParams.get('sort_by') || 'popularity.desc';
  const currentPage = parseInt(queryParams.get('page')) || 1;

  // Fetch fan favorites with filtering
  const { data: fanFavoritesData, isLoading, error, isFetching } = useQuery({
    queryKey: ['fanFavorites', selectedMediaType, { with_genres, primary_release_year, sort_by, currentPage }],
    queryFn: async () => {
      // Force fresh data fetch from TMDB
      const favorites = await getFanFavorites(selectedMediaType);
      
      // Apply filters
      let filteredResults = favorites;

      if (with_genres.length > 0) {
        filteredResults = filteredResults.filter(item => 
          item.genre_ids?.some(id => with_genres.includes(id))
        );
      }

      if (primary_release_year) {
        filteredResults = filteredResults.filter(item => {
          const year = new Date(item.first_air_date).getFullYear();
          return year.toString() === primary_release_year;
        });
      }

      if (sort_by) {
        const [sortField, sortOrder] = sort_by.split('.');
        filteredResults.sort((a, b) => {
          let valueA = a[sortField] || 0;
          let valueB = b[sortField] || 0;
          return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
        });
      }

      // Paginate results
      const itemsPerPage = 20;
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      
      return {
        results: filteredResults.slice(start, end),
        total_results: filteredResults.length,
        total_pages: Math.ceil(filteredResults.length / itemsPerPage),
        page: currentPage
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    cacheTime: 0, // Disable caching
    staleTime: 0  // Consider data immediately stale
  });

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`/fan-favorites?${params.toString()}`, { replace: true });
    window.scrollTo(0, 0);
  };

  // Update when URL changes
  useEffect(() => {
    if (location.search) {
      queryClient.invalidateQueries(['fanFavorites']);
    }
  }, [location.search]);

  const MediaTypeToggle = () => (
    <div className="w-full sm:w-auto flex items-center gap-3 bg-black/20 backdrop-blur-sm p-1.5 rounded-xl border border-white/5">
      <motion.button
        onClick={() => setSelectedMediaType('tv')}
        className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg transition-all duration-300 relative overflow-hidden
          ${selectedMediaType === 'tv' 
            ? 'text-black' 
            : 'text-gray-400 hover:text-white'
          }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10 font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
          TV Shows
        </span>
        {selectedMediaType === 'tv' && (
          <motion.div
            layoutId="activeTabBg"
            className="absolute inset-0 bg-[#E4D981] rounded-lg"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>

      <motion.button
        onClick={() => setSelectedMediaType('movies')}
        className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg transition-all duration-300 relative overflow-hidden
          ${selectedMediaType === 'movies' 
            ? 'text-black' 
            : 'text-gray-400 hover:text-white'
          }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10 font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
          </svg>
          Movies
        </span>
        {selectedMediaType === 'movies' && (
          <motion.div
            layoutId="activeTabBg"
            className="absolute inset-0 bg-[#E4D981] rounded-lg"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>
    </div>
  );

  return (
    <>
      <SEO 
        title="Fan Favorites"
        description="Discover the most beloved movies and TV shows on Playex. Browse top-rated content chosen by our community."
        url={window.location.href}
        type="website"
      />
      <div className="relative min-h-screen">
        {/* Parallax Hero Section */}
        <div className="relative -mx-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[40vh] md:h-[50vh] flex items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616] z-20" />
            <div className="absolute inset-0 bg-[#161616]">
              <div className="absolute inset-0 opacity-5 animate-pulse">
                <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150" />
              </div>
            </div>

            <div className="container relative z-30 mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl"
              >
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#E4D981]/10 border border-[#E4D981]/20 mb-6 backdrop-blur-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E4D981] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E4D981]" />
                  </span>
                  <span className="text-[#E4D981] font-medium">Fan Favorites</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Community
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E4D981] to-[#d4c86e] ml-3">
                    Favorites
                  </span>
                </h1>
                
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                  Discover the most beloved and highly-rated shows among our community of viewers.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Change this container's margin-top to move buttons down */}
        <div className="container mx-auto px-4 mt-3 relative z-24">
          {/* Updated filter controls container with more bottom margin */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <div className="order-2 sm:order-1">
              <MediaTypeToggle />
            </div>
            <div className="order-1 sm:order-2 sm:ml-auto">
              <FilterPanel mediaType={selectedMediaType} />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-3 sm:p-6 border border-white/5 shadow-2xl"
          >
            {/* Adjusted loading indicator for mobile */}
            {isFetching && (
              <div className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-yellow-500/10 text-yellow-500 rounded-lg mb-4 text-sm sm:text-base">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span>Refreshing fan favorites...</span>
              </div>
            )}

            {/* Adjusted results counter for mobile */}
            {fanFavoritesData && (
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl bg-black/20 mb-4 sm:mb-6 w-fit text-sm sm:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-400 whitespace-nowrap">
                  Found <span className="text-[#E4D981] font-medium">{fanFavoritesData.total_results.toLocaleString()}</span> fan favorites
                </span>
              </div>
            )}

            {/* Grid Section */}
            <MediaGrid 
              items={fanFavoritesData?.results.map(item => ({ ...item, media_type: selectedMediaType }))} 
              loading={isLoading} 
              error={error}
            />

            {/* Pagination */}
            {fanFavoritesData && fanFavoritesData.total_pages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={fanFavoritesData.total_pages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        <RequestForm />

        {/* Grid Pattern Animation */}
        <style jsx>{`
          .bg-pattern-grid {
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }
        `}</style>
      </div>
    </>
  );
};

export default FanFavoritesPage;
