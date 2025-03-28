import { useState, useEffect } from 'react';
import { tmdbApi } from '../utils/api';

export const useActorResolver = (slug) => {
  const [data, setData] = useState({ id: null, loading: true, error: null });

  useEffect(() => {
    const resolveActor = async () => {
      try {
        // Check for ID at start of slug (12835-vin-diesel format)
        const startIdMatch = slug.match(/^(\d+)-/);
        if (startIdMatch) {
          setData({ id: parseInt(startIdMatch[1]), loading: false, error: null });
          return;
        }
        
        // Handle name-only format (vin-diesel format)
        const searchQuery = slug.split('-').join(' ');
        const response = await tmdbApi.get('/search/person', {
          params: { query: searchQuery }
        });

        if (response.data.results && response.data.results.length > 0) {
          setData({ id: response.data.results[0].id, loading: false, error: null });
        } else {
          setData({ id: null, loading: false, error: 'Actor not found' });
        }
      } catch (error) {
        setData({ id: null, loading: false, error: error.message });
      }
    };

    if (slug) {
      resolveActor();
    }
  }, [slug]);

  return data;
};
