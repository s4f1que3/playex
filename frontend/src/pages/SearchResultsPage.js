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
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Search Results for "{searchQuery}"
        </h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-400">
            {data?.total_results 
              ? `Found ${data.total_results} results` 
              : isLoading 
                ? 'Searching...' 
                : 'No results found'}
          </p>
          
          {/* Media type filter */}
          <div>
            <select
              value={mediaType}
              onChange={handleMediaTypeChange}
              className="bg-[#1F1F1F] text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#82BC87]"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
              <option value="person">Actors</option>
            </select>
          </div>
        </div>
      </div>
      
      <MediaGrid 
        items={filteredResults} 
        loading={isLoading} 
        error={error}
      />
      
      {data && data.total_pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.total_pages > 500 ? 500 : data.total_pages} // API limits to 500 pages
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;