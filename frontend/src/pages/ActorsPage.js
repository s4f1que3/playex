// File: frontend/src/pages/ActorsPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import ActorsFilters from '../components/media/ActorsFilter';
import Pagination from '../components/common/Pagnation';
import { motion } from 'framer-motion';
import { actorCardStyles } from '../styles/actorStyles';
import ActorsGrid from '../components/actors/ActorsGrid';

const ActorsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Get filter values from URL query params
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const initialFilters = {
    sort_by: queryParams.get('sort_by') || 'popularity.desc',
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
    
    const queryString = params.toString();
    navigate(`/actors${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [page, filters, navigate]);
  
  // Fetch actors with current filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['popularActors', page, filters],
    queryFn: () => {
      // The TMDB API doesn't have a lot of filtering options for people
      // So we're mainly using the popular person endpoint with pagination
      return tmdbApi.get('/person/popular', { 
        params: {
          page,
          // TMDB API doesn't support sorting for people, but we're keeping 
          // the filter structure for consistency
        }
      }).then(res => res.data);
    },
    keepPreviousData: true,
    staleTime: 300000 // 5 minutes
  });
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative -mx-4 mb-8 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[50vh] md:h-[60vh] flex items-center bg-gradient-to-br from-[#161616] to-gray-900"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] animate-pulse transform rotate-45 scale-150" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="container relative z-30 mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-8 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                </span>
                <span className="text-[#82BC87] font-medium tracking-wide">Discover Talent</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                Explore Hollywood's
                <span className="block mt-2 bg-gradient-to-r from-[#82BC87] to-[#E4D981] bg-clip-text text-transparent">
                  Finest Talents
                </span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                From legendary performers to rising stars, discover detailed profiles, filmographies, and more.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Content Section */}
      <div className="container mx-auto px-4 -mt-32 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-2xl"
        >
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Popular Actors
              </h2>
              {data && (
                <div className="px-4 py-2 rounded-xl bg-black/20 backdrop-blur-sm">
                  <span className="text-gray-400">
                    Found <span className="text-[#82BC87] font-medium">{data.total_results.toLocaleString()}</span> actors
                  </span>
                </div>
              )}
            </div>
            <ActorsFilters 
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Grid Section */}
          <ActorsGrid 
            actors={data?.results} 
            loading={isLoading}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <div className="bg-black/80 p-6 rounded-2xl flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-300">Loading actors...</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Enhanced Pagination */}
        {data && data.total_pages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 mb-8"
          >
            <Pagination
              currentPage={page}
              totalPages={data.total_pages > 500 ? 500 : data.total_pages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group hover:-translate-y-1"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
};

export default ActorsPage;