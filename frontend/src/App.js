import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Utils and Services
import { lazyLoadRoute, routeConfig } from './utils/lazyLoad';
import { prefetchRoute, prefetchInitialData } from './utils/prefetchRoutes';
import { collectionService } from './services/collectionService';
import { categoryKeywords } from './constants/categoryKeywords';

// Contexts and Hooks
import { AuthProvider } from './contexts/AuthContext';
import { useSecurityProtection } from './hooks/useSecurityProtection';
import { useCollectionsPrefetch } from './hooks/useCollectionsPrefetch';

// Layout
import MainLayout from './Layouts/MainLayout';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';
import PremiumLoader from './components/common/PremiumLoader';
import TermsPage from './components/common/legal/TermsPage';
import FAQ from './components/common/legal/FAQ';
import PrivacyPolicyPage from './components/common/legal/PrivacyPolicyPage';
import CookiesPolicyPage from './components/common/legal/CookiePolicyPage';
import CookieConsent from './components/common/legal/CookiesConsent';
import SystemAnnouncement from './components/common/SystemAnnouncement';

// Pages
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import TrendingPage from './pages/TrendingPage';
import MediaDetailsPage from './pages/MediaDetailsPage';
import PlayerPage from './pages/PlayerPage';
import SearchResultsPage from './pages/SearchResultsPage';
import WatchlistPage from './pages/WatchListPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';
import ActorsPersonal from './pages/ActorsPersonal';
import ActorCreditsPage from './pages/ActorCreditsPage';
import RecommendedContentPage from './pages/RecommendedContentPage';
import SimilarContentPage from './pages/SimilarContentPage';
import EpisodesPage from './pages/EpisodesPage';
import FanFavoritesPage from './pages/FanFavoritesPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionsIndexPage from './pages/CollectionsIndexPage';
import ContinueWatchingPage from './pages/ContinueWatchingPage';
import SettingsPage from './pages/SettingsPage';
import AiringShowsPage from './pages/AiringShowsPage';
import ActorFilmographyPage from './pages/ActorFilmographyPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Lazy load all routes
const routes = {
  Home: lazyLoadRoute(routeConfig.home, 'home'),
  Movies: lazyLoadRoute(routeConfig.movies, 'movies'),
  TVShows: lazyLoadRoute(routeConfig.tvShows, 'tv'),
  MediaDetails: lazyLoadRoute(routeConfig.mediaDetails, 'media-details'),
  // ...etc for other routes
};

function App() {
  useSecurityProtection();
  
  // Start prefetching as soon as the app loads
  useCollectionsPrefetch(categoryKeywords);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to finish loading animation
  const finishLoading = () => {
    setLoading(false);
  };
  
  // Only show loading screen on first load in this session
  useEffect(() => {
    // Check if this is the first load in this session
    const isFirstLoad = !sessionStorage.getItem('hasLoaded');
    
    if (!isFirstLoad) {
      setLoading(false);
    } else {
      // Mark that the site has loaded once in this session
      sessionStorage.setItem('hasLoaded', 'true');
      // Add a small delay to show the loader animation
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  // Modify the existing prefetch effect
  useEffect(() => {
    const prefetchEssentialData = async () => {
      try {
        // Try to load collections with validation
        const result = await queryClient.prefetchQuery({
          queryKey: ['collections'],
          queryFn: async () => {
            try {
              const data = await collectionService.getAllCollections();
              if (!data?.collections?.length) {
                throw new Error('Invalid collections data');
              }
              return data;
            } catch (err) {
              // If there's an error, clear cache and retry once
              collectionService.clearCache();
              return await collectionService.getAllCollections();
            }
          },
          retry: 1,
          staleTime: Infinity
        });

        await prefetchInitialData();
        finishLoading();
      } catch (err) {
        console.error('Failed to load essential data:', err);
        setError(err);
        finishLoading();
      }
    };

    prefetchEssentialData();
  }, []);

  useEffect(() => {
    // Start prefetching after initial load
    if (!loading) {
      // Prefetch main routes
      const mainRoutes = ['home', 'movies', 'tvShows', 'trending'];
      mainRoutes.forEach(route => prefetchRoute(route));
      
      // Listen for route changes to trigger prefetching
      const handleRouteChange = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/movie/') || currentPath.includes('/tv/')) {
          prefetchRoute('player');
          prefetchRoute('similar');
          prefetchRoute('recommended');
        } else if (currentPath.includes('/actor/')) {
          prefetchRoute('actorCredits');
        }
      };

      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, [loading]);

  // Add immediate collections prefetch
  useEffect(() => {
    const prefetchCollections = async () => {
      try {
        // Start fetching collections immediately when app loads
        await collectionService.getAllCollections();
        
        // Also prefetch the collections page component
        const collectionsModule = import('./pages/CollectionsIndexPage');
        
        // Add link preload
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'script';
        link.href = '/collections-index.chunk.js';
        document.head.appendChild(link);
      } catch (error) {
        console.error('Error prefetching collections:', error);
      }
    };

    prefetchCollections();
  }, []);

  useEffect(() => {
    // Prefetch collections immediately when app loads
    queryClient.prefetchQuery({
      queryKey: ['collections'],
      queryFn: () => collectionService.getAllCollections(),
    });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">We're having trouble loading the app data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#82BC87] text-white rounded-xl hover:bg-[#6da972] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <main className="min-h-screen bg-[#161616] text-white overflow-x-hidden">
          {loading && <PremiumLoader overlay={true} text="Welcome to Playex" size="large" />}
          
          <AuthProvider>
            <Router>
              <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                <header>
                  <CookieConsent />
                  <SystemAnnouncement />
                </header>

                <Routes>
                  {/* general routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={
                      <Suspense fallback={<PremiumLoader />}>
                        <routes.Home />
                      </Suspense>
                    } />
                    <Route path="movies" element={<MoviesPage />} />
                    <Route path="tv-shows" element={<TVShowsPage />} />
                    <Route path="Trending" element={<TrendingPage />} />
                    <Route path="search" element={<SearchResultsPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/FAQ" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/cookies" element={<CookiesPolicyPage />} />
                    <Route path="movie/:slug" element={<MediaDetailsPage mediaType="movie" />} />
                    <Route path="tv/:slug" element={<MediaDetailsPage mediaType="tv" />} />
                    <Route path="player/movie/:slug" element={<PlayerPage mediaType="movie" />} />
                    <Route path="player/tv/:slug/:season/:episode" element={<PlayerPage mediaType="tv" />} />
                    <Route path="/tv/:slug/episodes/:season" element={<EpisodesPage />} />
                    <Route path="/fan-favorites" element={<FanFavoritesPage />} /> 
                    <Route path="/collections" element={<CollectionsIndexPage />} /> 
                    <Route path="/collection/:id" element={<CollectionsPage />} />
                    <Route path="/continue-watching" element={<ContinueWatchingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/airing-shows" element={<AiringShowsPage />} />
                    
                    {/* Actor routes */}
                    <Route path="/actor/:slug" element={<ActorsPersonal />} />
                    <Route path="/actor/:slug/movies" element={<ActorFilmographyPage mediaType="movie" />} />
                    <Route path="/actor/:slug/tv" element={<ActorFilmographyPage mediaType="tv" />} />
                    
                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="watchlist" element={<WatchlistPage />} />
                      <Route path="favorites" element={<FavoritesPage />} />
                    </Route>
                  </Route>
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>

                <footer className="mt-auto">
                  {/* Add your footer content here */}
                </footer>
              </div>
            </Router>
          </AuthProvider>
        </main>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;