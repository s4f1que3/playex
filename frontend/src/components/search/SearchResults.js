// File: frontend/src/components/search/SearchResults.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchSuggestionItem from './SearchSuggestionItem';

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const suggestionVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const SearchResults = ({ results = [], suggestions = [], isLoading, onSuggestionClick, isMobile, searchRef }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute z-50 w-full bg-gray-900/95 backdrop-blur-md rounded-xl mt-2 border border-white/5 shadow-2xl overflow-hidden"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        style={{
          top: isMobile ? (searchRef.current?.getBoundingClientRect().bottom + 10) + 'px' : 'auto'
        }}
      >
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">
            <div className="w-6 h-6 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Searching...
          </div>
        ) : results.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No results found
            {suggestions.length > 0 && (
              <div className="mt-2 text-sm">
                Did you mean:
                <div className="mt-1 flex flex-wrap gap-2 justify-center">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSuggestionClick({ title: suggestion })}
                      className="px-3 py-1 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <ul className="max-h-[70vh] overflow-y-auto">
            {results.map((item, index) => (
              <SearchSuggestionItem
                key={`${item.id}-${index}`}
                item={item}
                onClick={onSuggestionClick}
                variants={suggestionVariants}
              />
            ))}
          </ul>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResults;