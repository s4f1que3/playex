// File: frontend/src/components/common/MediaCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { tmdbHelpers } from '../../utils/api';
import { useWatchProgress } from '../../hooks/useWatchProgress';

const MediaCard = ({ media, showType = true }) => {
  const { getMediaProgress } = useWatchProgress();
  
  const { 
    id, 
    poster_path, 
    title, 
    name, 
    release_date, 
    first_air_date,
    vote_average,
    media_type
  } = media;
  
  const mediaType = media.media_type || (title ? 'movie' : 'tv');
  
  // Get release year
  const releaseYear = release_date || first_air_date 
    ? new Date(release_date || first_air_date).getFullYear() 
    : '';
  
  // Get watch progress
  const progress = getMediaProgress(id, mediaType);
  const progressPercentage = progress ? (progress.watched / progress.duration) * 100 : 0;
  
  // Format rating
  const rating = vote_average ? (vote_average / 10) * 5 : 0;
  
  return (
    <div className="card group h-full flex flex-col relative">
      <Link to={`/${mediaType}/${id}`} className="block flex-grow">
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Poster image */}
          <img
            src={tmdbHelpers.getImageUrl(poster_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={title || name}
            className="w-full h-auto object-cover transition-transform duration-500 transform group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-[#161616] bg-opacity-80 rounded-full p-1 flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={star <= Math.round(rating) ? '#E4D981' : 'none'} 
                  stroke={star <= Math.round(rating) ? '#E4D981' : '#6B7280'} 
                  className="w-3 h-3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>
          
          {/* Watch progress bar */}
          {progressPercentage > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
              <div 
                className="h-full bg-[#82BC87]" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="btn-primary transform scale-90 group-hover:scale-100 transition-transform duration-300">
              View Details
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4 flex-grow">
        <Link to={`/${mediaType}/${id}`} className="block">
          <h3 className="font-bold text-white text-lg truncate">
            {title || name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-400 text-sm">
            {releaseYear}
          </span>
          {showType && (
            <span className="text-[#E6C6BB] text-xs px-2 py-0.5 bg-gray-800 rounded-full">
              {mediaType === 'movie' ? 'Movie' : 'TV Show'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;