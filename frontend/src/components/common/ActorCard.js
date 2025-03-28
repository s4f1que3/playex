import React from 'react';
import { motion } from 'framer-motion';
import PrefetchLink from './PrefetchLink';
import { tmdbHelpers } from '../../utils/api';
import { createMediaUrl } from '../../utils/slugify';

const ActorCard = ({ actor }) => {
  const { id, name, profile_path, known_for_department, known_for } = actor;
  const actorUrl = createMediaUrl('actor', id, name);

  return (
    <PrefetchLink to={actorUrl} className="block h-full group">
      <div className="relative h-full overflow-hidden rounded-xl backdrop-blur-sm border border-white/5 transition-all duration-500 hover:scale-[1.02] bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        {/* Image Container */}
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={tmdbHelpers.getImageUrl(profile_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Hover Content */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            {known_for && known_for.length > 0 && (
              <div className="text-sm text-white/90 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                <span className="text-[#82BC87] font-medium">Known for:</span>
                <div className="mt-1 line-clamp-2 text-xs">
                  {known_for.map(work => work.title || work.name).join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="font-semibold text-white group-hover:text-[#82BC87] transition-colors duration-300 truncate">
            {name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-400 bg-black/20 px-2 py-0.5 rounded-full">
              {known_for_department || 'Actor'}
            </span>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </PrefetchLink>
  );
};

export default ActorCard;
