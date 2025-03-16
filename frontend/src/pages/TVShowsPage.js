// File: frontend/src/pages/TVShowsPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import MediaFilters from '../components/media/MediaFilters';
import Pagination from '../components/common/Pagnation';
import FilterPanel from '../components/common/FilterPanel';

const TVShowsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Get filter values from URL query params
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const initialFilters = {
    sort_by: queryParams.get('sort_by') || 'popularity.desc',
    with_genres: queryParams.get('with_genres') ? queryParams.get('with_genres').split(',').map(Number) : [],
    first_air_date_year: queryParams.get('first_air_date_year') || ''
  };
  
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);
  
  // Update URL when filters or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    if (filters.sort_by && filters.sort_by !== 'popularity.desc') {
      params.set('sort_by', filters.sort_by);
    }
    
    if (filters.with_genres && filters.with_genres.length > 0) {
      params.set('with_genres', filters.with_genres.toString());
    }
    
    if (filters.first_air_date_year) {
      params.set('first_air_date_year', filters.first_air_date_year);
    }
    
    const queryString = params.toString();
    navigate(`/tv-shows${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [page, filters, navigate]);
  
  // Fetch TV shows with current filters
const { data, isLoading, error } = useQuery({
  queryKey: ['discoverTVShows', page, filters],
  queryFn: () => {
    // Convert filters object to API params
    const params = {
      page,
      sort_by: filters.sort_by || 'popularity.desc',
      'vote_count.gte': 100,
      include_null_first_air_dates: false,
      with_genres: filters.with_genres?.length > 0 ? filters.with_genres.join(',') : undefined,
      first_air_date_year: filters.first_air_date_year || undefined
    };

    // For vote average sorting, ensure we have a minimum threshold
    if (filters.sort_by === 'vote_average.desc') {
      params['vote_count.gte'] = 200;
    }
    
    return tmdbApi.get('/discover/tv', { params }).then(res => res.data);
  },
  keepPreviousData: false, // Changed to false to ensure fresh data on filter change
  staleTime: 300000
});
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  // Add scroll to top functionality
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative -mx-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[40vh] md:h-[50vh] flex items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616] z-20" />
          <div className="absolute inset-0 bg-[#161616]">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] animate-pulse transform rotate-45 scale-150" />
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
                <span className="text-[#82BC87] font-medium">Browse TV Shows</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Discover
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                  TV Series
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                From binge-worthy series to critically acclaimed shows, explore our collection of TV series across all genres.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Empty div to maintain spacing */}
          </div>

          <div className="flex items-center gap-3">
            <FilterPanel mediaType="tv" />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
        >
          {/* Results Counter */}
          <motion.div 
            layout
            className="flex flex-wrap items-center gap-4"
          >
            {data && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
                <span className="text-gray-400">
                  Found <span className="text-[#82BC87] font-medium">{data.total_results.toLocaleString()}</span> TV shows
                </span>
              </div>
            )}
          </motion.div>

          {/* Enhanced Grid Section */}
          <motion.div 
            layout
            className="mt-8"
          >
            <MediaGrid 
              items={data?.results?.map(item => ({ ...item, media_type: 'tv' }))}
              loading={isLoading} 
              error={error}
              showType={false}
            />
          </motion.div>

          {/* Enhanced Pagination */}
          {data && data.total_pages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 mb-8"
            >
              <Pagination
                currentPage={page}
                totalPages={data.total_pages > 500 ? 500 : data.total_pages}
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
    </div>
  );
};

export default TVShowsPage;