// File: frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../utils/api';
import HeroSlider from '../components/media/HeroSlider';
import MediaCarousel from '../components/media/MediaCarousel';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const TrendingSection = ({ items, loading, error }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative -mx-4 mb-20"
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
          <div className="flex items-center justify-between mb-8">
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
              className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B6B]/10 to-transparent 
                         hover:from-[#FF6B6B]/20 transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-[#FF6B6B] font-medium">View All Trending</span>
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

const CategorySection = ({ title, icon, items, viewAllLink, loading, error, gradientColors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 left-1/4 w-96 h-96 ${gradientColors.glow1} rounded-full filter blur-[100px] animate-pulse`} />
        <div className={`absolute -bottom-20 right-1/4 w-96 h-96 ${gradientColors.glow2} rounded-full filter blur-[100px] animate-pulse`} />
      </div>

      {/* Content Container */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${gradientColors.iconBg} flex items-center justify-center`}>
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  {loading ? 'Loading...' : `${items?.length || 0} titles available`}
                </p>
              </div>
            </div>

            {viewAllLink && (
              <Link
                to={viewAllLink}
                className={`group px-4 py-2 rounded-xl ${gradientColors.buttonBg} backdrop-blur-sm 
                           transition-all duration-300 flex items-center gap-2`}
              >
                <span className={`text-sm font-medium ${gradientColors.buttonText}`}>View All</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ${gradientColors.buttonText} transform group-hover:translate-x-1 transition-transform duration-300`}
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        <div className="p-6">
          <MediaCarousel
            items={items}
            loading={loading}
            error={error}
            showType={false}
          />
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
    <div className="-mt-[72px] overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"  // Removed min-h-screen to prevent extra space
      >
        <HeroSlider items={trendingData || []} />

        {/* Transitional Stats Section - Adjusted positioning and z-index */}
        <div className="relative -mt-32 z-20"> {/* Changed from absolute to relative and adjusted margin */}
          <div className="bg-gradient-to-t from-[#161616] via-[#161616]/90 to-transparent pb-12 pt-32">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF6B6B]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{trendingData?.length || 0}</div>
                      <div className="text-sm text-gray-400">Trending Now</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{topRatedMovies?.length || 0}</div>
                      <div className="text-sm text-gray-400">Top Rated</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E4D981]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{popularActors?.length || 0}</div>
                      <div className="text-sm text-gray-400">Popular Actors</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF8E53]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF8E53]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{popularTVShows?.length || 0}</div>
                      <div className="text-sm text-gray-400">TV Shows</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Section - Removed padding top since we don't need it anymore */}
      <div className="bg-[#161616] relative z-20">
        {/* Add Trending Section */}
        <TrendingSection
          items={trendingData}
          loading={trendingLoading}
          error={trendingError}
        />

        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {/* Popular Movies */}
            <CategorySection
              title="Popular Movies"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF6B6B]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              }
              items={popularMovies}
              viewAllLink="/movies"
              loading={moviesLoading}
              error={moviesError}
              gradientColors={{
                glow1: "bg-[#FF6B6B]/20",
                glow2: "bg-[#FF8E53]/20",
                iconBg: "bg-[#FF6B6B]/10",
                buttonBg: "bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20",
                buttonText: "text-[#FF6B6B] group-hover:text-[#FF8E53]"
              }}
            />

            {/* Popular TV Shows */}
            <CategorySection
              title="Popular TV Shows"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 0v14h12V3H4z" clipRule="evenodd" />
                  <path d="M7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
                </svg>
              }
              items={popularTVShows}
              viewAllLink="/tv-shows"
              loading={tvLoading}
              error={tvError}
              gradientColors={{
                glow1: "bg-[#82BC87]/20",
                glow2: "bg-[#6da972]/20",
                iconBg: "bg-[#82BC87]/10",
                buttonBg: "bg-[#82BC87]/10 hover:bg-[#82BC87]/20",
                buttonText: "text-[#82BC87] group-hover:text-[#6da972]"
              }}
            />

            {/* Popular Actors */}
            <CategorySection
              title="Popular Actors"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              }
              items={popularActors}
              viewAllLink="/actors"
              loading={actorsLoading}
              error={actorsError}
              gradientColors={{
                glow1: "bg-[#E4D981]/20",
                glow2: "bg-[#d4c86e]/20",
                iconBg: "bg-[#E4D981]/10",
                buttonBg: "bg-[#E4D981]/10 hover:bg-[#E4D981]/20",
                buttonText: "text-[#E4D981] group-hover:text-[#d4c86e]"
              }}
            />

            {/* Add similar CategorySection components for Top Rated Movies and TV Shows */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;