import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api, tmdbApi } from '../../utils/api';
import cacheManager from '../../utils/cacheManager';

const PrefetchLink = ({ to, children, className, prefetch = true, ...props }) => {
  const handlePrefetch = useCallback(async () => {
    if (!prefetch) return;

    try {
      // Check if already cached
      if (cacheManager.has(`prefetch_${to}`)) return;

      let data;
      if (to.startsWith('/movie/') || to.startsWith('/tv/')) {
        const [, type, id] = to.split('/');
        data = await tmdbApi.get(`/${type}/${id}`);
      } else {
        data = await api.get(to);
      }
      
      // Cache the prefetched data
      cacheManager.set(`prefetch_${to}`, data, 5 * 60 * 1000); // 5 minutes cache
    } catch (error) {
      console.error('Prefetch error:', error);
    }
  }, [to, prefetch]);

  return (
    <Link
      to={to}
      className={className}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PrefetchLink;
