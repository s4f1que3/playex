// File: frontend/src/components/media/CastList.js
import React, { useState } from 'react';
import { tmdbHelpers } from '../../utils/api';

const CastList = ({ cast, limit = 6 }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!cast || cast.length === 0) {
    return null;
  }
  
  const displayCast = showAll ? cast : cast.slice(0, limit);
  
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayCast.map((person) => (
          <div key={person.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-[2/3] overflow-hidden">
              <img
                src={tmdbHelpers.getImageUrl(person.profile_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={person.name}
                className="w-full h-full object-cover transition duration-300 hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-white text-sm truncate">{person.name}</h3>
              <p className="text-gray-400 text-xs truncate">{person.character}</p>
            </div>
          </div>
        ))}
      </div>
      
      {cast.length > limit && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-secondary inline-block"
          >
            {showAll ? 'Show Less' : `Show All (${cast.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default CastList;