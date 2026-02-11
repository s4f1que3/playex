import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, tmdbHelpers } from '../../utils/api';
import { createMediaUrl } from '../../utils/slugify';

const EpisodeCard = ({ episode }) => {
  const mediaUrl = createMediaUrl('tv', episode.show.id, episode.show.name);
  const slug = mediaUrl.split('/').pop();
  const playerLink = `/player/tv/${slug}/${episode.season_number}/${episode.episode_number}`;
  const showLink = `/tv/${slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-black/40 to-black/60
                 border border-white/5 hover:border-cyan-500/20 transition-all duration-500
                 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        {/* Background Image */}
        <img
          src={tmdbHelpers.getImageUrl(episode.still_path) || tmdbHelpers.getImageUrl(episode.show.backdrop_path)}
          alt={episode.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent 
                      opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Calendar Date Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10
                        transform group-hover:scale-105 transition-all duration-500">
            <div className="text-cyan-400 text-xs font-medium">
              {new Date(episode.air_date).toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="text-white text-lg font-bold -mt-1">
              {new Date(episode.air_date).getDate()}
            </div>
          </div>
        </div>

        {/* Episode Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 
                      transition-transform duration-500">
          <div className="space-y-3">
            {/* Episode Badge */}
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-400 backdrop-blur-sm
                           border border-cyan-500/20 transform group-hover:scale-105 transition-all duration-500">
                Episode {episode.episode_number}
              </span>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1 text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Airs Today</span>
              </motion.div>
            </div>

            {/* Title and Show Name */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300">
                {episode.name}
              </h3>
              <Link 
                to={showLink}
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1"
              >
                <span>{episode.show.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Play Button Overlay */}
        <Link
          to={playerLink}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center
                     shadow-lg shadow-cyan-500/20 border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

const EpisodeGuide = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: airingToday, isLoading } = useQuery({
    queryKey: ['airingToday'],
    queryFn: async () => {
      try {
        const response = await tmdbApi.get('/tv/airing_today', {
          params: { page: 1 }
        });
        
        // Get episode details for each show
        const shows = response.data.results;  // Remove .slice(0, 6) to get total count
        const episodePromises = shows.slice(0, 6).map(show =>  // Keep slice here for display
          tmdbApi.get(`/tv/${show.id}?append_to_response=season/1`)
            .then(res => ({
              ...res.data.last_episode_to_air,
              show: {
                id: show.id,
                name: show.name,
                backdrop_path: show.backdrop_path
              }
            }))
            .catch(() => null) // Handle individual show fetch errors
        );
        
        const episodes = await Promise.all(episodePromises);
        const validEpisodes = episodes.filter(episode => episode !== null);
        
        return {
          episodes: validEpisodes,
          totalCount: shows.length
        };
      } catch (error) {
        console.error('Error fetching airing shows:', error);
        return {
          episodes: [],
          totalCount: 0
        };
      }
    },
    staleTime: 300000 // 5 minutes
  });

  // Early return with null if loading
  if (isLoading) return null;

  // Ensure we have valid data
  const episodes = airingToday?.episodes || [];
  const totalCount = airingToday?.totalCount || 0;

  // Don't render anything if no episodes
  if (episodes.length === 0) return null;

  const displayedEpisodes = isMobile && isCollapsed ? episodes.slice(0, 2) : episodes;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative py-8 sm:py-12 overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
        <div className="absolute inset-0 bg-pattern-grid opacity-5 transform rotate-45 scale-150" />
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[100px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Enhanced Section Header - Updated for mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 lg:mb-12 gap-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
            <div className="relative hidden sm:block">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px]
                           rotate-3 hover:rotate-6 transition-transform duration-500">
                <div className="w-full h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl 
                             flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 
                           flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-white">📺</span>
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest Episodes</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
                    Today's Lineup
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm">
                    {episodes.length} of {totalCount}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">Stay up to date with new episodes from your favorite shows</p>
            </div>
          </div>

          {/* View All Button - Updated for mobile */}
          <Link
            to="/airing-shows"
            className="group relative px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-transparent 
                      hover:from-cyan-500/20 transition-all duration-300 flex items-center gap-2 
                      w-full sm:w-auto justify-center sm:justify-start"
          >
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-medium whitespace-nowrap">View All</span>
              <span className="text-cyan-400/60 text-sm">({totalCount})</span>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300"
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>

        {/* Enhanced Episodes Grid with responsive layout */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedEpisodes.map((episode, index) => (
              <EpisodeCard 
                key={episode.id} 
                episode={episode}
              />
            ))}
          </div>

          {/* Mobile Collapse/Expand Button */}
          {isMobile && episodes.length > 2 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full mt-6 px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 
                         text-cyan-400 font-medium flex items-center justify-center gap-2"
            >
              {isCollapsed ? (
                <>
                  <span>Show All Episodes</span>
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5"
                    animate={{ rotate: 0 }}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </motion.svg>
                </>
              ) : (
                <>
                  <span>Show Less</span>
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5"
                    animate={{ rotate: 180 }}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </motion.svg>
                </>
              )}
            </motion.button>
          )}

          {/* Show More Indicator - Updated for mobile */}
          {totalCount > episodes.length && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-full sm:w-auto"
            >
              <Link
                to="/airing-shows"
                className="flex flex-col items-center gap-2 text-cyan-400 hover:text-blue-600 transition-colors duration-300"
              >
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
                <span className="text-xs sm:text-sm font-medium text-center px-4">
                  {totalCount - episodes.length} more episodes available
                </span>
              </Link>
            </motion.div>
          )}

          {/* Right Edge Gradient Indicator - Hide on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#161616] via-transparent to-transparent 
                        hidden sm:flex items-center justify-end pr-4 pointer-events-none">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-cyan-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EpisodeGuide;
