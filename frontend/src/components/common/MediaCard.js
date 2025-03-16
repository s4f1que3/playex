// File: frontend/src/components/common/MediaCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { tmdbHelpers } from '../../utils/api';

const MediaCard = ({ media, showType = true }) => {
  const {
    id,
    poster_path,
    profile_path,
    title,
    name,
    release_date,
    first_air_date,
    vote_average,
    media_type,
    known_for_department
  } = media;
  
  // Determine media type with proper fallbacks
  const type = media_type || (title ? 'movie' : 'tv');
  const isPerson = type === 'person';
  
  // Get appropriate route
  const route = isPerson ? `/actor/${id}` : `/${type}/${id}`;
  
  // Get appropriate image path
  const imagePath = isPerson ? profile_path : poster_path;
  
  // Get display info based on media type
  const displayTitle = title || name;
  
  // For movies and TV shows, show release year. For persons, show known department
  const subInfo = isPerson 
    ? (known_for_department || 'Actor')
    : (release_date || first_air_date 
        ? new Date(release_date || first_air_date).getFullYear() 
        : '');
  
  // Format rating (only for movies and TV shows)
  const rating = !isPerson && vote_average ? (vote_average / 10) * 5 : 0;
  
  return (
    <Link to={route} className="block h-full group">
      <div className="relative h-full overflow-hidden rounded-xl backdrop-blur-sm border border-white/5 transition-all duration-500 hover:scale-[1.02] bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        {/* Image Container - Fixed aspect ratio */}
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={tmdbHelpers.getImageUrl(imagePath) || 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Rating Badge */}
          {!isPerson && vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 z-10">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white text-sm font-medium">{vote_average?.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg line-clamp-2">{displayTitle}</h3>
              {subInfo && (
                <span className="text-gray-300 text-sm">{subInfo}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;