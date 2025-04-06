import { routeConfig } from './lazyLoad';

export const prefetchRoutes = {
  // Define route relationships for prefetching
  home: ['movies', 'tvShows', 'trending'],
  movies: ['mediaDetails', 'collections'],
  tvShows: ['mediaDetails', 'episodes'],
  mediaDetails: ['player', 'similar', 'recommended'],
  search: ['mediaDetails'],
  collections: ['mediaDetails', 'collectionsIndex'],
  trending: ['mediaDetails', 'fanFavorites'],
  actor: ['actorCredits']
};

export const prefetchRoute = async (routeName) => {
  if (routeConfig[routeName]) {
    try {
      // Start prefetch
      const modulePromise = routeConfig[routeName]();
      
      // Add to preload cache
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'script';
      link.href = `/${routeName}.chunk.js`;
      document.head.appendChild(link);
      
      // Actual prefetch
      await modulePromise;
      
      // Prefetch related routes
      if (prefetchRoutes[routeName]) {
        prefetchRoutes[routeName].forEach(relatedRoute => {
          prefetchRoute(relatedRoute);
        });
      }
    } catch (error) {
      console.warn(`Failed to prefetch route: ${routeName}`, error);
    }
  }
};

export const prefetchInitialData = async () => {
  try {
    // Most commonly accessed routes
    const initialRoutes = ['home', 'movies', 'tvShows', 'trending', 'collections'];
    
    // Prefetch all initial routes in parallel
    await Promise.all(
      initialRoutes.map(route => prefetchRoute(route))
    );
  } catch (error) {
    console.error('Error prefetching initial data:', error);
  }
};
