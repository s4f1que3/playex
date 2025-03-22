// File: frontend/src/components/media/MediaActions.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../utils/api';
import ConfirmationDialog from '../common/ConfirmationDialog';
import VideosButton from './VideosButton';
import { 
  toggleFavorites, 
  toggleWatchlist, 
  isInFavorites, 
  isInWatchlist,
  getLastWatchedEpisode, 
  setLastWatchedEpisode 
} from '../../utils/LocalStorage';
import { motion } from 'framer-motion';
import { createMediaUrl } from '../../utils/slugify';

const ActionButton = ({ onClick, icon, text, isActive, isLoading, variant = 'primary' }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={isLoading}
    className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm z-10
      transition-all duration-500 flex items-center justify-center gap-3 flex-1 md:flex-none
      ${variant === 'primary' 
        ? 'bg-gradient-to-br from-white/10 to-white/5 text-white hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 border border-white/20'
        : isActive
          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          : 'bg-black/20 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/20'
      }`}
  >
    {/* Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 z-0" />
    
    {/* Inner Container */}
    <div className="relative z-10 px-6 py-3.5 flex items-center gap-3">
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-current border-r-transparent animate-spin" />
          <span className="font-medium">Loading...</span>
        </div>
      ) : (
        <>
          <motion.div
            initial={false}
            animate={{ 
              scale: isActive ? [1, 1.1, 1] : 1,
              rotate: isActive ? [0, 180, 360] : 0 
            }}
            transition={{ duration: 0.5 }}
            className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors duration-300`}
          >
            {icon}
          </motion.div>
          
          <motion.span
            className="font-medium tracking-wide whitespace-nowrap transition-colors duration-300"
            animate={{ x: isActive ? [0, 2, 0] : 0 }}
            transition={{ duration: 0.3 }}
          >
            {text}
          </motion.span>
        </>
      )}
    </div>

    {/* Hover Border Effect */}
    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0
      ${variant === 'primary' 
        ? 'shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]' 
        : isActive 
          ? 'shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]'
          : ''}`} 
    />
  </motion.button>
);

const MediaActions = ({ 
  media, 
  mediaType, 
  onActionComplete, 
  activeSeason = 1,
  showVideosButton = false
}) => {

  const navigate = useNavigate();

  const { data: firstEpisodeData } = useQuery({
    queryKey: ['firstEpisode', media.id, activeSeason],
    queryFn: async () => {
      if (mediaType === 'tv') {
        const response = await tmdbApi.get(`/tv/${media.id}/season/${activeSeason}`);
        return response.data.episodes[0];
      }
      return null;
    },
    enabled: mediaType === 'tv'
  });
  
  const [loading, setLoading] = useState({
    watchlist: false,
    favorites: false
  });
  const [watchlist, setWatchlist] = useState(isInWatchlist(media.id, mediaType));
  const [favorites, setFavorites] = useState(isInFavorites(media.id, mediaType));
  const [dialog, setDialog] = useState({ isOpen: false, type: null });
  const [lastWatched, setLastWatched] = useState(null);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [showVideosDialog, setShowVideosDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { data: videosData } = useQuery({
    queryKey: ['videos', media.id, mediaType],
    queryFn: () => tmdbApi.get(`/${mediaType}/${media.id}/videos`).then(res => res.data),
    enabled: showVideosDialog,
    staleTime: 300000 // 5 minutes
  });

  useEffect(() => {
    const checkStatus = () => {
      const watchlistStatus = isInWatchlist(media.id, mediaType);
      const favoritesStatus = isInFavorites(media.id, mediaType);
      
      setWatchlist(watchlistStatus);
      setFavorites(favoritesStatus);
    };

    checkStatus();
    
    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, [media.id, mediaType]);
  
  useEffect(() => {
    if (mediaType === 'tv') {
      const lastWatchedData = getLastWatchedEpisode(media.id);
      setLastWatched(lastWatchedData);
    }
  }, [media.id, mediaType]);

  const handleWatchlist = () => {
    try {
      setLoading({ ...loading, watchlist: true });
      
      if (watchlist) {
        setDialog({
          isOpen: true,
          type: 'watchlist',
          title: 'Remove from Watchlist',
          message: 'Are you sure you want to remove this from your watchlist?',
          onConfirm: () => {
            toggleWatchlist(media.id, mediaType, media);
            setWatchlist(false);
            setDialog({ isOpen: false });
            if (onActionComplete) onActionComplete('watchlist', false);
          }
        });
      } else {
        toggleWatchlist(media.id, mediaType, media);
        setWatchlist(true);
        if (onActionComplete) onActionComplete('watchlist', true);
      }
    } finally {
      setLoading({ ...loading, watchlist: false });
    }
  };

  const handleFavorites = () => {
    try {
      setLoading({ ...loading, favorites: true });
      
      if (favorites) {
        setDialog({
          isOpen: true,
          type: 'favorites',
          title: 'Remove from Favorites',
          message: 'Are you sure you want to remove this from your favorites?',
          onConfirm: () => {
            toggleFavorites(media.id, mediaType, media);
            setFavorites(false);
            setDialog({ isOpen: false });
            if (onActionComplete) onActionComplete('favorites', false);
          }
        });
      } else {
        toggleFavorites(media.id, mediaType, media);
        setFavorites(true);
        if (onActionComplete) onActionComplete('favorites', true);
      }
    } finally {
      setLoading({ ...loading, favorites: false });
    }
  };

  const handleWatchClick = () => {
    const slug = createMediaUrl(mediaType, media.id, media.title || media.name).split('/')[2];
    if (mediaType === 'movie') {
      navigate(`/player/movie/${slug}`);
    } else {
      navigate(`/player/tv/${slug}/${activeSeason}/1`);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Background Effects - Modified z-index */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-[100px] animate-pulse opacity-50" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-[100px] animate-pulse opacity-50" />
      </div>

      {/* Main Container - Ensure clickability */}
      <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl border border-white/5 p-8 z-10">
        {/* Action Buttons Grid */}
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4">
          <ActionButton
            variant="primary"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            }
            text={lastWatched 
              ? `Continue S${lastWatched.season} E${lastWatched.episode}`
              : mediaType === 'movie' 
                ? 'Watch Now' 
                : `Start S${activeSeason} E1`}
            onClick={handleWatchClick}
          />

          <ActionButton
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={watchlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            }
            text={watchlist ? 'In Watchlist' : 'Add to Watchlist'}
            isActive={watchlist}
            isLoading={loading.watchlist}
            onClick={handleWatchlist}
          />

          <ActionButton
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={favorites ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            text={favorites ? 'In Favorites' : 'Add to Favorites'}
            isActive={favorites}
            isLoading={loading.favorites}
            onClick={handleFavorites}
          />

          {showVideosButton && (
            <>
              <ActionButton
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                }
                text="Videos"
                onClick={() => setShowVideosDialog(true)}
              />

              {showVideosDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  {/* Dark overlay with stronger blur */}
                  <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-xl" 
                    onClick={() => setShowVideosDialog(false)} 
                  />
                  
                  <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white">Available Videos</h2>
                            <p className="text-gray-400 text-sm">Trailers, teasers, and more</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowVideosDialog(false)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Videos Grid - Add scrolling to this section only */}
                      <div className="p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {videosData?.results?.map((video) => (
                            <motion.div
                              key={video.key}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="group relative aspect-video bg-black/50 rounded-xl overflow-hidden border border-white/10"
                            >
                              <img
                                src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                                alt={video.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                              <a
                                href={`https://www.youtube.com/watch?v=${video.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex flex-col justify-end p-4"
                              >
                                <div className="flex items-center gap-2 text-[#82BC87]">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm font-medium">{video.type}</span>
                                </div>
                                <h3 className="text-white font-medium mt-1 line-clamp-2">{video.name}</h3>
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pattern Overlay - Modified z-index */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden mix-blend-overlay opacity-5 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog({ isOpen: false })}
      />
    </motion.div>
  );
};

export default MediaActions;