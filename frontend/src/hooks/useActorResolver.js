import { useState, useEffect } from 'react';
import { tmdbApi } from '../utils/api';

export const useActorResolver = (slug) => {
  const [data, setData] = useState({ id: null, loading: true, error: null });

  useEffect(() => {
    const resolveActor = async () => {
      try {
        // First check if the slug ends with a numeric ID
        const matches = slug.match(/-(\d+)$/);
        if (matches) {
          const id = parseInt(matches[1]);
          setData({ id, loading: false, error: null });
          return;
        }

        // If no ID in slug, search by name
        const searchQuery = slug.split('-').join(' ');
        const response = await tmdbApi.get('/search/person', {
          params: {
            query: searchQuery,
            include_adult: false,
          }
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
