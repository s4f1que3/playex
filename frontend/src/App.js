import React from 'react';
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

// Pages
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import TrendingPage from './pages/TrendingPage'
import MediaDetailsPage from './pages/MediaDetailsPage';
import PlayerPage from './pages/PlayerPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProfilePage from './pages/ProfilePage';
import WatchlistPage from './pages/WatchListPage';
import FavoritesPage from './pages/FavoritesPage';
import WatchHistoryPage from './pages/WatchHistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
        <CookieConsent />
        <SystemAnnouncement />p
          <Routes>
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
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="watchlist" element={<WatchlistPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="watch-history" element={<WatchHistoryPage />} />
              </Route>
            </Route>
            
            {/* Auth routes (without header/footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
