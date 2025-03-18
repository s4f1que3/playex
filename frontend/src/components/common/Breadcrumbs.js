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
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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

  // Fetch media title for movie, TV show, or actor pages
  const mediaType = ['movie', 'tv', 'actor'].includes(pathnames[0]) ? pathnames[0] : null;
  const mediaId = mediaType && pathnames[1];

  const { data: mediaDetails } = useQuery({
    queryKey: ['mediaDetails', mediaType, mediaId],
    queryFn: () => {
      // For actor details, use the person endpoint
      const endpoint = mediaType === 'actor' ? 'person' : mediaType;
      return tmdbApi.get(`/${endpoint}/${mediaId}`).then(res => res.data);
    },
    enabled: !!mediaType && !!mediaId,
    staleTime: 300000 // 5 minutes
  });
  
  // Skip rendering breadcrumbs on home page or auth pages
  if (
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password'
  ) {
    return null;
  }
  
  // Map path segments to readable names
  const getPathName = (pathname) => {
    switch (pathname) {
      case 'movies':
        return 'Movies';
      case 'tv-shows':
        return 'TV Shows';
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
      default:
        return pathname;
    }
  };
  
  // Generate proper routes for breadcrumb navigation
  const getProperRoute = (pathname, index, pathnames) => {
    // Add debug console log
    console.log('Debug:', {
      pathname,
      index,
      pathnames,
      condition: {
        isPlayer: pathnames[0] === 'player',
        isTv: pathnames[1] === 'tv',
        isNumber: /^\d+$/.test(pathname),
        isIndex4: index === 4,
        fullPath: pathnames.join('/')
      }
    });

    // Update the condition to correctly identify the season number
    if (
      pathnames[0] === 'player' && 
      pathnames[1] === 'tv' && 
      /^\d+$/.test(pathname) &&
      index === 3  // Changed from 4 to 3 since season number is at index 3 in player/tv/[id]/[season]/[episode]
    ) {
      const showId = pathnames[2];
      const seasonNumber = pathname;
      return `/tv/${showId}/episodes/${seasonNumber}`;
    }

    // Special handling for player routes
    if (pathname === 'player') {
      return '/'; // Redirect to home since we don't have a dedicated player page
    }
    
    // For movie/tv/actor in player path, redirect to the media details page
    if ((pathname === 'movie' || pathname === 'tv' || pathname === 'actor') && pathnames[0] === 'player') {
      const mediaId = pathnames[2];
      return `/${pathname}/${mediaId}`;
    }

    // Handle numeric IDs in player/tv paths (this is the TV show ID)
    if (
       pathnames[0] === 'player' && 
       pathnames[1] === 'tv' && 
        /^\d+$/.test(pathname) &&
       index === 2 // This is the TV show ID position
     ) {
         return `/tv/${pathname}`;
       }
    
    // Update this specific section for season numbers in player paths
    if (
      pathnames[0] === 'player' && 
      pathnames[1] === 'tv' && 
      /^\d+$/.test(pathname) &&
      index === 4  // This matches the season number position
    ) {
      const showId = pathnames[2];
      const seasonNumber = pathname;
      return `/tv/${showId}/episodes/${seasonNumber}`; // Ensure correct URL format
    }

    // For movie/tv/actor as first segment, this is already correct
    if ((pathname === 'movie' || pathname === 'tv' || pathname === 'actor') && index === 0) {
      return `/${pathname}/${pathnames[1]}`;
    }
    
    // Special case for movies, tv-shows, and actors pages
    if (pathname === 'movies') {
      return '/movies';
    }
    
    if (pathname === 'tv-shows') {
      return '/tv-shows';
    }
    
    if (pathname === 'actors') {
      return '/actors';
    }
    
    // Add this case for episodes page
    if (pathname === 'episodes' && pathnames[index - 2] === 'tv') {
      const showId = pathnames[index - 1];
      const season = pathnames[index + 1];
      return `/tv/${showId}/episodes/${season}`;
    }
    
    if (pathname === 'collection' && index === 0) {
      return '/collections'; // When clicking "collection" in breadcrumb, go to collections page
    }
    
    if (pathname === 'collections') {
      return '/collections';
    }
    
    // Default behavior for other routes
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

            // Special case for media details pages
            if ((pathname === mediaId) && mediaDetails) {
              return (
                <BreadcrumbItem key={pathname} to={path} isLast={isLast}>
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

            // Skip redundant segments
            if (pathname === 'season' || (pathname === mediaId && !mediaDetails)) {
              return null;
            }

            return (
              <BreadcrumbItem key={pathname} to={path} isLast={isLast}>
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