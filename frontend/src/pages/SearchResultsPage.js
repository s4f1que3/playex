// File: frontend/src/pages/SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const searchQuery = queryParams.get('q') || '';
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const initialMediaType = queryParams.get('media_type') || 'all';
  
  const [page, setPage] = useState(initialPage);
  const [mediaType, setMediaType] = useState(initialMediaType);
  
  // Update URL when page or filter changes
  useEffect(() => {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      
      if (page > 1) {
        params.set('page', page.toString());
      }
      
      if (mediaType !== 'all') {
        params.set('media_type', mediaType);
      }
      
      navigate(`/search?${params.toString()}`, { replace: true });
    }
  }, [page, searchQuery, mediaType, navigate]);
  
  // Redirect to home if no search query
  useEffect(() => {
    if (!searchQuery) {
      navigate('/');
    }
  }, [searchQuery, navigate]);
  
  // Fetch search results
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery, page, mediaType],
    queryFn: () => {
      // If specific media type is selected, use that endpoint
      if (mediaType !== 'all' && mediaType !== 'person') {
        return tmdbApi.get(`/search/${mediaType}`, {
          params: { query: searchQuery, page }
        }).then(res => res.data);
      } 
      else if (mediaType === 'person') {
        return tmdbApi.get('/search/person', {
          params: { query: searchQuery, page }
        }).then(res => {
          // Format person results to match multi search
          return {
            ...res.data,
            results: res.data.results.map(person => ({
              ...person,
              media_type: 'person'
            }))
          };
        });
      }
      // Otherwise use multi search
      return tmdbApi.get('/search/multi', {
        params: { query: searchQuery, page }
      }).then(res => res.data);
    },
    enabled: !!searchQuery,
    keepPreviousData: true,
    staleTime: 300000 // 5 minutes
  });
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };
  
  // Filter results based on media type if using multi search
  const filteredResults = data?.results?.filter(item => {
    if (mediaType === 'all') {
      return ['movie', 'tv', 'person'].includes(item.media_type);
    }
    return item.media_type === mediaType;
  });
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Search Info */}
      <div className="relative mb-8 bg-gradient-to-b from-gray-900/80 to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Results for "{searchQuery}"
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400">Searching...</span>
                  </div>
                ) : (
                  <span className="text-gray-400">
                    {data?.total_results 
                      ? <span>Found <strong className="text-[#82BC87] font-medium">{data.total_results}</strong> results</span>
                      : 'No results found'}
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Filter Dropdown */}
            <div className="relative group">
              <select
                value={mediaType}
                onChange={handleMediaTypeChange}
                className="appearance-none bg-gray-800/60 backdrop-blur-sm text-white border border-white/5 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#82BC87]/50 hover:bg-gray-700/60 transition-all duration-300"
              >
                <option value="all">All Content</option>
                <option value="movie">Movies Only</option>
                <option value="tv">TV Shows Only</option>
                <option value="person">Actors Only</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#82BC87] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid with Enhanced Animation */}
      <div className="container mx-auto px-4">
        <div className="relative">
          <MediaGrid 
            items={filteredResults} 
            loading={isLoading} 
            error={error}
            className="animate-fadeIn"
          />
          
          {/* Elegant Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-900/95 p-6 rounded-2xl shadow-xl border border-white/5 flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300 animate-pulse">Loading results...</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {data && data.total_pages > 1 && (
          <div className="mt-12 mb-8">
            <Pagination
              currentPage={page}
              totalPages={data.total_pages > 500 ? 500 : data.total_pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* No Results State */}
        {!isLoading && (!data?.results || data.results.length === 0) && (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto mb-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl text-gray-400 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search term or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;