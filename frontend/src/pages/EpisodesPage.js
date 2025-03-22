import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import { createMediaUrl } from '../utils/slugify';
import { useSlugResolver } from '../hooks/useSlugResolver';

const EpisodesPage = () => {
  const { slug, season } = useParams();
  const { id, loading } = useSlugResolver('tv', slug);

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
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-6 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                </span>
                <span className="text-[#82BC87] font-medium">Season {season}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {showData?.name}
              </h1>
              <p className="text-2xl text-[#82BC87]">
                {seasonData?.name}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Episodes Grid */}
      <div className="container mx-auto px-4">
        <div className="grid gap-6">
          <AnimatePresence>
            {seasonData?.episodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={getEpisodeLink(season, episode.episode_number)}
                  className="block bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden hover:border-[#82BC87]/20 transition-all duration-500 group"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Episode Thumbnail */}
                    <div className="md:w-80 relative">
                      <div className="aspect-video md:aspect-[16/9]">
                        <img
                          src={tmdbHelpers.getImageUrl(episode.still_path) || 'https://via.placeholder.com/500x281?text=No+Preview'}
                          alt={episode.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-[#82BC87] rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Episode Info */}
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-[#82BC87] transition-colors duration-300">
                            {episode.name}
                          </h3>
                          <p className="text-[#82BC87] mt-1">
                            Episode {episode.episode_number}
                          </p>
                        </div>
                        
                        {episode.vote_average > 0 && (
                          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white text-sm">{episode.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-400 mt-4 line-clamp-2 md:line-clamp-none">
                        {episode.overview || 'No description available.'}
                      </p>

                      {episode.runtime && (
                        <div className="mt-4 flex items-center gap-2 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>{tmdbHelpers.formatRuntime(episode.runtime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default EpisodesPage;
