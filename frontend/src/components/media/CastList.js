// File: frontend/src/components/media/CastList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tmdbHelpers } from '../../utils/api';

const CastList = ({ cast }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // If no cast data or empty array, don't show anything
  if (!cast || cast.length === 0) {
    return null;
  }
  
  // Take only the first 12 cast members
  const displayCast = cast.slice(0, 12);
  
  return (
    <div className="py-8 transition-all duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Top Cast</h2>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-300"
        >
          {isExpanded ? (
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
      
      <div 
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 transition-all duration-500 origin-top overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {displayCast.map((actor) => (
          <Link 
            to={`/actor/${actor.id}`} 
            key={actor.id}
            className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 
                     hover:scale-105 hover:shadow-lg hover:z-10 group"
          >
            <div className="aspect-[2/3] relative overflow-hidden">
              <img
                src={tmdbHelpers.getImageUrl(actor.profile_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={actor.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-3 transition-all duration-300 group-hover:bg-gray-700">
              <h3 className="font-medium text-white group-hover:text-green-300 transition-all duration-300 truncate">
                {actor.name}
              </h3>
              
              {actor.character && (
                <p className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-all duration-300">
                  {actor.character}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      {/* Show a minimal version when collapsed */}
      {!isExpanded && (
        <div className="text-gray-400 text-sm mt-2">
          Featuring {displayCast.map((actor, index) => (
            <React.Fragment key={actor.id}>
              {index > 0 && index < displayCast.length - 1 && ', '}
              {index > 0 && index === displayCast.length - 1 && ' and '}
              <span className="text-gray-300 hover:text-green-300 cursor-pointer">{actor.name}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default CastList;