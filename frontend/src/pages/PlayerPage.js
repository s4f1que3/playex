import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import VideoPlayer from '../components/media/VideoPlayer';
import { setLastWatchedEpisode, addToContinueWatching } from '../utils/LocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumLoader from '../components/common/PremiumLoader';
import { useSlugResolver } from '../hooks/useSlugResolver';
import { parseMediaUrl, createMediaUrl, getIdFromSlug } from '../utils/slugify';
import SEO from '../components/common/SEO';
import { setShowCompleted, removeShowCompleted } from '../utils/LocalStorage';

const PlayerPage = ({ mediaType }) => {
  const { slug, season, episode } = useParams();
  const { id, loading: slugLoading } = useSlugResolver(mediaType, slug);
  const navigate = useNavigate();
  
  // Set to true to show Nova as temporarily unavailable
  const NOVA_TEMPORARILY_UNAVAILABLE = true;
  
  const [playerType, setPlayerType] = useState(() => {
    return localStorage.getItem('preferredPlayer') || 'vidlink';
  });
  
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  useEffect(() => {
    if (mediaType === 'tv') {
      if (!season || !episode || !slug) {
        navigate(`/tv/${slug || ''}`);
      }
    }
  }, [mediaType, slug, season, episode, navigate]);

  const handlePlayerChange = (type) => {
    if (type === 'vidlink' && NOVA_TEMPORARILY_UNAVAILABLE) {
      setShowUnavailableModal(true);
      return;
    }
    localStorage.setItem('preferredPlayer', type);
    window.location.reload();
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['playerMedia', mediaType, id, season, episode],
    queryFn: async () => {
      if (playerType === 'vidlink' && NOVA_TEMPORARILY_UNAVAILABLE) {
        throw new Error('Nova is temporarily unavailable');
      }
      if (mediaType === 'movie') {
        return tmdbApi.get(`/movie/${id}`).then(res => res.data);
      } else if (mediaType === 'tv') {
        const [tvData, episodeData, seasonData] = await Promise.all([
          tmdbApi.get(`/tv/${id}`).then(res => res.data),
          tmdbApi.get(`/tv/${id}/season/${season}/episode/${episode}`).then(res => res.data),
          tmdbApi.get(`/tv/${id}/season/${season}`).then(res => res.data)
        ]);

        if (parseInt(episode) === seasonData.episodes.length && 
            tvData.seasons.find(s => s.season_number === parseInt(season) + 1)) {
          const nextSeasonData = await tmdbApi.get(`/tv/${id}/season/${parseInt(season) + 1}`).then(res => res.data);
          return { ...tvData, episode: episodeData, seasonData, nextSeasonData };
        }

        return { ...tvData, episode: episodeData, seasonData };
      }
    },
    staleTime: 300000,
    enabled: !(playerType === 'vidlink' && NOVA_TEMPORARILY_UNAVAILABLE)
  });
  
  useEffect(() => {
    if (!data) return;
    
    if (mediaType === 'tv') {
      setLastWatchedEpisode(id, season, episode);
      localStorage.setItem(`currentEpisode_${id}_${season}`, episode);
    }
    
    addToContinueWatching(id, mediaType, data);

    if (mediaType === 'tv' && data) {
      // Check if this is the last episode of the last season
      const isLastEpisode = episode === data?.season?.episodes?.length;
      const isLastSeason = season === data?.seasons?.length;
      
      if (isLastEpisode && isLastSeason) {
        setShowCompleted(id);
      } else {
        removeShowCompleted(id);
      }
    }
  }, [mediaType, id, season, episode, data]);
  
  if (isLoading) {
    return <PremiumLoader size="large" text="Preparing Content" overlay={true} />;
  }
  
  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded my-6">
        <p>Failed to load media. Please try again later.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-2xl mb-2">Media not found</p>
        <p>The requested content doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const title = mediaType === 'movie' ? data.title : data.name;
  const episodeTitle = mediaType === 'tv' ? data.episode.name : null;
  const releaseYear = mediaType === 'movie' 
    ? (data.release_date ? new Date(data.release_date).getFullYear() : '') 
    : (data.first_air_date ? new Date(data.first_air_date).getFullYear() : '');
  
  const createEpisodeLink = (seasonNum, episodeNum) => {
    if (!slug) return '#';
    return `/player/tv/${slug}/${seasonNum}/${episodeNum}`;
  };

  return (
    <>
      {/* Unavailable Modal */}
      <AnimatePresence>
        {showUnavailableModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUnavailableModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-[#82BC87]/20 to-[#E4D981]/20 rounded-2xl filter blur-xl" />
                
                <div className="relative bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Gradient accent top */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#82BC87] via-[#E4D981] to-transparent" />
                  
                  <div className="p-8 space-y-6">
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="flex justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center space-y-3"
                    >
                      <h2 className="text-2xl font-bold text-white">Nova is Temporarily Unavailable</h2>
                      <p className="text-gray-300 leading-relaxed">
                        We apologize for any inconvenience. Our team is working to restore this player as quickly as possible.
                      </p>
                      <p className="text-sm text-gray-400">
                        Please try using <span className="text-[#82BC87] font-medium">Surge</span> or <span className="text-[#82BC87] font-medium">Orion</span> instead.
                      </p>
                    </motion.div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => setShowUnavailableModal(false)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white font-medium hover:shadow-lg hover:shadow-[#82BC87]/50 transition-all duration-300 active:scale-95"
                    >
                      Got it
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SEO 
        title={`Watch ${data?.title || data?.name}`}
        description={`Stream ${data?.title || data?.name} in high quality on Playex`}
        image={`https://image.tmdb.org/t/p/w1280${data?.backdrop_path}`}
        type={mediaType === 'movie' ? 'video.movie' : 'video.episode'}
        url={window.location.href}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="-mx-4 -mt-6"
      >
        <div className="relative bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-[#161616]/50 to-transparent z-10 pointer-events-none" />
          <VideoPlayer 
            tmdbId={id} 
            mediaType={mediaType} 
            season={season} 
            episode={episode}
            playerType={playerType}
          />
        </div>

        <div className="relative bg-gradient-to-b from-black via-gray-900 to-transparent">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center">
              <div className="inline-flex gap-3 p-1 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl">
                {[
                  { id: 'mapple', displayName: 'Surge', icon: (
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                  )},
                  { id: 'vidlink', displayName: 'Nova', icon: (
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  )},
                  { id: 'vidsrc', displayName: 'Orion', icon: (
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  )}
                ].map(({ id, icon }) => (
                  <div key={id} className="relative">
                    {playerType === id && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[#82BC87]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3.5l-7 7h14l-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handlePlayerChange(id)}
                      disabled={(id === 'vidlink') && NOVA_TEMPORARILY_UNAVAILABLE}
                      className={`relative group px-6 py-3 rounded-xl transition-all duration-500 ${
                        playerType === id
                          ? 'bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white shadow-lg'
                          : 'hover:bg-white/5'
                      } ${(id === 'vidlink') && NOVA_TEMPORARILY_UNAVAILABLE ? 'opacity-60 cursor-not-allowed' : ''}`}
                      title={(id === 'vidlink') && NOVA_TEMPORARILY_UNAVAILABLE ? 'Nova is currently being improved by our team' : ''}
                    >
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#82BC87]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        playerType === id ? 'opacity-100' : ''
                      }`} />

                      {((id === 'vidlink') && NOVA_TEMPORARILY_UNAVAILABLE) && (
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <div className="relative px-4 py-3 bg-gradient-to-r from-purple-600/90 to-blue-600/90 rounded-xl whitespace-nowrap text-xs font-semibold text-white shadow-2xl backdrop-blur-sm border border-purple-400/30 animate-pulse">
                            ✨ Nova is taking a nap... Come back soon! 💤
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-3 h-3 bg-gradient-to-b from-purple-600/90 to-blue-600/90 rotate-45 border-r border-b border-purple-400/30"></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="relative flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transition-all duration-500 ${
                            playerType === id ? 'scale-110' : 'text-gray-400 group-hover:text-white'
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          {icon}
                        </svg>
                        <span className={`font-medium tracking-wide transition-all duration-500 ${
                          playerType === id
                            ? 'translate-x-0.5'
                            : 'text-gray-400 group-hover:text-white'
                        } ${(id === 'vidlink') && NOVA_TEMPORARILY_UNAVAILABLE ? 'line-through' : ''}`}>
                          {id === 'vidlink' ? 'Nova' : id === 'mapple' ? 'Surge' : 'Orion'}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {(playerType === 'vidlink' || playerType === 'mapple' || playerType === 'vidsrc') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 flex justify-center"
                >
                  <div className="px-4 py-2 rounded-xl bg-[#82BC87]/10 border border-[#82BC87]/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">
                        If {playerType === 'vidlink' ? 'Nova' : playerType === 'mapple' ? 'Surge' : playerType === 'vidsrc' ? 'Orion' : ''} isn't working, please try another player: 
                        <span> Ensure you have an</span>
                        <span className="
                        text-[#82BC87] font-medium ml-1 hover:text-[#6da972] 
                        cursor-pointer transition-colors duration-300"> 
                            <a href=
                            "/AdBlockers" target = "_blank" rel="noreferrer noopener">
                              ad blocker.</a>
                          </span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 left-1/4 w-96 h-96 bg-[#82BC87]/20 rounded-full filter blur-[100px] animate-pulse" />
              <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-[#E4D981]/20 rounded-full filter blur-[100px] animate-pulse" />
            </div>

            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/10">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {title}
                      {episodeTitle && (
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-2">
                          S{season} E{episode}: {episodeTitle}
                        </span>
                      )}
                    </h1>
                  </div>
                </motion.div>
              </div>

              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {/* Main Tags Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider text-gray-400 font-medium">Media Info</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      {releaseYear && (
                        <Link
                          to={`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}?${
                            mediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year'
                          }=${releaseYear}`}
                          className="group px-4 py-2 rounded-xl bg-gradient-to-r from-[#E4D981]/10 to-transparent hover:from-[#E4D981]/20 border border-[#E4D981]/10 hover:border-[#E4D981]/30 transition-all duration-300 flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#E4D981] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[#E4D981] group-hover:text-white transition-colors duration-300">{releaseYear}</span>
                        </Link>
                      )}

                      {mediaType === 'movie' && data.runtime && (
                        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#82BC87]/10 to-transparent border border-[#82BC87]/10 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[#82BC87]">{Math.floor(data.runtime / 60)}h {data.runtime % 60}m</span>
                        </div>
                      )}

                      {data.vote_average > 0 && (
                        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/10 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 font-medium">{data.vote_average.toFixed(1)}</span>
                            <span className="text-yellow-500/50 text-sm">/ 10</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Genres Section */}
                  {data.genres && data.genres.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-gray-400 font-medium">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.genres.map(genre => (
                          <Link
                            key={genre.id}
                            to={`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}?with_genres=${genre.id}`}
                            className="relative group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#82BC87]/40 to-[#E4D981]/40 rounded-lg opacity-0 group-hover:opacity-20 blur-[2px] transition-all duration-500" />
                            <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#82BC87]/5 to-[#E4D981]/5 border border-white/5 relative hover:border-white/10 transition-all duration-500">
                              <span className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] group-hover:text-white/90 transition-all duration-500">
                                {genre.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 prose prose-invert max-w-none"
                >
                  <p className="text-gray-300 leading-relaxed">
                    {mediaType === 'tv' && data.episode ? data.episode.overview : data.overview}
                  </p>
                </motion.div>

                {mediaType === 'movie' && data.belongs_to_collection && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6"
                  >
                    <Link
                      to={`/collection/${data.belongs_to_collection.id}`}
                      className="group relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#82BC87]/10 to-transparent hover:from-[#82BC87]/20 transition-all duration-300 border border-[#82BC87]/10 hover:border-[#82BC87]/20"
                    >
                      {data.belongs_to_collection.backdrop_path && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                          <img
                            src={`https://image.tmdb.org/t/p/w500${data.belongs_to_collection.backdrop_path}`}
                            alt={data.belongs_to_collection.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-[#82BC87] mb-1">Part of Collection</p>
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#82BC87] transition-colors duration-300">
                          {data.belongs_to_collection.name}
                        </h3>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-[#82BC87] ml-auto group-hover:translate-x-1 transition-transform duration-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </motion.div>
                )}

                {mediaType === 'tv' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8"
                  >
                    <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                      <div className="p-4 border-b border-white/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#82BC87]/10 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Episode Navigation</h3>
                          <p className="text-sm text-gray-400">Season {season}, Episode {episode}</p>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {data.episode && data.episode.episode_number > 1 && (
                            <Link 
                              to={createEpisodeLink(season, parseInt(episode) - 1)}
                              className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 transition-all duration-300 hover:border-[#82BC87]/20"
                            >
                              <div className="relative p-4 flex items-center gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-8 h-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-[#82BC87] transition-all duration-300 absolute inset-0 m-auto" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                    <img
                                      src={tmdbHelpers.getImageUrl(data?.seasonData?.episodes?.find(ep => ep.episode_number === parseInt(episode) - 1)?.still_path)}
                                      alt="Previous Episode"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[#82BC87] text-xs font-medium mb-0.5">Previous Episode</span>
                                  <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                                    Episode {parseInt(episode) - 1}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          )}

                          <Link 
                            to={`/tv/${slug}/episodes/${season}`}
                            className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 transition-all duration-300 hover:border-[#82BC87]/20"
                          >
                            <div className="relative p-4 flex items-center gap-3">
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-[#82BC87] transition-all duration-300 absolute inset-0 m-auto" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                                  </svg>
                                </div>
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                  <img
                                    src={tmdbHelpers.getImageUrl(data?.poster_path)}
                                    alt="Show Poster"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[#82BC87] text-xs font-medium mb-0.5">View All</span>
                                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                                  Season {season} Episodes
                                </span>
                              </div>
                            </div>
                          </Link>

                          {(data.episode && (
                            data.episode.episode_number < (data.seasonData?.episodes?.length || 0) ||
                            (data.episode.episode_number === data.seasonData?.episodes?.length && 
                             data.seasons?.find(s => s.season_number === parseInt(season) + 1))
                          )) && (
                            <Link 
                              to={data.episode.episode_number < data.seasonData?.episodes?.length
                                ? createEpisodeLink(season, parseInt(episode) + 1)
                                : createEpisodeLink(parseInt(season) + 1, 1)
                              }
                              className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 transition-all duration-300 hover:border-[#82BC87]/20"
                            >
                              <div className="relative p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                      <img
                                        src={tmdbHelpers.getImageUrl(
                                          data.episode.episode_number < data.seasonData?.episodes?.length
                                            ? data?.seasonData?.episodes?.find(ep => ep.episode_number === parseInt(episode) + 1)?.still_path
                                            : data?.nextSeasonData?.episodes?.[0]?.still_path
                                        )}
                                        alt="Next Episode"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[#82BC87] text-xs font-medium mb-0.5">
                                        {data.episode.episode_number < data.seasonData?.episodes?.length
                                          ? 'Next Episode'
                                          : 'Next Season'
                                        }
                                      </span>
                                      <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                                        {data.episode.episode_number < data.seasonData?.episodes?.length
                                          ? `Episode ${parseInt(episode) + 1}`
                                          : `Season ${parseInt(season) + 1}, Episode 1`
                                        }
                                      </span>
                                    </div>
                                  </div>
                                  <div className="relative w-8 h-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-[#82BC87] transition-all duration-300 absolute inset-0 m-auto" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PlayerPage;