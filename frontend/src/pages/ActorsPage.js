// File: frontend/src/pages/ActorsPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import ActorsFilters from '../components/media/ActorsFilter';
import Pagination from '../components/common/Pagnation';

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Actors</h1>
      </div>
      
      <ActorsFilters 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
      
      <MediaGrid 
        items={data?.results?.map(actor => ({...actor, media_type: 'person'}))} 
        loading={isLoading} 
        error={error}
        mediaType="person"
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

export default ActorsPage;