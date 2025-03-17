import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const useFilterParams = (initialFilters = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    // Initialize filters from URL params
    const params = Object.fromEntries(searchParams.entries());
    return {
      ...initialFilters,
      ...params,
      with_genres: params.with_genres ? params.with_genres.split(',').map(Number) : initialFilters.with_genres || [],
      primary_release_year: params.primary_release_year || initialFilters.primary_release_year || '',
      sort_by: params.sort_by || initialFilters.sort_by || 'popularity.desc'
    };
  });

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            newParams.set(key, value.join(','));
          }
        } else {
          newParams.set(key, value);
        }
      }
    });
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  // Update filters when URL params change
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters(current => ({
      ...current,
      ...params,
      with_genres: params.with_genres ? params.with_genres.split(',').map(Number) : current.with_genres,
      primary_release_year: params.primary_release_year || current.primary_release_year,
      sort_by: params.sort_by || current.sort_by
    }));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return [filters, updateFilter];
};

// Change to named export
export { useFilterParams };
