// File: frontend/src/components/media/CastList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { tmdbHelpers } from '../../utils/api';

const CastList = ({ cast }) => {
  // If no cast data or empty array, don't show anything
  if (!cast || cast.length === 0) {
    return null;
  }
  
  // Take only the first 12 cast members
  const displayCast = cast.slice(0, 12);
  
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayCast.map((actor) => (
          <Link 
            to={`/actor/${actor.id}`} 
            key={actor.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300 group"
          >
            <div className="aspect-[2/3] relative">
              <img
                src={tmdbHelpers.getImageUrl(actor.profile_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={actor.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-white group-hover:text-[#82BC87] transition duration-300 truncate">
                {actor.name}
              </h3>
              
              {actor.character && (
                <p className="text-gray-400 text-sm truncate">{actor.character}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CastList;