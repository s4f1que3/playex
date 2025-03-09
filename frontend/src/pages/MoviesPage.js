// File: frontend/src/pages/MoviesPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import MediaFilters from '../components/media/MediaFilters';
import Pagination from '../components/common/Pagnation';

const MoviesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Get filter values from URL query params
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const initialFilters = {
    sort_by: queryParams.get('sort_by') || 'popularity.desc',
    with_genres: queryParams.get('with_genres') ? queryParams.get('with_genres').split(',').map(Number) : [],
    primary_release_year: queryParams.get('primary_release_year') || ''
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
    
    if (filters.primary_release_year) {
      params.set('primary_release_year', filters.primary_release_year);
    }
    
    const queryString = params.toString();
    navigate(`/movies${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [page, filters, navigate]);
  
  // Fetch movies with current filters
  const { data, isLoading, error } = useQuery(
    ['discoverMovies', page, filters],
    () => {
      // Convert filters object to API params
      const params = {
        page,
        sort_by: filters.sort_by || 'popularity.desc'
      };
      
      if (filters.with_genres) {
        params.with_genres = Array.isArray(filters.with_genres) 
          ? filters.with_genres.join(',') 
          : filters.with_genres;
      }
      
      if (filters.primary_release_year) {
        params.primary_release_year = filters.primary_release_year;
      }
      
      return tmdbApi.get('/discover/movie', { params }).then(res => res.data);
    },
    {
      keepPreviousData: true,
      staleTime: 300000 // 5 minutes
    }
  );
  
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
        <h1 className="text-3xl font-bold text-white">Movies</h1>
      </div>
      
      <MediaFilters 
        mediaType="movie" 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
      
      <MediaGrid 
        items={data?.results} 
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

export default MoviesPage;