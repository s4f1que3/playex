// File: frontend/src/components/media/SeasonsAccordion.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, tmdbHelpers } from '../../utils/api';
import Spinner from '../common/Spinner';

const SeasonsAccordion = ({ 
  tvId, 
  seasons, 
  activeSeason, 
  setActiveSeason 
}) => {
  
  
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
      <h2 className="text-2xl font-bold text-white mb-6">Seasons & Episodes</h2>
      
      {/* Season Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
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
      
      {/* Episodes List */}
      {isLoading ? (
        <Spinner />
      ) : seasonDetails?.episodes ? (
        <div className="space-y-4">
          {seasonDetails.episodes.map((episode) => {
            
            return (
              <div 
                key={episode.id} 
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300"
              >
                <Link to={`/player/tv/${tvId}/${activeSeason}/${episode.episode_number}`}>
                  <div className="flex flex-col md:flex-row">
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
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            {episode.episode_number}. {episode.name}
                          </h3>
                          <div className="text-gray-400 text-sm mt-1">
                            {episode.air_date ? new Date(episode.air_date).toLocaleDateString() : 'Air date unknown'} • {episode.runtime ? `${episode.runtime} min` : 'Runtime unknown'}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mt-2 line-clamp-2">
                        {episode.overview || 'No description available.'}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-4">
          No episodes available for this season.
        </div>
      )}
    </div>
  );
};

export default SeasonsAccordion;