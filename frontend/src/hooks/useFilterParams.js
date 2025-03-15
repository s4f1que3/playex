import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = useCallback((key, value) => {
    setSearchParams(prev => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        prev.delete(key);
      } else {
        prev.set(key, Array.isArray(value) ? value.join(',') : value);
      }
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const getFilter = useCallback((key) => {
    const value = searchParams.get(key);
    if (!value) return key === 'genres' ? [] : '';
    return key === 'genres' ? value.split(',').map(Number) : value;
  }, [searchParams]);

  return { updateFilter, getFilter };
};
