import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, tmdbHelpers } from '../utils/api';
import VideoPlayer from '../components/media/VideoPlayer';
import Spinner from '../components/common/Spinner';

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
      
      {/* Player selection buttons - centered below player */}
      <div className="bg-gray-900 py-3 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-center space-x-3">
          <button
            onClick={() => handlePlayerChange('vidlink')}
            className={`px-4 py-2 rounded font-medium ${
              playerType === 'vidlink' 
                ? 'bg-[#82BC87] text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } transition duration-200`}
          >
            VidLink
          </button>
          <button
            onClick={() => handlePlayerChange('embedsu')}
            className={`px-4 py-2 rounded font-medium ${
              playerType === 'embedsu' 
                ? 'bg-[#82BC87] text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } transition duration-200`}
          >
            EmbedSu
          </button>
          <button
            onClick={() => handlePlayerChange('vidsrc')}
            className={`px-4 py-2 rounded font-medium ${
              playerType === 'vidsrc' 
                ? 'bg-[#82BC87] text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } transition duration-200`}
          >
            VidSrc
          </button>
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
              Ad Blockers May Affect The Embedded Player's Ability To Show Content. We Apologize For Any Inconveniences.
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