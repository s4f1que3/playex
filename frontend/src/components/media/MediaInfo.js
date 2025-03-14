// File: frontend/src/components/media/MediaInfo.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tmdbHelpers } from '../../utils/api';

const MediaInfo = ({ media, mediaType }) => {
  const [showFullOverview, setShowFullOverview] = useState(false);
  
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
  
  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[50vh] z-0">
        <div className="relative w-full h-full">
          <img
            src={tmdbHelpers.getImageUrl(backdrop_path, 'original') || 'https://via.placeholder.com/1920x800?text=No+Image'}
            alt={title || name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#161616] to-transparent"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              <img
                src={tmdbHelpers.getImageUrl(poster_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={title || name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Info */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {title || name}
            </h1>
            
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {/* Display each tag separately */}
              {mediaTag.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-[#E6C6BB] bg-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
              
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
            </div>
            
            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/${mediaType === 'movie' ? 'movies' : 'tv-shows'}?with_genres=${genre.id}`}
                      className="text-white bg-gray-800 hover:bg-[#82BC87] transition duration-300 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
              <p className="text-gray-300">
                {displayOverview || 'No overview available.'}
              </p>
              {isLongOverview && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="text-[#82BC87] hover:text-[#E4D981] transition duration-300 mt-2"
                >
                  {showFullOverview ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaInfo;