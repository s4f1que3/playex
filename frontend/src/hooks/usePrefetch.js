import { useEffect } from 'react';
import { api, tmdbApi } from '../utils/api';

export const usePrefetch = (links) => {
  useEffect(() => {
    const prefetchLink = async (link) => {
      try {
        // Handle different types of links
        if (link.startsWith('/movie/') || link.startsWith('/tv/')) {
          const [, type, id] = link.split('/');
          await tmdbApi.get(`/${type}/${id}`);
        } else {
          await api.fetch(link);
        }
      } catch (error) {
        console.error('Prefetch error:', error);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const href = entry.target.getAttribute('href');
          if (href) prefetchLink(href);
        }
      });
    });

    // Observe all links
    const linkElements = document.querySelectorAll('a[href^="/"]');
    linkElements.forEach(link => observer.observe(link));

    return () => observer.disconnect();
  }, [links]);
};
