// File: frontend/src/pages/TrendingPage.js
import React, { useState, useEffect } from 'react';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';
import FilterPanel from '../components/common/FilterPanel';
import SEO from '../components/common/SEO';

const TrendingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Add missing state for timeWindow
  const [timeWindow, setTimeWindow] = useState('week');

  // Parse query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const with_genres = queryParams.get('with_genres') ? queryParams.get('with_genres').split(',').map(Number) : [];
  const primary_release_year = queryParams.get('primary_release_year') || '';
  const sort_by = queryParams.get('sort_by') || 'popularity.desc';
  const currentPage = parseInt(queryParams.get('page')) || 1;

  // Add missing handlePageChange function
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`/trending?${params.toString()}`, { replace: true });
    window.scrollTo(0, 0);
  };

  // Modify the useInfiniteQuery to properly apply filters
  const { data: trendingData, isLoading, error, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['trending', { with_genres, primary_release_year, sort_by, currentPage, timeWindow }],
    queryFn: async ({ pageParam = currentPage }) => {
      // First get trending items
      const trendingRes = await tmdbApi.get(`/trending/all/${timeWindow}`, {
        params: {
          page: pageParam,
        }
      }).then(res => res.data);

      // If no filters are applied, return trending data as is
      if (!with_genres.length && !primary_release_year && (!sort_by || sort_by === 'popularity.desc')) {
        return trendingRes;
      }

      // Filter the results based on the applied filters
      let filteredResults = trendingRes.results;

      // Apply genre filter
      if (with_genres.length > 0) {
        filteredResults = filteredResults.filter(item => 
          item.genre_ids?.some(id => with_genres.includes(id))
        );
      }

      // Apply year filter
      if (primary_release_year) {
        filteredResults = filteredResults.filter(item => {
          const year = new Date(item.release_date || item.first_air_date).getFullYear();
          return year.toString() === primary_release_year;
        });
      }

      // Apply sorting
      if (sort_by) {
        const [sortField, sortOrder] = sort_by.split('.');
        filteredResults.sort((a, b) => {
          let valueA = a[sortField] || 0;
          let valueB = b[sortField] || 0;
          return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
        });
      }

      return {
        ...trendingRes,
        results: filteredResults,
        total_results: filteredResults.length,
        total_pages: Math.ceil(filteredResults.length / 20)
      };
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    staleTime: 300000
  });

  // Update filters when URL changes
  useEffect(() => {
    if (location.search) {
      queryClient.invalidateQueries(['trending']);
    }
  }, [location.search]);

  // ... existing code until the filter section ...

  return (
    <>
      <SEO 
        title="Trending Now"
        description="Watch what's trending right now on Playex. Stay updated with the most popular movies and TV shows."
        url={window.location.href}
        type="website"
      />
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative -mx-4 mb-8"
        >
          <div className="relative h-[40vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-gray-900/50 to-transparent" />
            </div>

            <div className="container relative mx-auto px-4 h-full flex items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl"
              >
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-6 backdrop-blur-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                  </span>
                  <span className="text-[#82BC87] font-medium">What's Hot</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Trending
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                    Right Now
                  </span>
                </h1>

                {/* Enhanced Time Window Selector */}
                <div className="inline-flex p-1 bg-gray-800/50 backdrop-blur-sm rounded-xl">
                  {[
                    { value: 'day', label: 'Today' },
                    { value: 'week', label: 'This Week' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setTimeWindow(value)}
                      className={`relative px-6 py-2 rounded-lg font-medium transition-all duration-500 ${
                        timeWindow === value 
                          ? 'text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {timeWindow === value && (
                        <motion.div
                          layoutId="timeWindow"
                          className="absolute inset-0 bg-gradient-to-r from-[#82BC87] to-[#6da972] rounded-lg"
                          transition={{ type: "spring", duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="container mx-auto px-4 -mt-20 relative z-30">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Empty div to maintain spacing */}
            </div>

            <div className="flex items-center gap-3">
              <FilterPanel mediaType="all" />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
          >
            {/* Results Counter */}
            {trendingData && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20 mb-6 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-400">
                  Found <span className="text-[#82BC87] font-medium">{trendingData.pages[0].total_results.toLocaleString()}</span> trending items
                </span>
              </div>
            )}

            {/* Grid Section */}
            <MediaGrid 
              items={trendingData?.pages.flatMap(page => page.results)} 
              loading={isLoading} 
              error={error}
            />

            {/* Enhanced Pagination */}
            {trendingData && trendingData.pages[0].total_pages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={trendingData.pages[0].total_pages > 500 ? 500 : trendingData.pages[0].total_pages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TrendingPage;