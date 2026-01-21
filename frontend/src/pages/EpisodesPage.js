import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import { useSlugResolver } from '../hooks/useSlugResolver';
import SEO from '../components/common/SEO';

const EpisodesPage = () => {
  const location = useLocation();
  const { slug, season } = useParams();
  const { id } = useSlugResolver('tv', slug);
  
  // Add state for current episode
  const [currentEpisode, setCurrentEpisode] = useState(null);

  // Effect to handle current episode tracking
  useEffect(() => {
    // First check URL for current episode
    const pathParts = location.pathname.split('/');
    const isPlayerPath = pathParts.includes('player');
    const episodeFromUrl = isPlayerPath ? pathParts[pathParts.length - 1] : null;
    
    // Then check localStorage
    const storedEpisode = localStorage.getItem(`currentEpisode_${id}_${season}`);
    
    // Update current episode from URL or storage
    if (episodeFromUrl) {
      setCurrentEpisode(episodeFromUrl);
      localStorage.setItem(`currentEpisode_${id}_${season}`, episodeFromUrl);
    } else if (storedEpisode) {
      setCurrentEpisode(storedEpisode);
    }
  }, [location.pathname, id, season]);

  // Fetch TV show details
  const { data: showData } = useQuery({
    queryKey: ['tvShow', id],
    queryFn: () => tmdbApi.get(`/tv/${id}`).then(res => res.data),
    staleTime: 300000
  });

  // Fetch season details
  const { data: seasonData, isLoading } = useQuery({
    queryKey: ['seasonDetails', id, season],
    queryFn: () => tmdbApi.get(`/tv/${id}/season/${season}`).then(res => res.data),
    staleTime: 300000
  });

  const getEpisodeLink = (seasonNumber, episodeNumber) => {
    return `/player/tv/${slug}/${seasonNumber}/${episodeNumber}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#82BC87] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${showData?.name} - Season ${season}`}
        description={`Watch all episodes from Season ${season} of ${showData?.name} on Playex`}
        image={`https://image.tmdb.org/t/p/w1280${showData?.backdrop_path}`}
        url={window.location.href}
        type="video.tv_show"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
      >
        {/* Hero Section */}
        <div className="relative -mx-4 mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[40vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]"
          >
            <div className="absolute inset-0">
              <img
                src={tmdbHelpers.getImageUrl(seasonData?.poster_path || showData?.backdrop_path, 'original')}
                alt={showData?.name}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-gray-900/50 to-transparent" />
            </div>
            <div className="container relative mx-auto px-4 h-full flex items-center z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl space-y-6"
              >
                {/* Badges Section */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Episodes Count Badge */}
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 backdrop-blur-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                    </span>
                    <span className="text-[#82BC87] font-medium">{seasonData?.episodes?.length || 0} Episodes</span>
                  </div>

                  {/* Currently Playing Badge */}
                  {currentEpisode && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-1.5 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87]" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#82BC87]" />
                        </div>
                        <span className="text-[#82BC87] text-sm font-medium">
                          Currently Playing: Episode {currentEpisode}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Show Title & Season Info */}
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                    {showData?.name}
                    <span className="block mt-2 text-2xl md:text-3xl bg-gradient-to-r from-[#82BC87] to-[#E4D981] bg-clip-text text-transparent">
                      {seasonData?.name}
                    </span>
                  </h1>
                  <p className="text-gray-400 mt-4 max-w-2xl">
                    {seasonData?.overview || `All episodes from Season ${season} of ${showData?.name}.`}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Episodes Grid - Updated to match SeasonsAccordion style */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#82BC87]/20 rounded-full filter blur-[100px]" />
              <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[120px]" />
            </div>

            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Season {season} Episodes</h2>
                    <p className="text-gray-400 text-sm">
                      {seasonData?.episodes?.length || 0} episodes available
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {seasonData?.episodes?.map((episode, index) => (
                      <motion.div
                        key={episode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link 
                          to={getEpisodeLink(season, episode.episode_number)}
                          className="block bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-700/50 transition-all duration-300 group h-full"
                        >
                          <div className="flex flex-row h-full">
                            {/* Episode Image */}
                            <div className="w-[180px] relative">
                              <div className="h-full">
                                <img
                                  src={tmdbHelpers.getImageUrl(episode.still_path) || 'https://via.placeholder.com/500x281?text=No+Preview'}
                                  alt={episode.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
                              </div>
                              
                              {/* Episode Number Badge */}
                              <div className="absolute top-2 left-2 bg-[#82BC87]/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm font-medium">
                                Episode {episode.episode_number}
                              </div>

                              {/* Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-[#82BC87] rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* Episode Info */}
                            <div className="flex-1 p-4">
                              <div className="h-full flex flex-col justify-between">
                                <div>
                                  <h3 className="text-lg font-bold text-white group-hover:text-[#82BC87] transition-colors duration-300 line-clamp-1">
                                    {episode.name}
                                  </h3>
                                  <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                                    {episode.overview || 'No description available.'}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-4 mt-2">
                                  {episode.runtime && (
                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      {tmdbHelpers.formatRuntime(episode.runtime)}
                                    </span>
                                  )}
                                  {episode.vote_average > 0 && (
                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      {episode.vote_average.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default EpisodesPage;