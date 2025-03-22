import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdFromSlug } from '../utils/slugify';
import { tmdbApi } from '../utils/api';

export const useSlugResolver = (type, slug) => {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const resolveSlug = async () => {
      // First try to get ID from local storage
      const storedId = getIdFromSlug(type, slug);
      if (storedId) {
        setId(storedId);
        setLoading(false);
        return;
      }

      // If not found, search the API
      try {
        const searchTerm = slug.replace(/-/g, ' ');
        const response = await tmdbApi.get(`/search/${type}`, {
          params: { query: searchTerm }
        });

        const result = response.data.results[0];
        if (result) {
          setId(result.id);
          setLoading(false);
        } else {
          navigate('/not-found');
        }
      } catch (error) {
        console.error('Failed to resolve slug:', error);
        navigate('/not-found');
      }
    };

    resolveSlug();
  }, [type, slug, navigate]);

  return { id, loading };
};
