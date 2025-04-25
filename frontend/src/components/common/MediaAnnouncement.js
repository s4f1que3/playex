import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_API_KEY = '79a60fbe7c4e5877279cae559d9cf5c3';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

const defaultProps = {
  tmdbId: '',
  type: 'tv_season',
  title: '',
  season: 1,
  episode: 1,
  releaseDate: new Date().toISOString(),
  description: '',
  badge: '',
  cta: {
    text: 'Watch Now',
    link: '#'
  },
  theme: {
    primary: '#82BC87',
    secondary: '#E4D981'
  }
};

const MediaAnnouncement = ({ announcement = defaultProps }) => {
  const mergedAnnouncement = {
    ...defaultProps,
    ...announcement
  };

  const [mediaInfo, setMediaInfo] = useState(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [posterPath, setPosterPath] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [mediaDetails, setMediaDetails] = useState({
    rating: '0',
    genres: [],
    runtime: '',
    maturityRating: ''
  });

  useEffect(() => {
    const fetchMediaInfo = async () => {
      if (!mergedAnnouncement?.tmdbId) return;
      
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OWE2MGZiZTdjNGU1ODc3Mjc5Y2FlNTU5ZDljZjVjMyIsInN1YiI6IjY1NGQwNDI4MjkzODM1MDExZDRjMzE5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dNZI1nqN9KyHEgGFpYRE1QPYww_MaHp7ISVIBsFyeF0`
          }
        };

        // Fetch main media data
        const mediaEndpoint = mergedAnnouncement.type === 'movie' 
          ? `${TMDB_API_BASE_URL}/movie/${mergedAnnouncement.tmdbId}`
          : `${TMDB_API_BASE_URL}/tv/${mergedAnnouncement.tmdbId}`;

        const mediaResponse = await fetch(mediaEndpoint, options);
        if (!mediaResponse.ok) throw new Error(`HTTP error! status: ${mediaResponse.status}`);
        const mediaData = await mediaResponse.json();

        // Fetch additional content ratings for TV shows
        let contentRating = 'NR';
        if (mergedAnnouncement.type === 'tv_season') {
          const ratingsResponse = await fetch(
            `${TMDB_API_BASE_URL}/tv/${mergedAnnouncement.tmdbId}/content_ratings`,
            options
          );
          if (ratingsResponse.ok) {
            const ratingsData = await ratingsResponse.json();
            const usRating = ratingsData.results?.find(r => r.iso_3166_1 === 'US');
            contentRating = usRating?.rating || 'NR';
          }
        }

        // Set media details
        setMediaDetails({
          rating: mediaData.vote_average.toFixed(1),
          genres: mediaData.genres.map(g => g.name),
          runtime: mergedAnnouncement.type === 'movie' 
            ? `${mediaData.runtime}m`
            : mediaData.episode_run_time?.[0] ? `${mediaData.episode_run_time[0]}m` : '',
          maturityRating: contentRating
        });

        // Set poster
        if (mediaData.poster_path) {
          setPosterPath(`${TMDB_IMAGE_BASE_URL}${mediaData.poster_path}`);
        }

      } catch (error) {
        console.error('Error fetching media data:', error);
        setImageError(true);
      }
    };

    fetchMediaInfo();
  }, [mergedAnnouncement?.tmdbId, mergedAnnouncement?.type]);

  useEffect(() => {
    if (!mergedAnnouncement?.title || !mergedAnnouncement?.season) return;
    
    const isDismissed = localStorage.getItem(
      `announcement_${mergedAnnouncement.title}_${mergedAnnouncement.season}`
    );
    if (isDismissed) {
      setShowAnnouncement(false);
    }
  }, [mergedAnnouncement?.title, mergedAnnouncement?.season]);

  const handleDismiss = () => {
    localStorage.setItem(`announcement_${announcement.title}_${announcement.season}`, 'true');
    setShowAnnouncement(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {showAnnouncement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 mb-2"  // Reduced margin bottom
        >
          <div className="relative">
            {/* Background Effects */}
            <div className={`absolute inset-0 bg-gradient-to-r from-${mergedAnnouncement.theme.primary}/20 via-${mergedAnnouncement.theme.secondary}/20 to-${mergedAnnouncement.theme.primary}/20 animate-gradient-x`} />
            <div className="absolute inset-0 backdrop-blur-xl bg-black/80" />

            {/* Content Container */}
            <div className="relative">
              <motion.div
                animate={isMinimized ? { height: "40px" } : { height: "auto" }}  // Reduced height
                transition={{ duration: 0.3 }}
                className="container mx-auto px-3"  // Reduced padding
              >
                <div className="py-3">  
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-1">  
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <span className="flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${mergedAnnouncement.theme.primary} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 bg-${mergedAnnouncement.theme.primary}`}></span>
                          </span>
                        </div>
                        <motion.span className={`text-${mergedAnnouncement.theme.primary} font-medium tracking-wide`}>
                          {mergedAnnouncement.badge}
                        </motion.span>
                      </div>
                      <div className="h-4 w-px bg-gray-700" />
                      <motion.div className="text-sm text-gray-400">
                        Released {formatDate(mergedAnnouncement.releaseDate)}
                      </motion.div>
                    </div>

                    {/* Control buttons */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 rounded-lg hover:bg-white/5 transition-colors duration-300"
                      >
                        <motion.svg
                          animate={{ rotate: isMinimized ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </motion.svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDismiss}
                        className="p-1 rounded-lg hover:bg-white/5 transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <AnimatePresence>
                    {!isMinimized && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3"> 
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-3"> 
                            {/* Poster Image */}
                            <div className="flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden bg-gray-800">  
                              {(posterPath && !imageError) ? (
                                <img 
                                  src={posterPath}
                                  alt={`${mergedAnnouncement.title} Poster`}
                                  className="w-full h-full object-cover"
                                  onError={() => setImageError(true)}
                                  loading="eager"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <h3 className="text-xl font-bold text-white">  {/* Increased size */}
                                {mergedAnnouncement.title}
                                {mergedAnnouncement.type === 'tv_season' && ` - Season ${mergedAnnouncement.season}`}
                              </h3>
                              
                              {/* Rating and Tags Row */}
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                  </svg>
                                  <span className="font-semibold text-white">{mediaDetails.rating}</span>
                                </div>
                                <div className="h-4 w-px bg-gray-700"/>
                                <span className="text-gray-400">{mediaDetails.maturityRating}</span>
                                <div className="h-4 w-px bg-gray-700"/>
                                <span className="text-gray-400">{mediaDetails.runtime}</span>
                              </div>

                              {/* Genre Tags */}
                              <div className="flex flex-wrap gap-2">
                                {mediaDetails.genres?.map((genre, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 text-xs rounded-md bg-white/10 text-gray-300"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>

                              <p className="text-gray-300 text-sm leading-relaxed"> {/* Increased size */}
                                {mergedAnnouncement.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                  inline-flex items-center
                                  px-5 py-2.5
                                  rounded-lg
                                  bg-gradient-to-r from-${mergedAnnouncement.theme.primary} to-${mergedAnnouncement.theme.secondary}
                                  text-white
                                  transition-all duration-200
                                  hover:opacity-90
                                `}
                              >
                                <a href={mergedAnnouncement.cta.link} className="flex items-center gap-2">
                                  <span className="text-sm font-semibold tracking-wide">
                                    {mergedAnnouncement.cta.text}
                                  </span>
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                </a>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaAnnouncement;