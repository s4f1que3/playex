import React from 'react';
import { motion } from 'framer-motion';

const SearchSuggestionItem = ({ item, onClick, variants }) => {
  const mediaType = item.media_type === 'person' ? 'actor' : item.media_type;
  const title = item.title || item.name;
  const isCollection = item.media_type === 'collection';
  const imageSize = isCollection ? 'w154' : 'w92';
  const imagePath = item.poster_path || item.profile_path;

  return (
    <motion.li
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => onClick(item)}
      className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-all group"
    >
      <div className={`${isCollection ? 'w-16' : 'w-12'} h-16 overflow-hidden rounded-md bg-gray-800 flex-shrink-0`}>
        {imagePath ? (
          <img
            src={`https://image.tmdb.org/t/p/${imageSize}${imagePath}`}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-600 text-2xl">{isCollection ? '📑' : '?'}</span>
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors">
          {title}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm px-2 py-0.5 rounded ${
            isCollection ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400'
          }`}>
            {isCollection ? 'Collection' : mediaType}
          </span>
          {isCollection && item.part_count > 0 && (
            <span className="text-xs text-gray-500">
              {item.part_count} items
            </span>
          )}
        </div>
      </div>
    </motion.li>
  );
};

export default SearchSuggestionItem;