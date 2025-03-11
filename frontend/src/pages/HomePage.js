// File: frontend/src/pages/HomePage.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import HeroSlider from '../components/media/HeroSlider';
import MediaCarousel from '../components/media/MediaCarousel';
import { useWatchProgress } from '../hooks/useWatchProgress';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { watchProgress } = useWatchProgress();
  
  // Fetch trending movies and TV shows
  const { data: trendingData, isLoading: trendingLoading, error: trendingError } = useQuery(
    'trending',
    () => tmdbApi.get('/trending/all/week').then(res => res.data.results),
    {
      staleTime: 600000 // 10 minutes
    }
  );
  
  // Fetch popular movies
  const { data: popularMovies, isLoading: moviesLoading, error: moviesError } = useQuery(
    'popularMovies',
    () => tmdbApi.get('/movie/popular').then(res => res.data.results),
    {
      staleTime: 600000 // 10 minutes
    }
  );
  
  // Fetch popular TV shows
  const { data: popularTVShows, isLoading: tvLoading, error: tvError } = useQuery(
    'popularTVShows',
    () => tmdbApi.get('/tv/popular').then(res => res.data.results),
    {
      staleTime: 600000 // 10 minutes
    }
  );
  
  // Fetch top rated movies
  const { data: topRatedMovies, isLoading: topRatedMoviesLoading, error: topRatedMoviesError } = useQuery(
    'topRatedMovies',
    () => tmdbApi.get('/movie/top_rated').then(res => res.data.results),
    {
      staleTime: 600000 // 10 minutes
    }
  );
  
  // Fetch top rated TV shows
  const { data: topRatedTVShows, isLoading: topRatedTVLoading, error: topRatedTVError } = useQuery(
    'topRatedTVShows',
    () => tmdbApi.get('/tv/top_rated').then(res => res.data.results),
    {
      staleTime: 600000 // 10 minutes
    }
  );
  
  // Get continue watching items from watch progress
  const continueWatchingItems = React.useMemo(() => {
    if (!watchProgress) return [];
    
    // Convert watchProgress object to array of items with extended info
    return Object.values(watchProgress)
      .filter(item => item.progress && item.progress.watched > 0)
      .map(item => ({
        id: item.id,
        title: item.title,
        name: item.title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        media_type: item.type,
        vote_average: 0, // We don't have this info in the progress data
        // Add any other required fields for MediaCard component
      }))
      .slice(0, 10); // Limit to 10 items
  }, [watchProgress]);
  
  return (
    <div className="-mt-[72px]"> {/* Offset the header padding in MainLayout */}
      {/* Hero Slider */}
      <HeroSlider items={trendingData || []} />
      
      <div className="container mx-auto px-4">
        {/* Continue Watching (if logged in and has watch history) */}
        {currentUser && continueWatchingItems.length > 0 && (
          <MediaCarousel
            title="Continue Watching"
            items={continueWatchingItems}
            viewAllLink="/watch-history"
            loading={false}
            error={null}
          />
        )}
        
        {/* Trending Now */}
        <MediaCarousel
          title="Trending Now"
          items={trendingData}
          viewAllLink="/trending"
          loading={trendingLoading}
          error={trendingError}
        />
        
        {/* Popular Movies */}
        <MediaCarousel
          title="Popular Movies"
          items={popularMovies}
          viewAllLink="/movies"
          loading={moviesLoading}
          error={moviesError}
        />
        
        {/* Popular TV Shows */}
        <MediaCarousel
          title="Popular TV Shows"
          items={popularTVShows}
          viewAllLink="/tv-shows"
          loading={tvLoading}
          error={tvError}
        />
        
        {/* Top Rated Movies */}
        <MediaCarousel
          title="Top Rated Movies"
          items={topRatedMovies}
          viewAllLink="/movies?sort_by=vote_average.desc"
          loading={topRatedMoviesLoading}
          error={topRatedMoviesError}
        />
        
        {/* Top Rated TV Shows */}
        <MediaCarousel
          title="Top Rated TV Shows"
          items={topRatedTVShows}
          viewAllLink="/tv-shows?sort_by=vote_average.desc"
          loading={topRatedTVLoading}
          error={topRatedTVError}
        />
      </div>
    </div>
  );
};

export default HomePage;
