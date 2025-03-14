// File: frontend/src/pages/HomePage.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import HeroSlider from '../components/media/HeroSlider';
import MediaCarousel from '../components/media/MediaCarousel';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();
  
  // Fetch trending movies and TV shows
const { data: trendingData, isLoading: trendingLoading, error: trendingError } = useQuery({
  queryKey: ['trending'],
  queryFn: () => tmdbApi.get('/trending/all/week').then(res => res.data.results),
  staleTime: 600000 // 10 minutes
});

// Fetch popular movies
const { data: popularMovies, isLoading: moviesLoading, error: moviesError } = useQuery({
  queryKey: ['popularMovies'],
  queryFn: () => tmdbApi.get('/movie/popular').then(res => res.data.results),
  staleTime: 600000 // 10 minutes
});

// Fetch popular TV shows
const { data: popularTVShows, isLoading: tvLoading, error: tvError } = useQuery({
  queryKey: ['popularTVShows'],
  queryFn: () => tmdbApi.get('/tv/popular').then(res => res.data.results),
  staleTime: 600000 // 10 minutes
});
  
  // Fetch top rated movies
const { data: topRatedMovies, isLoading: topRatedMoviesLoading, error: topRatedMoviesError } = useQuery({
  queryKey: ['topRatedMovies'],
  queryFn: () => tmdbApi.get('/movie/top_rated').then(res => res.data.results),
  staleTime: 600000 // 10 minutes
});

// Fetch top rated TV shows
const { data: topRatedTVShows, isLoading: topRatedTVLoading, error: topRatedTVError } = useQuery({
  queryKey: ['topRatedTVShows'],
  queryFn: () => tmdbApi.get('/tv/top_rated').then(res => res.data.results),
  staleTime: 600000 // 10 minutes
});

// Fetch popular actors/persons
const { data: popularActors, isLoading: actorsLoading, error: actorsError } = useQuery({
  queryKey: ['popularActors'],
  queryFn: () => tmdbApi.get('/person/popular').then(res => {
    // Add media_type to each person object
    const actors = res.data.results.map(actor => ({
      ...actor,
      media_type: 'person'
    }));
    return actors;
  }),
  staleTime: 600000 // 10 minutes
});
  
  return (
    <div className="-mt-[72px]"> {/* Offset the header padding in MainLayout */}
      {/* Add padding-top for mobile to account for fixed header */}
      <div className="pt-16 md:pt-0"> {/* Add this wrapper div */}
        <section className="relative">
          {/* Adjust carousel container height for mobile */}
          <div className="h-[50vh] md:h-[70vh] lg:h-[85vh] relative">
            <HeroSlider items={trendingData || []} />
          </div>
        </section>
      </div>
      
      <div className="container mx-auto px-4">
        
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
        
        {/* Popular Actors */}
        <MediaCarousel
          title="Popular Actors"
          items={popularActors}
          viewAllLink="/actors"
          loading={actorsLoading}
          error={actorsError}
          mediaType="person" // Specify that these are people
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