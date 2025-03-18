// File: frontend/src/pages/MoviesPage.js
import React, { useState, useEffect } from 'react';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import MediaFilters from '../components/media/MediaFilters';
import Pagination from '../components/common/Pagnation';
import { motion } from 'framer-motion';
import FilterPanel from '../components/common/FilterPanel';  // Add this import back

const MoviesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const with_genres = queryParams.get('with_genres') ? queryParams.get('with_genres').split(',').map(Number) : [];
  const primary_release_year = queryParams.get('primary_release_year') || '';
  const sort_by = queryParams.get('sort_by') || 'popularity.desc';
  const currentPage = parseInt(queryParams.get('page')) || 1;

  // Use URL parameters directly in the query
  const { data: moviesData, isLoading, error, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['movies', { with_genres, primary_release_year, sort_by, currentPage }],
    queryFn: ({ pageParam = currentPage }) => {
      return tmdbApi.get('/discover/movie', {
        params: {
          page: pageParam,
          with_genres: with_genres.join(','),
          primary_release_year,
          sort_by
        }
      }).then(res => res.data);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    staleTime: 300000
  });

  // Get the total number of movies from the first page
  const movies = moviesData?.pages[0]?.results || [];

  // Update filters when URL changes
  useEffect(() => {
    if (location.search) {
      // Trigger a refetch when URL parameters change
      queryClient.invalidateQueries(['movies']);
    }
  }, [location.search]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.sort_by && newFilters.sort_by !== 'popularity.desc') {
      params.set('sort_by', newFilters.sort_by);
    }
    
    if (newFilters.with_genres && newFilters.with_genres.length > 0) {
      params.set('with_genres', newFilters.with_genres.toString());
    }
    
    if (newFilters.primary_release_year) {
      params.set('primary_release_year', newFilters.primary_release_year);
    }
    
    navigate(`/movies?${params.toString()}`, { replace: true });
  };
  
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`/movies?${params.toString()}`, { replace: true });
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  // Add scroll to top functionality
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  return (
    <div className="min-h-screen bg-[#161616] pt-24">
      <div className="container mx-auto px-4">
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
                  className="max-w-3xl"
                >
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-6 backdrop-blur-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                    </span>
                    <span className="text-[#82BC87] font-medium">Explore Movies</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                    Discover
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                      Amazing Movies
                    </span>
                  </h1>
                  
                  <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                    From blockbuster hits to independent gems, explore our vast collection of movies across all genres and eras.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Content Section - Updated spacing */}
          <div className="container mx-auto px-4 -mt-20 relative z-30">
            <div className="flex flex-wrap items-center justify-end gap-4 mb-6"> {/* Changed justify-between to justify-end */}
              <div className="flex items-center gap-3">
                <FilterPanel mediaType="movie" />
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/5 shadow-2xl"
            >
              
              {/* Results Counter */}
              <motion.div 
                layout
                className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/5 pt-6"
              >
                {moviesData && (
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                    </svg>
                    <span className="text-gray-400">
                      Found <span className="text-[#82BC87] font-medium">{moviesData.pages[0].total_results.toLocaleString()}</span> movies
                    </span>
                  </div>
                )}
                {isLoading && (
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20">
                    <div className="w-5 h-5 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400 animate-pulse">Updating results...</span>
                  </div>
                )}
              </motion.div>

              {/* Grid Section */}
              <motion.div 
                layout
                className="mt-8"
              >
                <MediaGrid 
                  items={moviesData?.pages.flatMap(page => page.results).map(item => ({ ...item, media_type: 'movie' }))}
                  loading={isLoading} 
                  error={error}
                  showType={false}
                />
              </motion.div>

              {/* Enhanced Pagination */}
              {moviesData && moviesData.pages[0].total_pages > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 mb-8"
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={moviesData.pages[0].total_pages > 500 ? 500 : moviesData.pages[0].total_pages}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Floating Action Button */}
          <button
            onClick={handleScrollTop}
            className="fixed bottom-8 right-8 bg-[#82BC87] hover:bg-[#6da972] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
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

          {/* Grid Pattern Animation */}
          <style jsx>{`
            .bg-pattern-grid {
              background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;