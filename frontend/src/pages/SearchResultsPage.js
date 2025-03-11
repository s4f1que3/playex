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
  
  const [page, setPage] = useState(initialPage);
  
  // Update URL when page changes
  useEffect(() => {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      
      if (page > 1) {
        params.set('page', page.toString());
      }
      
      navigate(`/search?${params.toString()}`, { replace: true });
    }
  }, [page, searchQuery, navigate]);
  
  // Redirect to home if no search query
  useEffect(() => {
    if (!searchQuery) {
      navigate('/');
    }
  }, [searchQuery, navigate]);
  
  // Fetch search results
  const { data, isLoading, error } = useQuery(
    ['search', searchQuery, page],
    () => tmdbApi.get('/search/multi', {
      params: {
        query: searchQuery,
        page
      }
    }).then(res => res.data),
    {
      enabled: !!searchQuery,
      keepPreviousData: true,
      staleTime: 300000 // 5 minutes
    }
  );
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  // Filter out person results and other non-movie/tv results
  const filteredResults = data?.results?.filter(
    item => item.media_type === 'movie' || item.media_type === 'tv'
  );
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Search Results for "{searchQuery}"
        </h1>
        <p className="text-gray-400 mt-2">
          {data?.total_results 
            ? `Found ${data.total_results} results` 
            : isLoading 
              ? 'Searching...' 
              : 'No results found'}
        </p>
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