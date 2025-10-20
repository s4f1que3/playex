// File: frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import HeroSlider from '../components/media/HeroSlider';
import MediaCarousel from '../components/media/MediaCarousel';
import { useAuth } from '../contexts/AuthContext';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { getContinueWatching } from '../utils/LocalStorage';
import EpisodeGuide from '../components/sections/EpisodeGuide';
import SEO from '../components/common/SEO';

const Counter = ({ value, title, description, icon, color, link }) => {
  const isNumeric = typeof value === 'number';
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => isNumeric? Math.round(latest) : value);
  
  React.useEffect(() => {
    if(isNumeric) {
    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut"
    });
    return controls.stop;
    }
  }, [count, value]);

  const ContentWrapper = link ? Link : 'div';

  return (
    <ContentWrapper
      to={link}
      className={`block ${link ? 'cursor-pointer' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl 
                    transform transition-transform duration-300 group-hover:scale-105" />

        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4
                    transform transition-transform duration-300">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center
                         group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>

            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <motion.span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 
                                    bg-clip-text text-transparent">
                  {rounded}
                </motion.span>
                <span className="text-base text-white/80">+</span>
              </div>

              <h3 className="text-base font-medium text-white">{title}</h3>
              <p className="text-xs text-gray-400">{description}</p>

              <div className="relative mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`absolute inset-0 bg-gradient-to-r from-${color} to-${color}/50`}
                />
              </div>
            </div>
          </div>


          {/* Particle effects */}
          <div className="absolute -z-10 inset-0">
            <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-white/20 animate-float" 
                 style={{ animationDelay: "0s" }} />
            <div className="absolute bottom-0 right-1/4 w-1 h-1 rounded-full bg-white/20 animate-float" 
                 style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-1/2 right-0 w-1 h-1 rounded-full bg-white/20 animate-float" 
                 style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </motion.div>
    </ContentWrapper>
  );
};

const TrendingSection = ({ items, loading, error }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative mb-20"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0] 
          }} 
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150 opacity-5" />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4">
        <div className="relative py-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFE66D] p-[2px] rotate-3 hover:rotate-6 transition-transform duration-300">
                  <div className="w-full h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF6B6B]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#FF6B6B] flex items-center justify-center animate-pulse">
                  <span className="text-xs font-bold text-white">🔥</span>
                </div>
              </div>
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl font-bold text-white"
                >
                  Trending
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#FFE66D] ml-3">
                    This Week
                  </span>
                </motion.h2>
                <p className="text-gray-400 mt-2">The hottest content everyone's watching right now</p>
              </div>
            </div>

            <Link
              to="/trending"
              className="group relative px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#FF6B6B]/10 to-transparent 
                         hover:from-[#FF6B6B]/20 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-[#FF6B6B] font-medium whitespace-nowrap">View All Trending</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-[#FF6B6B] transform group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none" />
            
            <MediaCarousel
              items={items}
              loading={loading}
              error={error}
              showType={true}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
  queryFn: () => tmdbApi.get('/tv/top_rated').then(res => res.data.results),
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

// Fetch fan favorites
const { data: fanFavorites, isLoading: fanFavoritesLoading } = useQuery({
  queryKey: ['fanFavorites'],
  queryFn: async () => {
    try {
      const response = await tmdbApi.get('/movie/top_rated');
      return response.data.results.filter(movie => movie.vote_average >= 7.5).slice(0, 20);
    } catch (error) {
      console.error('Error fetching fan favorites:', error);
      return [];
    }
  },
  staleTime: 600000
});

// Replace the broken collections query with this fixed version
const { data: collections, isLoading: collectionsLoading } = useQuery({
  queryKey: ['collections'],
  queryFn: async () => {
    // Popular franchise queries
    const queries = ['marvel', 'star wars', 'harry potter', 'lord of the rings', 'dc comics'];
    
    // Fetch collections for each query
    const collectionsPromises = queries.map(query => 
      tmdbApi.get('/search/collection', {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page: 1
        }
      })
    );
    
    const responses = await Promise.all(collectionsPromises);
    
    // Combine and format all collections
    const allCollections = responses.flatMap(response => 
      response.data.results.map(collection => ({
        ...collection,
        media_type: 'collection',
        poster_path: collection.poster_path,
        title: collection.name,
        id: collection.id
      }))
    );
    
    // Remove duplicates and limit to 20
    const uniqueCollections = [...new Map(allCollections.map(item => [item.id, item])).values()];
    return uniqueCollections.slice(0, 20);
  },
  staleTime: 600000 // 10 minutes
});

const continueWatchingData = getContinueWatching();

// Filter out items with missing images before passing to HeroSlider
const validTrendingItems = trendingData?.filter(item => item.backdrop_path) || [];

  return (
    <>
      <SEO 
        title="Home"
        description="Watch the latest movies and TV shows on Playex - your premium streaming platform"
        url={window.location.href}
      />
      <div className="-mt-[72px] overflow-hidden">
        {/* Hero Section - Updated to use filtered items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <HeroSlider items={validTrendingItems} />
          {/* Transitional Stats Section - Adjusted positioning and z-index */}
          <div className="relative z-20">
            <div className="bg-gradient-to-t from-[#161616] via-[#161616]/90 to-transparent pb-12 pt-32">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
                  <Counter
                    value="1M"
                    title="Movies"
                    description="Curated collection of premium films"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF6B6B]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    }
                    color="[#FF6B6B]"
                    link="/movies"
                    slim={true}
                  />
                  
                  <Counter
                    value="1M"
                    title="TV Shows"
                    description="Exclusive series and episodes"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 0v14h12V3H4z" clipRule="evenodd" />
                        <path d="M7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
                      </svg>
                    }
                    color="[#82BC87]"
                    link="/tv-shows"
                    slim={true}
                  />
                  
                  <Counter
                    value={100}
                    title="Fan Favorites"
                    description="Most loved by our community"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    }
                    color="[#E4D981]"
                    link="/fan-favorites"
                    slim={true}
                  />
                  
                  <Counter
                    value={1000}
                    title="Collections"
                    description="Curated series and franchises"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF8E53]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    }
                    color="[#FF8E53]"
                    link="/collections"
                    slim={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue Watching Section */}

        {continueWatchingData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mb-20"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -45, 0] 
                  }} 
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150 opacity-5" />
                </motion.div>
              </div>

              <div className="container mx-auto px-4">
                <div className="relative py-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#82BC87] to-[#6da972] p-[2px] rotate-3 hover:rotate-6 transition-transform duration-300">
                          <div className="w-full h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#82BC87] flex items-center justify-center animate-pulse">
                          <span className="text-xs font-bold text-white">⏱️</span>
                        </div>
                      </div>
                      <div>
                        <motion.h2 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-4xl font-bold text-white flex flex-wrap items-center gap-1 mb-1 relative"
                        >
                          <span>Continue</span>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#6da972] relative z-10">
                            Watching
                          </span>
                        </motion.h2>
                        <p className="text-gray-400">Pick up where you left off</p>
                      </div>
                    </div>

                    <Link
                      to="/continue-watching"
                      className="group relative px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#82BC87]/10 to-transparent 
                               hover:from-[#82BC87]/20 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <span className="text-[#82BC87] font-medium whitespace-nowrap">View All</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-[#82BC87] transform group-hover:translate-x-1 transition-transform duration-300"
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none" />
                    
                    <MediaCarousel
                      items={continueWatchingData.map(item => ({
                        ...item.details,
                        link: item.media_type === 'tv' && item.details.last_episode
                          ? `/player/tv/${item.media_id}/${item.details.last_episode.season}/${item.details.last_episode.episode}`
                          : `/player/${item.media_type}/${item.media_id}`
                      }))}
                      loading={false}
                      error={null}
                      showType={true}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* end of section */}

        <div className="space-y-12">
          {/* Insert EpisodeGuide before ContinueWatching */}
          <EpisodeGuide />
        

        {/* Main Content Section - Removed padding top since we don't need it anymore */}
        <div className="bg-[#161616] relative z-20">
          {/* Add Trending Section */}
          <TrendingSection
            items={trendingData}
            loading={trendingLoading}
            error={trendingError}
          />

          {/* Fan Favorites Section */}
          <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative mb-20"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -45, 0] 
                    }} 
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150 opacity-5" />
                  </motion.div>
                </div>

                <div className="container mx-auto px-4">
                  <div className="relative py-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E4D981] to-[#d4c86e] p-[2px] -rotate-3 hover:rotate-6 transition-transform duration-300">
                            <div className="w-full h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#E4D981] flex items-center justify-center animate-pulse">
                            <span className="text-xs font-bold text-white">★</span>
                          </div>
                        </div>
                        <div>
                          <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold text-white"
                          >
                            Fan
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E4D981] to-[#d4c86e] ml-3">
                              Favorites
                            </span>
                          </motion.h2>
                          <p className="text-gray-400 mt-2">The most beloved shows among our community</p>
                        </div>
                      </div>

                      <Link
                        to="/fan-favorites"
                        className="group relative px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#E4D981]/10 to-transparent 
                                 hover:from-[#E4D981]/20 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <span className="text-[#E4D981] font-medium whitespace-nowrap">Explore More</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-[#E4D981] transform group-hover:translate-x-1 transition-transform duration-300"
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none" />
                      
                      <MediaCarousel
                        items={fanFavorites}
                        loading={fanFavoritesLoading}
                        error={null}
                        showType={true}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

          <div className="container mx-auto px-4">
            <div className="space-y-20">
              {/* Popular Movies Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -45, 0] 
                    }} 
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150 opacity-5" />
                  </motion.div>
                </div>

                <div className="container mx-auto px-4">
                  <div className="relative py-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-[2px] rotate-3 hover:rotate-6 transition-transform duration-300">
                            <div className="w-full h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF6B6B]" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#FF6B6B] flex items-center justify-center animate-pulse">
                            <span className="text-xs font-bold text-white">🎬</span>
                          </div>
                        </div>
                        <div>
                          <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold text-white"
                          >
                            Popular
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] ml-3">
                              Movies
                            </span>
                          </motion.h2>
                          <p className="text-gray-400 mt-2">Discover the most-watched movies right now</p>
                        </div>
                      </div>

                      <Link
                        to="/movies"
                        className="group relative px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#FF6B6B]/10 to-transparent 
                                 hover:from-[#FF6B6B]/20 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <span className="text-[#FF6B6B] font-medium whitespace-nowrap">Explore Movies</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-[#FF6B6B] transform group-hover:translate-x-1 transition-transform duration-300"
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none" />
                      
                      <MediaCarousel
                        items={popularMovies}
                        loading={moviesLoading}
                        error={moviesError}
                        showType={true}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
    
              {/* Collections Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative mb-20"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -45, 0] 
                    }} 
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150 opacity-5" />
                  </motion.div>
                </div>

                <div className="container mx-auto px-4">
                  <div className="relative py-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF8E53] to-[#FF6B6B] p-[2px] rotate-3 hover:rotate-6 transition-transform duration-300">
                            <div className="w-full h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8E53]" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#FF8E53] flex items-center justify-center animate-pulse">
                            <span className="text-xs font-bold text-white">📚</span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold text-white flex flex-col sm:flex-row items-start sm:items-center"
                          >
                            Movie
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8E53] to-[#FF6B6B] sm:ml-3">
                              Collections
                            </span>
                          </motion.h2>
                          <p className="text-gray-400 mt-2">Complete movie series and franchises</p>
                        </div>
                      </div>

                      <Link
                        to="/collections"
                        className="group relative px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#FF8E53]/10 to-transparent 
                                 hover:from-[#FF8E53]/20 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <span className="text-[#FF8E53] font-medium whitespace-nowrap">Explore Collections</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-[#FF8E53] transform group-hover:translate-x-1 transition-transform duration-300"
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none" />
                      
                      <MediaCarousel
                        items={collections}
                        loading={collectionsLoading}
                        error={null}
                        showType={true}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>


              {/* Popular TV Shows - Copy the same pattern as above but with different colors and icon */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -45, 0] 
                    }} 
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150 opacity-5" />
                  </motion.div>
                </div>

                <div className="container mx-auto px-4">
                  <div className="relative py-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#82BC87] to-[#6da972] p-[2px] rotate-3 hover:rotate-6 transition-transform duration-300">
                            <div className="w-full h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 0v14h12V3H4z" clipRule="evenodd" />
                                <path d="M7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#82BC87] flex items-center justify-center animate-pulse">
                            <span className="text-xs font-bold text-white">📺</span>
                          </div>
                        </div>
                        <div>
                          <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold text-white"
                          >
                            Popular
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#6da972] ml-3">
                              TV Shows
                            </span>
                          </motion.h2>
                          <p className="text-gray-400 mt-2">Discover the most-watched TV shows right now</p>
                        </div>
                      </div>

                      <Link
                        to="/tv-shows"
                        className="group relative px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#82BC87]/10 to-transparent 
                                 hover:from-[#82BC87]/20 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <span className="text-[#82BC87] font-medium whitespace-nowrap">Explore TV Shows</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-[#82BC87] transform group-hover:translate-x-1 transition-transform duration-300"
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none" />
                      
                      <MediaCarousel
                        items={popularTVShows}
                        loading={tvLoading}
                        error={tvError}
                        showType={true}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          </div>
        </div>
                
      </div>
    </>
  );
};

export default HomePage;

