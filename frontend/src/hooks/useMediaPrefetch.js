import { useState, useEffect } from 'react';

export const useMediaPrefetch = (playerType, mediaType, tmdbId, season, episode) => {
  const [prefetchUrl, setPrefetchUrl] = useState('');

  useEffect(() => {
    // Construct the prefetch URL based on player type
    let url = '';
    if (playerType === 'vidlink') {
      url = mediaType === 'movie'
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`;
    } else if (playerType === 'nova') {
      url = mediaType === 'movie'
        ? `https://player.videasy.net/movie/${tmdbId}`
        : `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`;
    } else if (playerType === 'star') {
      url = mediaType === 'movie'
        ? `https://vidfast.pro/movie/${tmdbId}`
        : `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}`;
    } else if (playerType === 'mapple') {
      url = mediaType === 'movie'
        ? `https://embed.su/embed/movie/${tmdbId}`
        : `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`;
    } else if (playerType === 'vidsrc') {
      url = mediaType === 'movie'
        ? `https://vidsrc-embed.su/embed/movie/${tmdbId}`
        : `https://vidsrc-embed.su/embed/tv/${tmdbId}/${season}/${episode}`;
    }
    setPrefetchUrl(url);
  }, [playerType, mediaType, tmdbId, season, episode]);

  return prefetchUrl;
};
