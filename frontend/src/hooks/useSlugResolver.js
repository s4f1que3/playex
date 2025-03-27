import { useState, useEffect } from 'react';
import { parseMediaUrl } from '../utils/slugify';

export const useSlugResolver = (mediaType, slug) => {
  const [state, setState] = useState({
    id: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!slug) {
      setState({ id: null, loading: false, error: 'No slug provided' });
      return;
    }

    try {
      const { id } = parseMediaUrl(slug);
      setState({ id, loading: false, error: null });
    } catch (error) {
      setState({ id: null, loading: false, error: 'Invalid slug format' });
    }
  }, [slug]);

  return state;
};
