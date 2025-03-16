import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import VideoPlayer from '../components/media/VideoPlayer';
import Spinner from '../components/common/Spinner';
import { setLastWatchedEpisode } from '../utils/LocalStorage';

const PlayerPage = ({ mediaType }) => {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  
  // Add state for player type
  const [playerType, setPlayerType] = useState(() => {
    // Get from localStorage or default to 'vidlink'
    return localStorage.getItem('preferredPlayer') || 'vidlink';
  });
  
  // Function to handle player type change
  const handlePlayerChange = (type) => {
    localStorage.setItem('preferredPlayer', type);
    // Reload the current page to apply changes
    window.location.reload();
  };
  
  // Fetch media details
const { data, isLoading, error } = useQuery({
  queryKey: ['playerMedia', mediaType, id, season, episode],
  queryFn: () => {
    if (mediaType === 'movie') {
      return tmdbApi.get(`/movie/${id}`).then(res => res.data);
    } else if (mediaType === 'tv') {
      return Promise.all([
        tmdbApi.get(`/tv/${id}`).then(res => res.data),
        tmdbApi.get(`/tv/${id}/season/${season}/episode/${episode}`).then(res => res.data)
      ]).then(([tvData, episodeData]) => {
        return { ...tvData, episode: episodeData };
      });
    }
  },
  staleTime: 300000 // 5 minutes
});
  
  // Redirect to details page if missing required params for TV shows
  useEffect(() => {
    if (mediaType === 'tv' && (!season || !episode)) {
      navigate(`/tv/${id}`);
    }
  }, [mediaType, id, season, episode, navigate]);

  useEffect(() => {
    // Update last watched episode when player loads
    if (mediaType === 'tv') {
      setLastWatchedEpisode(id, season, episode);
    }
  }, [mediaType, id, season, episode]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
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
  
  // Get title and basic info
  const title = mediaType === 'movie' ? data.title : data.name;
  const episodeTitle = mediaType === 'tv' ? data.episode.name : null;
  const releaseYear = mediaType === 'movie' 
    ? (data.release_date ? new Date(data.release_date).getFullYear() : '') 
    : (data.first_air_date ? new Date(data.first_air_date).getFullYear() : '');
  
  return (
    <div className="-mx-4 -mt-6"> {/* Extend content to full width */}
      <div className="bg-black">
        <VideoPlayer 
          tmdbId={id} 
          mediaType={mediaType} 
          season={season} 
          episode={episode}
          playerType={playerType}
        />
      </div>
      
      {/* Enhanced player selection buttons */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 py-6 border-b border-gray-800/50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-gray-800/50 backdrop-blur-sm p-1.5 rounded-xl inline-flex gap-1.5 shadow-xl">
              <button
                onClick={() => handlePlayerChange('vidlink')}
                className={`relative px-8 py-2.5 rounded-lg font-medium transition-all duration-300 overflow-hidden group ${
                  playerType === 'vidlink'
                    ? 'bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white shadow-lg shadow-[#82BC87]/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${playerType === 'vidlink' ? 'scale-110' : 'group-hover:scale-110'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  <span className={`transition-all duration-300 ${playerType === 'vidlink' ? 'transform translate-x-0.5' : ''}`}>VidLink</span>
                </span>
              </button>
              <button
                onClick={() => handlePlayerChange('embedsu')}
                className={`relative px-8 py-2.5 rounded-lg font-medium transition-all duration-300 overflow-hidden group ${
                  playerType === 'embedsu'
                    ? 'bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white shadow-lg shadow-[#82BC87]/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${playerType === 'embedsu' ? 'scale-110' : 'group-hover:scale-110'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                  </svg>
                  <span className={`transition-all duration-300 ${playerType === 'embedsu' ? 'transform translate-x-0.5' : ''}`}>EmbedSu</span>
                </span>
              </button>
              <button
                onClick={() => handlePlayerChange('vidsrc')}
                className={`relative px-8 py-2.5 rounded-lg font-medium transition-all duration-300 overflow-hidden group ${
                  playerType === 'vidsrc'
                    ? 'bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white shadow-lg shadow-[#82BC87]/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${playerType === 'vidsrc' ? 'scale-110' : 'group-hover:scale-110'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <span className={`transition-all duration-300 ${playerType === 'vidsrc' ? 'transform translate-x-0.5' : ''}`}>VidSrc</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Media Info */}
          <div className="md:w-3/4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {title}
              {episodeTitle && (
                <> - <span className="text-[#E4D981]">S{season} E{episode}: {episodeTitle}</span></>
              )}
            </h1>
            
            <div className="flex items-center flex-wrap gap-2 mt-2 mb-4">
              {releaseYear && (
                <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {releaseYear}
                </span>
              )}
              
              <span className="text-[#E6C6BB] bg-gray-800 px-3 py-1 rounded-full text-sm">
                {mediaType === 'movie' ? 'Movie' : 'TV Series'}
              </span>
              
              {data.runtime && (
                <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {tmdbHelpers.formatRuntime(data.runtime)}
                </span>
              )}
              
              {mediaType === 'tv' && data.episode && data.episode.runtime && (
                <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {tmdbHelpers.formatRuntime(data.episode.runtime)}
                </span>
              )}
            </div>
            
            <p className="text-gray-300 mt-4">
              {mediaType === 'tv' && data.episode ? data.episode.overview : data.overview}
            </p>

                {/* Player page announcment */}

            <p className="text-gray-300 mt-4 bg-gray-800 p-4 rounded-lg">
              We Recommend Getting An Ad-Blocker To Ehance Your Streaming Experience.
            </p>
          </div>
          
          {/* Next/Previous Episode for TV Shows */}
          {mediaType === 'tv' && (
            <div className="md:w-1/4 bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-4">Episodes</h3>

              <div className="space-y-2">
                {/* Modified Link - using state to pass the active season */}
                <Link 
                  to={`/tv/${id}`}
                  state={{ activeSeason: parseInt(season) }}
                  className="flex items-center justify-center w-full bg-[#82BC87] hover:bg-opacity-80 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  All Episodes For Season {season}
                </Link>
                
                {data.episode && data.episode.episode_number > 1 && (
                  <Link 
                    to={`/player/tv/${id}/${season}/${parseInt(episode) - 1}`}
                    className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Previous Episode
                  </Link>
                )}
                
                {data.episode && data.episode.season_number && data.episode.episode_number < (data.seasons.find(s => s.season_number === parseInt(season))?.episode_count || 0) && (
                  <Link 
                    to={`/player/tv/${id}/${season}/${parseInt(episode) + 1}`}
                    className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Next Episode
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;