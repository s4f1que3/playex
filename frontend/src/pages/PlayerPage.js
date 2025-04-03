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

const PlayerPage = ({ mediaType }) => {
  const { slug, season, episode } = useParams();
  const { id, loading: slugLoading } = useSlugResolver(mediaType, slug);
  const navigate = useNavigate();
  
  const [playerType, setPlayerType] = useState(() => {
    return localStorage.getItem('preferredPlayer') || 'vidlink';
  });

  useEffect(() => {
    if (mediaType === 'tv') {
      if (!season || !episode || !slug) {
        navigate(`/tv/${slug || ''}`);
      }
    }
  }, [mediaType, slug, season, episode, navigate]);

  const handlePlayerChange = (type) => {
    localStorage.setItem('preferredPlayer', type);
    window.location.reload();
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['playerMedia', mediaType, id, season, episode],
    queryFn: async () => {
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
    staleTime: 300000
  });
  
  useEffect(() => {
    if (!data) return;
    
    if (mediaType === 'tv') {
      setLastWatchedEpisode(id, season, episode);
      localStorage.setItem(`currentEpisode_${id}_${season}`, episode);
    }
    
    addToContinueWatching(id, mediaType, data);
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
                  { id: 'vidlink', icon: (
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  )},
                  { id: 'embedsu', icon: (
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                  )},
                  { id: 'vidsrc', icon: (
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
                      className={`relative group px-6 py-3 rounded-xl transition-all duration-500 ${
                        playerType === id
                          ? 'bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white shadow-lg'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#82BC87]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        playerType === id ? 'opacity-100' : ''
                      }`} />
                      
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
                        }`}>
                          {id.charAt(0).toUpperCase() + id.slice(1)}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {(playerType === 'vidlink' || playerType === 'embedsu') && (
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
                        If {playerType} isn't working, try our most reliable player: 
                        <span className="text-[#82BC87] font-medium ml-1 hover:text-[#6da972] cursor-pointer transition-colors duration-300" 
                              onClick={() => handlePlayerChange('vidsrc')}>
                          Vidsrc
                        </span>
                        <span>Ensure you have an</span>
                        <span className="
                        text-[#82BC87] font-medium ml-1 hover:text-[#6da972] 
                        cursor-pointer transition-colors duration-300"> 
                            <a href=
                            "https://chromewebstore.google.com/detail/popup-blocker-strict/aefkmifgmaafnojlojpnekbpbmjiiogg">
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
                  className="flex flex-wrap items-center gap-3"
                >
                  {releaseYear && (
                    <Link
                      to={`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}?${
                        mediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year'
                      }=${releaseYear}`}
                      className="group px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#E4D981] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{releaseYear}</span>
                    </Link>
                  )}

                  <div className="px-4 py-2 rounded-xl bg-white/5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                      {mediaType === 'movie' ? (
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      ) : (
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span className="text-gray-300">{mediaType === 'movie' ? 'Movie' : 'TV Series'}</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 prose prose-invert max-w-none"
                >
                  <p className="text-gray-300 leading-relaxed">
                    {mediaType === 'tv' && data.episode ? data.episode.overview : data.overview}
                  </p>
                </motion.div>

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