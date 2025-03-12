import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import MainLayout from './Layouts/MainLayout';

// Components
import TermsPage from './components/common/TermsPage';
import FAQ from './components/common/FAQ';
import PrivacyPolicyPage from './components/common/PrivacyPolicyPage';
import CookiesPolicyPage from './components/common/CookiePolicyPage';
import CookieConsent from './components/common/CookiesConsent';
import SystemAnnouncement from './components/common/SystemAnnouncement';
import LoadingScreen from './components/common/LoadingScreen';

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
import ActorsPage from './pages/ActorsPage';
import ActorsPersonal from './pages/ActorsPersonal';
import ActorCreditsPage from './pages/ActorCreditsPage';

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
    }
  }, []);

  return (
    <>
      {loading && <LoadingScreen finishLoading={finishLoading} />}
      
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
                  
                  {/* Actor routes */}
                  <Route path="/actors" element={<ActorsPage />} />
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
    </>
  );
}

export default App;