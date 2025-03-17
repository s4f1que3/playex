// File: frontend/src/components/media/SeasonsAccordion.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, tmdbHelpers } from '../../utils/api';
import { getLastWatchedEpisode } from '../../utils/LocalStorage';
import Spinner from '../common/Spinner';
import VideosButton from './VideosButton';

const SeasonsAccordion = ({ tvId, seasons, activeSeason, setActiveSeason }) => {
  const [isEpisodesExpanded, setIsEpisodesExpanded] = useState(true);
  const [lastWatched, setLastWatched] = useState(null);

  useEffect(() => {
    const lastWatchedData = getLastWatchedEpisode(tvId);
    setLastWatched(lastWatchedData);
  }, [tvId]);

  const { data: seasonDetails, isLoading } = useQuery({
    queryKey: ['seasonDetails', tvId, activeSeason],
    queryFn: () => tmdbApi.get(`/tv/${tvId}/season/${activeSeason}`).then(res => res.data),
    enabled: !!tvId && !!activeSeason,
    staleTime: 300000 // 5 minutes
  });

  const filteredSeasons = seasons.filter(season => season.season_number > 0);

  if (!seasons || seasons.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        No seasons information available.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/>
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E4D981] flex items-center justify-center text-xs font-bold">
              {seasons.length}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Seasons & Episodes</h2>
            <p className="text-gray-400 text-sm">Browse all available content</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <VideosButton mediaType="tv" mediaId={tvId} seasonNumber={activeSeason} />
          <button 
            onClick={() => setIsEpisodesExpanded(!isEpisodesExpanded)}
            className="group relative px-4 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300"
          >
            <span className="relative flex items-center gap-2 text-gray-300 group-hover:text-white">
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                animate={{ rotate: isEpisodesExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </motion.svg>
              {isEpisodesExpanded ? 'Collapse' : 'Expand'}
            </span>
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-y-0 right-0 w-24 pointer-events-none bg-gradient-to-l from-[#161616] to-transparent z-10" />
        <div className="flex overflow-x-auto pb-2 mb-6 -mx-2 px-2">
          <div className="flex gap-2">
            {seasons
              .filter(season => season.season_number > 0)
              .map((season) => (
                <motion.button
                  key={season.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSeason(season.season_number)}
                  className={`relative group px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeSeason === season.season_number
                      ? 'bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white shadow-lg'
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#82BC87]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative font-medium">{season.name}</span>
                </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Episodes Container - Modified for horizontal layout */}
      <AnimatePresence mode="wait">
        {isEpisodesExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative mt-8"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#82BC87]/20 rounded-full filter blur-[100px]" />
              <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[120px]" />
            </div>

            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Season {activeSeason} Episodes</h2>
                    <p className="text-gray-400 text-sm">
                      {seasonDetails?.episodes?.length || 0} episodes available
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {seasonDetails?.episodes?.map((episode, index) => (
                      <motion.div
                        key={episode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link 
                          to={`/player/tv/${tvId}/${activeSeason}/${episode.episode_number}`}
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
        )}
      </AnimatePresence>

      {!isEpisodesExpanded && seasonDetails?.episodes && (
        <div className="text-gray-400 mt-4 bg-gray-800 bg-opacity-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span>
              <span className="text-white font-medium">{seasonDetails.episodes.length}</span> episodes available in {seasonDetails.name || `Season ${activeSeason}`}
            </span>
            <Link 
              to={`/player/tv/${tvId}/${activeSeason}/1`}
              className="bg-[#82BC87] hover:bg-[#6da972] text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
            >
              Play Episode 1
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </Link>
          </div>
        </div>
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4">
            <div className="w-6 h-6 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">Loading episodes...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SeasonsAccordion;