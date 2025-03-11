// File: frontend/src/components/common/Breadcrumbs.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../utils/api';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  // Fetch media title for movie or TV show pages
  const mediaType = pathnames[0] === 'movie' || pathnames[0] === 'tv' ? pathnames[0] : null;
  const mediaId = mediaType && pathnames[1];

  const { data: mediaDetails } = useQuery(
    ['mediaDetails', mediaType, mediaId],
    () => tmdbApi.get(`/${mediaType}/${mediaId}`).then(res => res.data),
    {
      enabled: !!mediaType && !!mediaId, // This controls when the query executes
      staleTime: 300000 // 5 minutes
    }
  );
  
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
      case 'watch-history':
        return 'Watch History';
      case 'movie':
        return 'Movie';
      case 'tv':
        return 'TV Show';
      case 'player':
        return 'Player';
      default:
        return pathname;
    }
  };
  
  // Generate proper routes for breadcrumb navigation
  const getProperRoute = (pathname, index, pathnames) => {
    // Special handling for player routes
    if (pathname === 'player') {
      return '/'; // Redirect to home since we don't have a dedicated player page
    }
    
    // For movie/tv in player path, redirect to the media details page
    if ((pathname === 'movie' || pathname === 'tv') && pathnames[0] === 'player') {
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
    
    // For movie/tv as first segment, this is already correct
    if ((pathname === 'movie' || pathname === 'tv') && index === 0) {
      return `/${pathname}/${pathnames[1]}`;
    }
    
    // Special case for movies and tv-shows pages
    if (pathname === 'movies') {
      return '/movies';
    }
    
    if (pathname === 'tv-shows') {
      return '/tv-shows';
    }
    
    // Default behavior for other routes
    return `/${pathnames.slice(0, index + 1).join('/')}`;
  };
  
  return (
    <div className="bg-[#161616] pt-[72px]"> {/* Add padding to account for fixed header */}
      <div className="container mx-auto px-4 py-2">
        <nav className="flex text-sm">
          <Link to="/" className="text-[#82BC87] hover:text-[#E4D981] transition duration-300">
            Home
          </Link>
          
          {pathnames.map((pathname, index) => {
            const isLast = index === pathnames.length - 1;
            
            // Special case for media details pages
            if ((pathname === mediaId) && mediaDetails) {
              return (
                <React.Fragment key={pathname}>
                  <span className="mx-2 text-gray-500">/</span>
                  <span className="text-gray-300">
                    {mediaDetails.title || mediaDetails.name}
                  </span>
                </React.Fragment>
              );
            }
            
            // Handle season/episode for player
            if (pathname.match(/^\d+$/) && (pathnames[index - 1] === 'season' || pathnames[index - 2] === 'tv')) {
              const label = pathnames[index - 1] === 'season' ? `Episode ${pathname}` : `Season ${pathname}`;
              return (
                <React.Fragment key={pathname}>
                  <span className="mx-2 text-gray-500">/</span>
                  <span className="text-gray-300">{label}</span>
                </React.Fragment>
              );
            }
            
            // Skip redundant segments
            if (pathname === 'season' || (pathname === mediaId && !mediaDetails)) {
              return null;
            }
            
            return (
              <React.Fragment key={pathname}>
                <span className="mx-2 text-gray-500">/</span>
                {isLast ? (
                  <span className="text-gray-300">
                    {getPathName(pathname)}
                  </span>
                ) : (
                  <Link
                    to={getProperRoute(pathname, index, pathnames)}
                    className="text-[#82BC87] hover:text-[#E4D981] transition duration-300"
                  >
                    {getPathName(pathname)}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;