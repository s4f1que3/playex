import { useSearchParams } from 'react-router-dom';

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    sort_by: searchParams.get('sort_by') || 'popularity.desc',
    primary_release_year: searchParams.get('primary_release_year') || '',
    with_genres: searchParams.get('with_genres') 
      ? searchParams.get('with_genres').split(',').map(Number) 
      : []
  };

  const updateFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
        updatedParams.delete(key);
      } else if (Array.isArray(value)) {
        updatedParams.set(key, value.join(','));
      } else {
        updatedParams.set(key, value);
      }
    });

    setSearchParams(updatedParams);
  };

  return { filters, updateFilters };
};
