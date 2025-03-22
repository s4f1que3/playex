import { useState, useEffect } from 'react';
import { tmdbApi } from '../utils/api';

export const useCollectionResolver = (slug) => {
  const [data, setData] = useState({ id: null, loading: true, error: null });

  useEffect(() => {
    const resolveCollection = async () => {
      try {
        // First try to get ID from the slug if it's numeric
        const numericId = parseInt(slug);
        if (!isNaN(numericId)) {
          setData({ id: numericId, loading: false, error: null });
          return;
        }

        // If slug is text, search for the collection
        const searchQuery = slug.split('-').join(' ');
        const response = await tmdbApi.get('/search/collection', {
          params: {
            query: searchQuery,
            include_adult: false,
          }
        });

        if (response.data.results && response.data.results.length > 0) {
          setData({ id: response.data.results[0].id, loading: false, error: null });
        } else {
          setData({ id: null, loading: false, error: 'Collection not found' });
        }
      } catch (error) {
        setData({ id: null, loading: false, error: error.message });
      }
    };

    if (slug) {
      resolveCollection();
    }
  }, [slug]);

  return data;
};
