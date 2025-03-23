// File: frontend/src/components/media/MediaInfo.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbHelpers } from '../../utils/api';

const RatingCircle = ({ rating }) => (
  <div className="absolute -top-6 -right-6 w-20 h-20 bg-gray-900/80 backdrop-blur-sm rounded-full p-1.5 transform hover:scale-110 transition-all duration-300">
    <div className="relative w-full h-full">
      {/* Background circle */}
      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
        <circle 
          cx="18" cy="18" r="16" 
          fill="none" 
          className="stroke-gray-800" 
          strokeWidth="3"
        />
        {/* Animated rating circle */}
        <motion.circle 
          cx="18" cy="18" r="16"
          fill="none"
          className="stroke-[#FF4081]"
          strokeWidth="3"
          strokeDasharray={`${rating * 10}, 100`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: rating / 10 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
      </svg>
      
      {/* Rating text with glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <span className="text-xl font-bold text-white drop-shadow-glow">
            {rating.toFixed(1)}
          </span>
          <span className="block text-[10px] text-gray-400 uppercase tracking-wider">
            rating
          </span>
        </motion.div>
      </div>
      
      {/* Decorative outer ring */}
      <div className="absolute -inset-1 rounded-full border border-[#82BC87]/20 blur-[1px]" />
    </div>
  </div>
);

const MediaInfo = ({ media, mediaType }) => {
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  if (!media) return null;
  
  const {
    id,
    title,
    name,
    overview,
    poster_path,
    backdrop_path,
    vote_average,
    release_date,
    first_air_date,
    runtime,
    episode_run_time,
    genres,
    production_companies,
    number_of_seasons,
    number_of_episodes,
    created_by,
    status,
  } = media;
  
  // Format media info
  const releaseYear = release_date || first_air_date
    ? new Date(release_date || first_air_date).getFullYear()
    : 'Unknown';
    
  const formattedRuntime = mediaType === 'movie'
    ? tmdbHelpers.formatRuntime(runtime)
    : episode_run_time && episode_run_time.length > 0
      ? tmdbHelpers.formatRuntime(episode_run_time[0])
      : 'Unknown';
      
  const rating = vote_average ? (vote_average / 10) * 5 : 0;
  
  // Determine if overview needs "read more" toggle
  const isLongOverview = overview && overview.length > 300;
  const displayOverview = showFullOverview ? overview : (isLongOverview ? `${overview.substring(0, 300)}...` : overview);
  
  // Format media tag
  const mediaTag = tmdbHelpers.getMediaTag(
    mediaType,
    releaseYear,
    formattedRuntime,
    number_of_seasons,
    number_of_episodes
  );

  // Add content rating parsing
  const getContentRating = (media) => {
    if (mediaType === 'movie') {
      // Use US rating from release_dates
      const usRating = media.release_dates?.results?.find(r => r.iso_3166_1 === 'US');
      return usRating?.release_dates[0]?.certification || 'NR';
    } else {
      // Use US rating from content_ratings
      const usRating = media.content_ratings?.results?.find(r => r.iso_3166_1 === 'US');
      return usRating?.rating || 'NR';
    }
  };
  
  return (
    <div className="relative min-h-[70vh] flex items-end">
      {/* Enhanced Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-0"
      >
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: isImageLoaded ? 1 : 0 }}
            transition={{ duration: 1.5 }}
            src={tmdbHelpers.getImageUrl(backdrop_path, 'original')}
            alt=""
            onLoad={() => setIsImageLoaded(true)}
            className="w-full h-full object-cover object-top"
          />
          {/* Sophisticated Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161616] via-[#161616]/80 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 container mx-auto px-4 py-12"
      >
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Enhanced Poster Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="md:w-1/3 lg:w-1/4 flex-shrink-0"
          >
            <div className="relative group">
              {/* Poster Container */}
              <div className="aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-white/10 
                            transform transition-all duration-500 group-hover:ring-[#82BC87]/50 
                            group-hover:shadow-[0_0_30px_rgba(130,188,135,0.3)]">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7 }}
                  src={tmdbHelpers.getImageUrl(poster_path)}
                  alt={title || name}
                  className="w-full h-full object-cover transform transition-transform duration-700 
                           group-hover:scale-110"
                />
                
                {/* Enhanced Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium">
                      {mediaType === 'movie' ? 'Movie' : 'TV Series'}
                    </p>
                    <p className="text-[#82BC87] text-xs">
                      {releaseYear} • {formattedRuntime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Rating Circle */}
              <RatingCircle rating={vote_average} />

              {/* Decorative Corner Accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#82BC87]/20 rounded-tl-xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#82BC87]/20 rounded-br-xl" />
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex-1 space-y-6"
          >
            {/* Title Section */}
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
              >
                {title || name}
              </motion.h1>
              
              {/* Enhanced Tags Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap items-center gap-3 mt-4"
              >
                {/* Add this before other tags */}
                {getContentRating(media) && (
                  <div className="px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF6B6B]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white font-medium">{getContentRating(media)}</span>
                  </div>
                )}
                {releaseYear && (
                  <Link
                    to={`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}?${
                      mediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year'
                    }=${releaseYear}`}
                    className="text-[#FF6B6B] hover:text-[#FF4081] transition-colors duration-300 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {releaseYear}
                  </Link>
                )}
                
                <Link
                  to={`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}`}
                  className="text-[#FF6B6B] hover:text-[#FF4081] transition-colors duration-300 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    {mediaType === 'movie' ? (
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    ) : (
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                    )}
                  </svg>
                  {mediaType === 'movie' ? 'Movie' : 'TV Series'}
                </Link>
                
                {runtime && (
                  <span className="text-[#E6C6BB] bg-gray-800/60 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {tmdbHelpers.formatRuntime(runtime)}
                  </span>
                )}
                
                {status && (
                  <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-sm">
                    {status}
                  </span>
                )}
                
                {/* Rating stars */}
                <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill={star <= Math.round(rating) ? '#E4D981' : 'none'} 
                        stroke={star <= Math.round(rating) ? '#E4D981' : '#6B7280'} 
                        className="w-4 h-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-white">
                    {(vote_average / 2).toFixed(1)}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Overview Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="relative"
            >
              <p className={`text-gray-300 text-lg leading-relaxed ${
                !showFullOverview && overview?.length > 300 ? 'line-clamp-3' : ''
              }`}>
                {overview}
              </p>
              
              {overview?.length > 300 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="mt-2 text-[#82BC87] hover:text-[#E4D981] transition-colors duration-300 
                           flex items-center gap-2"
                >
                  <span>{showFullOverview ? 'Show Less' : 'Read More'}</span>
                  <motion.svg
                    animate={{ rotate: showFullOverview ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </motion.svg>
                </motion.button>
              )}
            </motion.div>

            {/* Additional Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
            >
              {/* Production Companies */}
              {production_companies && production_companies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Production</h3>
                  <ul className="text-gray-300">
                    {production_companies.slice(0, 3).map((company) => (
                      <li key={company.id}>{company.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* TV Show specific info */}
              {mediaType === 'tv' && created_by && created_by.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Created By</h3>
                  <ul className="text-gray-300">
                    {created_by.map((creator) => (
                      <li key={creator.id}>{creator.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MediaInfo;