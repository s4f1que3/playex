import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMediaPrefetch } from '../../hooks/useMediaPrefetch';

const PrefetchMediaLink = ({ 
  to, 
  children, 
  mediaType, 
  tmdbId, 
  season, 
  episode, 
  playerType = 'vidlink',
  ...props 
}) => {
  const prefetchUrl = useMediaPrefetch(playerType, mediaType, tmdbId, season, episode);

  const handleMouseEnter = () => {
    if (prefetchUrl) {
      // Preconnect to media source
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = new URL(prefetchUrl).origin;
      document.head.appendChild(link);

      // Prefetch the iframe source
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'prefetch';
      preloadLink.as = 'document';
      preloadLink.href = prefetchUrl;
      document.head.appendChild(preloadLink);

      // Clean up after 5 seconds
      setTimeout(() => {
        document.head.removeChild(link);
        document.head.removeChild(preloadLink);
      }, 5000);
    }
  };

  return (
    <Link 
      to={to} 
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PrefetchMediaLink;
