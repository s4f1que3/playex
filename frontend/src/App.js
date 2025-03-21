import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PremiumLoader from './components/common/PremiumLoader';  // Add this import

// Layouts
import MainLayout from './Layouts/MainLayout';

// Components
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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300000, // 5 minutes
    },
  },
});

function App() {
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

  return (
    <div className="min-h-screen bg-[#161616] text-white overflow-x-hidden">
      {loading && <PremiumLoader overlay={true} text="Welcome to Playex" size="large" />}
      
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            {/* Only show the main content when not loading or with opacity transition */}
            <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              <CookieConsent />
              <SystemAnnouncement />
              <Routes>
                {/* general routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="movies" element={<MoviesPage />} />
                  <Route path="tv-shows" element={<TVShowsPage />} />
                  <Route path="Trending" element={<TrendingPage />} />
                  <Route path="search" element={<SearchResultsPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/FAQ" element={<FAQ />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/cookies" element={<CookiesPolicyPage />} />
                  <Route path="movie/:id" element={<MediaDetailsPage mediaType="movie" />} />
                  <Route path="tv/:id" element={<MediaDetailsPage mediaType="tv" />} />
                  <Route path="player/movie/:id" element={<PlayerPage mediaType="movie" />} />
                  <Route path="player/tv/:id/:season/:episode" element={<PlayerPage mediaType="tv" />} />
                  <Route path=":mediaType/:id/similar" element={<SimilarContentPage />} />
                  <Route path=":mediaType/:id/recommended" element={<RecommendedContentPage />} />
                  <Route path="/tv/:id/episodes/:season" element={<EpisodesPage />} />
                  <Route path="/fan-favorites" element={<FanFavoritesPage />} /> 
                  <Route path="/collections" element={<CollectionsIndexPage />} /> 
                  <Route path="/collection/:id" element={<CollectionsPage />} />
                  <Route path="/continue-watching" element={<ContinueWatchingPage />} />
                  
                  {/* Actor routes */}
                  <Route path="/actor/:id" element={<ActorsPersonal />} />
                  <Route path="/actor/:id/movies" element={<ActorCreditsPage type="movie" />} />
                  <Route path="/actor/:id/tv" element={<ActorCreditsPage type="tv" />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="watchlist" element={<WatchlistPage />} />
                    <Route path="favorites" element={<FavoritesPage />} />
                  </Route>
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;