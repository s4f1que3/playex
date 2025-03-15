// File: frontend/src/pages/TVShowsPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import MediaFilters from '../components/media/MediaFilters';
import Pagination from '../components/common/Pagnation';

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
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">TV Shows</h1>
      </div>
      
      <MediaFilters 
        mediaType="tv" 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
      
      <MediaGrid 
        items={data?.results?.map(item => ({ ...item, media_type: 'tv' }))} 
        loading={isLoading} 
        error={error}
        showType={false}
      />
      
      {data && (
        <Pagination
          currentPage={page}
          totalPages={data.total_pages > 500 ? 500 : data.total_pages} // API limits to 500 pages
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TVShowsPage;