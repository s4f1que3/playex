import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, Transition } from '@headlessui/react';
import { tmdbApi, tmdbHelpers } from '../../utils/api';
import { getLastWatchedEpisode } from '../../utils/LocalStorage';
import Spinner from '../common/Spinner';
import VideosButton from './VideosButton';
import { createMediaUrl } from '../../utils/slugify';

const SeasonPicker = ({ seasons, activeSeason, setActiveSeason }) => {
  const activeSeasionInfo = seasons.find(s => s.season_number === activeSeason);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(window.innerHeight * 0.8, 600); // 80vh or 600px, whichever is smaller
      
      // If space below is not enough, position above the button
      const top = spaceBelow < dropdownHeight 
        ? Math.max(rect.top - dropdownHeight, 20) // Position above with min 20px from top
        : rect.bottom + window.scrollY; // Position below

      setDropdownPosition({
        top,
        left: rect.left + window.scrollX
      });
    }
  };
  
  // Update position on scroll and resize
  useEffect(() => {
    const handleScroll = () => {
      updatePosition();
    };
    
    const handleResize = () => {
      updatePosition();
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Adjust the dropdown on open/close
  useEffect(() => {
    updatePosition();
  }, [activeSeason]);

  return (
    <Listbox value={activeSeason} onChange={setActiveSeason}>
      <div className="relative mt-1">
        <Listbox.Button 
          ref={buttonRef}
          onClick={updatePosition}
          className="relative w-full md:w-80 cursor-pointer rounded-lg bg-gray-900/90 backdrop-blur-xl 
                     py-3.5 pl-4 pr-8 text-left border border-white/10 
                     hover:border-[#82BC87]/30 hover:shadow-[0_0_30px_rgba(130,188,135,0.1)]
                     transition-all duration-500 group"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-12 h-[4.5rem] rounded-lg bg-[#82BC87]/10 overflow-hidden flex-shrink-0
                         relative group-hover:ring-1 group-hover:ring-[#82BC87]/30 
                         transition-all duration-300 shadow-lg"
            >
              {activeSeasionInfo?.poster_path ? (
                <>
                  <img
                    src={tmdbHelpers.getImageUrl(activeSeasionInfo.poster_path, 'w342')}
                    alt={activeSeasionInfo.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-transparent 
                                group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#82BC87]/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/>
                  </svg>
                </div>
              )}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <span className="block text-xs text-[#82BC87] group-hover:text-[#82BC87] transition-colors duration-300">
                Currently Selected
              </span>
              <span className="block text-base font-semibold text-white truncate group-hover:text-white transition-colors duration-300">
                {activeSeasionInfo?.name || `Season ${activeSeason}`}
              </span>
            </div>
          </div>
          
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <motion.svg 
              animate={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-[#82BC87]" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z" clipRule="evenodd" />
            </motion.svg>
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options 
            className="fixed z-[100] w-[95vw] md:w-[500px] overflow-auto rounded-lg 
                      bg-gray-900/95 backdrop-blur-xl py-2 border border-white/10 
                      shadow-[0_0_50px_rgba(0,0,0,0.3)]"
            style={{
              left: `${dropdownPosition.left}px`,
              top: `${dropdownPosition.top}px`,
              maxHeight: '80vh'
            }}
          >
            <div className="px-3 py-2 border-b border-white/5 mb-2">
              <div className="text-sm text-gray-400">Select Season</div>
              <div className="text-xs text-gray-500">{seasons.length} seasons available</div>
            </div>
            <div className="px-3">
              <div className="grid grid-cols-1 gap-2">
                {seasons.filter(season => season.season_number > 0).map((season, index) => (
                  <Listbox.Option
                    key={season.id}
                    value={season.season_number}
                    className={({ active, selected }) => `
                      relative cursor-pointer select-none py-2 px-3 rounded-lg
                      ${active ? 'bg-[#82BC87]/10' : ''}
                      ${selected ? 'bg-[#82BC87]/20' : ''}
                    `}
                  >
                    {({ active, selected }) => (
                      <motion.div 
                        initial={false}
                        animate={{ x: selected ? 5 : 0 }}
                        className="flex items-center gap-3"
                      >
                        <div className="relative h-24 w-16 flex-shrink-0">
                          {season.poster_path ? (
                            <img
                              src={tmdbHelpers.getImageUrl(season.poster_path, 'w185')}
                              alt={season.name}
                              className="w-full h-full rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-md bg-gray-800 flex items-center justify-center">
                              <span className="text-gray-500 text-xl font-bold">{season.season_number}</span>
                            </div>
                          )}
                          {selected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#82BC87] rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-semibold text-white">{season.name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {season.episode_count} Episodes
                            {season.air_date && ` • ${new Date(season.air_date).getFullYear()}`}
                          </div>
                          {season.overview && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {season.overview}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            </div>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

const EpisodeCard = ({ episode, seasonNumber, tvId, tvName, index }) => {
  const episodeLink = `/player/tv/${createMediaUrl('tv', tvId, tvName).split('/').pop()}/${seasonNumber}/${episode.episode_number}`;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link 
        to={episodeLink}
        className="group relative block bg-gray-800/30 hover:bg-gray-700/30 backdrop-blur-sm 
                   rounded-lg overflow-hidden transition-all duration-500 h-full
                   hover:shadow-[0_0_30px_rgba(130,188,135,0.1)] border border-white/10 
                   hover:border-[#82BC87]/30"
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Episode Thumbnail */}
          <div className="md:w-[140px] relative aspect-video md:aspect-auto">
            <motion.div 
              animate={{ opacity: isImageLoaded ? 1 : 0 }}
              className="h-full"
            >
              <img
                src={tmdbHelpers.getImageUrl(episode.still_path) || 'https://via.placeholder.com/500x281?text=No+Preview'}
                alt={episode.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onLoad={() => setIsImageLoaded(true)}
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            </motion.div>

            {/* Episode Badge */}
            <div className="absolute top-2 left-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#82BC87]/90 backdrop-blur-sm text-white px-2 py-1 
                           rounded-lg text-xs font-medium shadow-lg"
              >
                Episode {episode.episode_number}
              </motion.div>
            </div>

            {/* Play Button */}
            <motion.div 
              initial={false}
              animate={{ scale: isImageLoaded ? 1 : 0 }}
              className="absolute inset-0 flex items-center justify-center opacity-0 
                         group-hover:opacity-100 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#82BC87] rounded-full p-3 shadow-[0_0_30px_rgba(130,188,135,0.3)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Episode Info */}
          <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
            <div>
              <motion.h3 
                className="text-base md:text-lg font-bold text-white group-hover:text-[#82BC87] 
                           transition-colors duration-300 line-clamp-1"
              >
                {episode.name}
              </motion.h3>
              <p className="text-gray-400 mt-1 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                {episode.overview || 'No description available.'}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {episode.runtime && (
                <span className="text-gray-400 text-sm flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {tmdbHelpers.formatRuntime(episode.runtime)}
                </span>
              )}
              {episode.vote_average > 0 && (
                <span className="text-gray-400 text-sm flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {episode.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const EpisodeIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-[#82BC87]/10 flex items-center justify-center relative group">
    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#82BC87]/10 to-transparent opacity-50" />
    <div className="relative flex items-center gap-[3px]">
      <div className="w-[3px] h-4 rounded-full bg-[#82BC87]/40 group-hover:bg-[#82BC87]/60 transition-colors duration-300" />
      <div className="w-[3px] h-3 rounded-full bg-[#82BC87] group-hover:bg-[#82BC87] transition-colors duration-300" />
      <div className="w-[3px] h-4 rounded-full bg-[#82BC87]/40 group-hover:bg-[#82BC87]/60 transition-colors duration-300" />
    </div>
  </div>
);

const SeasonsAccordion = ({ tvId, tvName, seasons, activeSeason, setActiveSeason }) => {
  const [isEpisodesExpanded, setIsEpisodesExpanded] = useState(true);
  const [lastWatched, setLastWatched] = useState(null);

  const preloadImages = (episodes) => {
    episodes?.forEach(episode => {
      if (episode.still_path) {
        const img = new Image();
        img.src = tmdbHelpers.getImageUrl(episode.still_path);
      }
    });
  };

  useEffect(() => {
    const lastWatchedData = getLastWatchedEpisode(tvId);
    setLastWatched(lastWatchedData);
  }, [tvId]);

  const { data: seasonDetails, isLoading } = useQuery({
    queryKey: ['seasonDetails', tvId, activeSeason],
    queryFn: () => tmdbApi.get(`/tv/${tvId}/season/${activeSeason}`).then(res => res.data),
    enabled: !!tvId && !!activeSeason,
    staleTime: 300000, // 5 minutes
    onSuccess: (data) => {
      preloadImages(data.episodes);
    }
  });

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
      className="py-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <SeasonPicker 
          seasons={seasons} 
          activeSeason={activeSeason} 
          setActiveSeason={setActiveSeason}
        />

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

      <AnimatePresence mode="wait">
        {isEpisodesExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative mt-6"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#82BC87]/20 rounded-full filter blur-[100px]" />
              <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[120px]" />
            </div>

            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <EpisodeIcon />
                  <div>
                    <h2 className="text-xl font-bold text-white">Season {activeSeason} Episodes</h2>
                    <p className="text-gray-400 text-sm">
                      {seasonDetails?.episodes?.length || 0} episodes available
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {seasonDetails?.episodes?.map((episode, index) => (
                      <EpisodeCard 
                        key={episode.id}
                        episode={episode}
                        seasonNumber={activeSeason}
                        tvId={tvId}
                        tvName={tvName}
                        index={index}
                      />
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
              to={`/player/tv/${createMediaUrl('tv', tvId, tvName).split('/').pop()}/${activeSeason}/1`}
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