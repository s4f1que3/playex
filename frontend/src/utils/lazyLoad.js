import { lazy } from 'react';

export const lazyLoadRoute = (importFn, chunkName = '') => {
  return lazy(() => {
    // Add custom retry logic
    const retryImport = () => 
      importFn().catch(error => {
        // Only retry on chunk load errors
        if (error.name === 'ChunkLoadError') {
          return retryImport();
        }
        throw error;
      });

    return retryImport().then(module => {
      // Add performance marking for monitoring
      performance.mark(`route-loaded-${chunkName}`);
      return module;
    });
  });
};

export const routeConfig = {
  // Main routes
  home: () => import(/* webpackChunkName: "home" */ '../pages/HomePage'),
  movies: () => import(/* webpackChunkName: "movies" */ '../pages/MoviesPage'),
  tvShows: () => import(/* webpackChunkName: "tv" */ '../pages/TVShowsPage'),
  trending: () => import(/* webpackChunkName: "trending" */ '../pages/TrendingPage'),

  // Media related
  mediaDetails: () => import(/* webpackChunkName: "media-details" */ '../pages/MediaDetailsPage'),
  player: () => import(/* webpackChunkName: "player" */ '../pages/PlayerPage'),
  episodes: () => import(/* webpackChunkName: "episodes" */ '../pages/EpisodesPage'),

  // Discovery features
  search: () => import(/* webpackChunkName: "search" */ '../pages/SearchResultsPage'),
  collections: () => import(/* webpackChunkName: "collections" */ '../pages/CollectionsPage'),
  collectionsIndex: () => import(/* webpackChunkName: "collections-index" */ '../pages/CollectionsIndexPage'),
  fanFavorites: () => import(/* webpackChunkName: "fan-favorites" */ '../pages/FanFavoritesPage'),

  // User features
  watchlist: () => import(/* webpackChunkName: "user-lists" */ '../pages/WatchListPage'),
  favorites: () => import(/* webpackChunkName: "user-lists" */ '../pages/FavoritesPage'),
  continueWatching: () => import(/* webpackChunkName: "continue-watching" */ '../pages/ContinueWatchingPage'),

  // Actor routes
  actorProfile: () => import(/* webpackChunkName: "actor" */ '../pages/ActorsPersonal'),
  actorCredits: () => import(/* webpackChunkName: "actor-credits" */ '../pages/ActorCreditsPage'),

  // Error pages
  notFound: () => import(/* webpackChunkName: "error" */ '../pages/NotFoundPage'),
  
  // Component chunks
  mediaGrid: () => import(/* webpackChunkName: "media-components" */ '../components/media/MediaGrid'),
  mediaCarousel: () => import(/* webpackChunkName: "media-components" */ '../components/media/MediaCarousel'),
  mediaActions: () => import(/* webpackChunkName: "media-components" */ '../components/media/MediaActions')
};
