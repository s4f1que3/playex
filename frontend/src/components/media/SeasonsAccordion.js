// File: frontend/src/components/media/SeasonsAccordion.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, tmdbHelpers } from '../../utils/api';
import { getLastWatchedEpisode } from '../../utils/LocalStorage';
import Spinner from '../common/Spinner';

const SeasonsAccordion = ({ 
  tvId, 
  seasons, 
  activeSeason, 
  setActiveSeason 
}) => {
  // Add state to track if episodes are expanded or collapsed
  const [isEpisodesExpanded, setIsEpisodesExpanded] = useState(true);
  const [lastWatched, setLastWatched] = useState(null);
  
  // Fetch last watched episode info
  useEffect(() => {
    const lastWatchedData = getLastWatchedEpisode(tvId);
    setLastWatched(lastWatchedData);
  }, [tvId]);
  
  // Fetch season details
  const { data: seasonDetails, isLoading } = useQuery({
    queryKey: ['seasonDetails', tvId, activeSeason],
    queryFn: () => tmdbApi.get(`/tv/${tvId}/season/${activeSeason}`).then(res => res.data),
    enabled: !!tvId && !!activeSeason,
    staleTime: 300000 // 5 minutes
  });
  
  if (!seasons || seasons.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        No seasons information available.
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Seasons & Episodes</h2>
        
        <button 
          onClick={() => setIsEpisodesExpanded(!isEpisodesExpanded)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-300"
        >
          {isEpisodesExpanded ? (
            <>
              Hide 
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </>
          ) : (
            <>
              Show 
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </>
          )}
        </button>
      </div>
      
      {/* Season Tabs - Always visible regardless of expanded state */}
      <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <div className="flex space-x-2">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setActiveSeason(season.season_number)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition duration-300 ${
                activeSeason === season.season_number
                  ? 'bg-[#82BC87] text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {season.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Episodes List - Collapsible */}
      {isLoading ? (
        <div className="py-4 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Collapsible content */}
          <div 
            className={`transition-all duration-500 origin-top overflow-hidden ${
              isEpisodesExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {seasonDetails?.episodes ? (
              <div className="space-y-4 mt-4">
                {seasonDetails.episodes.map((episode) => (
                  <div 
                    key={episode.id} 
                    className={`bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300 relative ${
                      lastWatched && 
                      lastWatched.season === activeSeason && 
                      lastWatched.episode === episode.episode_number
                        ? 'ring-2 ring-[#82BC87]'
                        : ''
                    }`}
                  >
                    {/* Last Watched Badge */}
                    {lastWatched && 
                     lastWatched.season === activeSeason && 
                     lastWatched.episode === episode.episode_number && (
                      <div className="absolute top-2 left-2 bg-[#82BC87] text-white text-xs px-2 py-1 rounded-md font-medium z-10">
                        Last Watched
                      </div>
                    )}
                    <Link to={`/player/tv/${tvId}/${activeSeason}/${episode.episode_number}`}>
                      <div className="flex flex-col md:flex-row relative">
                        {/* Last Watched Tag - Positioned absolutely over the episode card */}
                        {lastWatched && 
                         lastWatched.season === activeSeason && 
                         lastWatched.episode === episode.episode_number && (
                          <div className="absolute top-0 left-0 m-4 z-10">
                            <div className="bg-[#82BC87] text-white px-3 py-1.5 rounded-md font-medium flex items-center gap-2 shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Last Watched
                            </div>
                          </div>
                        )}
                        
                        {/* Episode Image */}
                        <div className="md:w-1/3 lg:w-1/4">
                          <div className="relative aspect-video">
                            <img
                              src={tmdbHelpers.getImageUrl(episode.still_path) || 'https://via.placeholder.com/500x281?text=No+Preview'}
                              alt={episode.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            
                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition duration-300">
                              <div className="bg-[#82BC87] rounded-full p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Episode Info */}
                        <div className="p-4 md:w-2/3 lg:w-3/4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-white text-lg">
                                {episode.episode_number}. {episode.name}
                              </h3>
                              {lastWatched && 
                               lastWatched.season === activeSeason && 
                               lastWatched.episode === episode.episode_number && (
                                <span className="bg-[#82BC87] text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  Last Watched
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-300 mt-2 line-clamp-2">
                            {episode.overview || 'No description available.'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-4">
                No episodes available for this season.
              </div>
            )}
          </div>
          
          {/* Collapsed view summary */}
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
        </>
      )}
    </div>
  );
};

export default SeasonsAccordion;