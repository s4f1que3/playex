// File: frontend/src/components/common/Breadcrumbs.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi } from '../../utils/api';

const BreadcrumbItem = ({ children, to, isLast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center"
    >
      <motion.div
        whileHover={!isLast ? { scale: 1.05 } : {}}
        whileTap={!isLast ? { scale: 0.95 } : {}}
      >
        {!isLast ? (
          <Link
            to={to}
            className="group flex items-center px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 
                       backdrop-blur-sm border border-white/10 hover:border-[#82BC87]/20 transition-all duration-300"
          >
            {children}
            <div className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-[#82BC87]/10 border border-[#82BC87]/20 text-[#82BC87]">
            {children}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const mediaType = pathnames[0] === 'player' ? pathnames[1] : 
    ['movie', 'tv', 'actor'].includes(pathnames[0]) ? pathnames[0] : null;
  const mediaId = mediaType && (pathnames[0] === 'player' ? pathnames[2] : pathnames[1]);

  const { data: mediaDetails } = useQuery({
    queryKey: ['mediaDetails', mediaType, mediaId],
    queryFn: () => {
      const endpoint = mediaType === 'actor' ? 'person' : mediaType;
      return tmdbApi.get(`/${endpoint}/${mediaId}`).then(res => res.data);
    },
    enabled: !!mediaType && !!mediaId,
    staleTime: 300000
  });

  if (
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password'
  ) {
    return null;
  }
  
  const getPathName = (pathname) => {
    switch (pathname) {
      case 'movies':
        return mediaType === 'actor' ? 'Movie Appearances' : 'Movies';
      case 'tv':
        return mediaType === 'actor' ? 'TV Show Appearances' : 'TV Shows';
      case 'actors':
        return 'Actors';
      case 'trending':
        return 'Trending';
      case 'search':
        return 'Search Results';
      case 'profile':
        return 'Profile';
      case 'watchlist':
        return 'Watchlist';
      case 'favorites':
        return 'Favorites';
      case 'movie':
        return 'Movie';
      case 'tv':
        return 'TV Show';
      case 'actor':
        return 'Actor';
      case 'player':
        return 'Player';
      case 'similar':
        return 'Similar Content';
      case 'recommended':
        return 'Recommended';
      case 'episodes':
        return 'Episodes';
      case 'collections':
        return 'Collections';
      case 'collection':
        return 'Collection';
      case 'airing-shows':
        return 'Airing Shows';
      default:
        return pathname.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
  };
  
  const getProperRoute = (pathname, index, pathnames) => {
    // Handle player routes
    if (pathnames[0] === 'player') {
      if (pathname === 'player') return null;
      
      // Handle TV shows route
      if (pathname === 'tv') return '/tv-shows';
      
      // Handle Movies route
      if (pathname === 'movie') return '/movies';
      
      // Handle media details page for both TV shows and Movies
      if ((pathname === mediaId) && mediaDetails) {
        const mediaType = pathnames[1]; // will be either 'tv' or 'movie'
        return `/${mediaType}/${mediaId}`;
      }
      
      // Handle episode numbers for TV shows and movies
      if (/^\d+$/.test(pathname) && index === 3) {
        const mediaType = pathnames[1];
        if (mediaType === 'tv') {
          return `/tv/${pathnames[2]}/episodes/${pathname}`;
        } else if (mediaType === 'movie') {
          return `/movie/${pathnames[2]}`;
        }
      }
    }

    // Handle direct media routes
    if ((pathname === 'movie' || pathname === 'tv') && index === 0) {
      return `/${pathname}/${pathnames[1]}`;
    }
    
    // Handle collection routes
    if (pathname === 'movies' || pathname === 'movie') {
      return '/movies';
    }
    
    if (pathname === 'tv-shows' || pathname === 'tv') {
      return '/tv-shows';
    }
    
    if (pathname === 'actors') {
      return '/actors';
    }
    
    // Handle episode routes
    if (pathname === 'episodes' && pathnames[index - 2] === 'tv') {
      const showId = pathnames[index - 1];
      const season = pathnames[index + 1];
      return `/tv/${showId}/episodes/${season}`;
    }
    
    // Handle collection routes
    if (pathname === 'collection' && index === 0) {
      return '/collections';
    }
    
    if (pathname === 'collections') {
      return '/collections';
    }
    
    // Handle actor routes
    if (pathnames[0] === 'actor' && (pathname === 'movies' || pathname === 'tv')) {
      const actorId = pathnames[1];
      return `/actor/${actorId}/${pathname}`;
    }
    
    return `/${pathnames.slice(0, index + 1).join('/')}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gray-900/90 backdrop-blur-xl border-b border-white/5 pt-[72px]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#82BC87]/5 to-transparent opacity-50" />
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#82BC87]/5 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-[#E4D981]/5 rounded-full filter blur-[100px] animate-pulse" />
      </div>

      <div className="container relative mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <BreadcrumbItem to="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-[#82BC87] hover:text-white transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </motion.div>
          </BreadcrumbItem>

          {pathnames.map((pathname, index) => {
            const isLast = index === pathnames.length - 1;
            const path = getProperRoute(pathname, index, pathnames);

            if (pathname === 'player') {
              return (
                <BreadcrumbItem key={pathname} to="#" isLast={false}>
                  <span className="text-sm font-medium" onClick={(e) => e.preventDefault()}>
                    {getPathName(pathname)}
                  </span>
                </BreadcrumbItem>
              );
            }

            // For both TV shows and movies in player path
            if (
              ((pathname === mediaId) && mediaDetails) ||
              (pathnames[0] === 'player' && index === 2 && mediaDetails)
            ) {
              return (
                <BreadcrumbItem key={`media-${pathname}`} to={path} isLast={isLast}>
                  <div className="flex items-center gap-2">
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-5 h-5 rounded-md object-cover"
                      src={`https://image.tmdb.org/t/p/w92${mediaDetails.poster_path}`}
                      alt=""
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <span className="text-sm font-medium">
                      {mediaDetails.title || mediaDetails.name}
                    </span>
                  </div>
                </BreadcrumbItem>
              );
            }

            // Skip elements we don't want to show
            if (
              pathname === 'season' || 
              (pathname === mediaId && !mediaDetails) ||
              (pathnames[0] === 'player' && /^\d+$/.test(pathname) && index === 2)
            ) {
              return null;
            }

            return (
              <BreadcrumbItem key={`path-${index}-${pathname}`} to={path} isLast={isLast}>
                <span className="text-sm font-medium">
                  {getPathName(pathname)}
                </span>
              </BreadcrumbItem>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Breadcrumbs;