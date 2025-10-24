import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PremiumLoader from './components/common/PremiumLoader';
import { lazyLoadRoute, routeConfig } from './utils/lazyLoad';
import { prefetchRoute, prefetchInitialData } from './utils/prefetchRoutes';
import { HelmetProvider } from 'react-helmet-async';
import { useSecurityProtection } from './hooks/useSecurityProtection';
import { useCollectionsPrefetch } from './hooks/useCollectionsPrefetch';
import { categoryKeywords } from './constants/categoryKeywords'; // Move categoryKeywords to a separate file

// Layouts
import MainLayout from './Layouts/MainLayout';

// Components
import TermsPage from './components/common/legal/TermsPage';
import FAQ from './components/common/legal/FAQ';
import PrivacyPolicyPage from './components/common/legal/PrivacyPolicyPage';
import CookiesPolicyPage from './components/common/legal/CookiePolicyPage';
import CookieConsent from './components/common/legal/CookiesConsent';
import NewDomain from './components/common/legal/NewDomain';
import AdBlockPage from './components/common/legal/AdBlockPage';
import SystemAnnouncement from './components/common/SystemAnnouncement';

// Pages
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import TrendingPage from './pages/TrendingPage';
import MediaDetailsPage from './pages/MediaDetailsPage';
import PlayerPage from './pages/PlayerPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';
import ActorsPersonal from './pages/ActorsPersonal';
import ActorCreditsPage from './pages/ActorCreditsPage';
import RecommendedContentPage from './pages/RecommendedContentPage';
import SimilarContentPage from './pages/SimilarContentPage';
import EpisodesPage from './pages/EpisodesPage';
import FanFavoritesPage from './pages/FanFavoritesPage';
import CollectionsPage from './pages/CollectionsPage';

import ContinueWatchingPage from './pages/ContinueWatchingPage';
import SettingsPage from './pages/SettingsPage';
import AiringShowsPage from './pages/AiringShowsPage';
import ActorFilmographyPage from './pages/ActorFilmographyPage';
import WatchListPage from './pages/WatchListPage';

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

  // Add prefetching effect
  useEffect(() => {
    // Start prefetching during loading screen
    const prefetchData = async () => {
      await prefetchInitialData();
      finishLoading(); // Only finish loading after data is prefetched
    };
    
    prefetchData();
  }, []); // Run once on mount

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

  return (
    <HelmetProvider>
      <main className="min-h-screen bg-[#161616] text-white overflow-x-hidden">
        {loading && <PremiumLoader overlay={true} text="Welcome to Playex" size="large" />}
        
        <AuthProvider>
          <Router>
            <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              <header>
                <CookieConsent />
                <NewDomain />
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
                  <Route path="/AdBlockers" element={<AdBlockPage />} />
                  <Route path="/FAQ" element={<FAQ />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/cookies" element={<CookiesPolicyPage />} />
                  <Route path="movie/:slug" element={<MediaDetailsPage mediaType="movie" />} />
                  <Route path="tv/:slug" element={<MediaDetailsPage mediaType="tv" />} />
                  <Route path="player/movie/:slug" element={<PlayerPage mediaType="movie" />} />
                  <Route path="player/tv/:slug/:season/:episode" element={<PlayerPage mediaType="tv" />} />
                  <Route path="/tv/:slug/episodes/:season" element={<EpisodesPage />} />
                  <Route path="/fan-favorites" element={<FanFavoritesPage />} /> 
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
                    <Route path="watchlist" element={<WatchListPage />} />
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
  );
}

export default App;