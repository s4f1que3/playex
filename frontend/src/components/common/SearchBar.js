import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, tmdbHelpers } from '../../utils/api';

const SearchBar = ({ isMobile = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Search suggestions query - FIXED FOR TANSTACK QUERY V5
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['searchSuggestions', searchTerm],
    queryFn: () => tmdbApi.get('/search/multi', { params: { query: searchTerm } })
      .then(res => res.data.results.slice(0, 5)),
    enabled: searchTerm.length > 2,
    staleTime: 60000 // 1 minute
  });

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if Ctrl + S is pressed
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); // Prevent default save dialog
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    // Handle different media types
    if (item.media_type === 'movie') {
      navigate(`/movie/${item.id}`);
    } else if (item.media_type === 'tv') {
      navigate(`/tv/${item.id}`);
    } else if (item.media_type === 'person') {
      navigate(`/actor/${item.id}`);
    }

    setShowSuggestions(false);
    setSearchTerm('');
  };

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

  return (
    <motion.div 
      className={`relative ${isMobile ? 'w-full' : 'w-80'}`} 
      ref={searchRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <form onSubmit={handleSearch} className="flex group">
        <div className="relative flex-grow">
          {/* Enhanced Search Input */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search movies, shows, actors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length > 2) setShowSuggestions(true);
                else setShowSuggestions(false);
              }}
              onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
              className="w-full bg-gray-900/90 text-white placeholder-gray-400 
                         focus:placeholder-gray-200 placeholder-opacity-60 focus:placeholder-opacity-100
                         px-12 py-3 rounded-xl border border-white/5 focus:border-[#82BC87]/20
                         focus:outline-none focus:ring-2 focus:ring-[#82BC87]/20
                         text-base font-medium tracking-normal
                         transition-all duration-300"
            />
            
            {/* Search Icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 
                          group-hover:text-[#82BC87] transition-colors duration-300">
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                animate={{ rotate: showSuggestions ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </motion.svg>
            </div>

            {/* Keyboard Shortcut Badge */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 
                          bg-gray-800/50 rounded-lg px-2 py-1
                          border border-white/5 opacity-50 group-hover:opacity-100
                          transition-all duration-300">
              <span className="text-[10px] text-gray-400 font-medium">⌘K</span>
            </div>
          </div>
        </div>
      </form>

      {/* Enhanced Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && searchTerm.length > 2 && (
          <motion.div
            variants={suggestionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-50 w-full mt-4"
          >
            <div className="relative overflow-hidden rounded-2xl">
              {/* Backdrop Blur & Gradient - Now wraps all content */}
              <div className="bg-gray-900/95 border border-white/5 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)]">
                {/* Loading State */}
                {isLoading && (
                  <div className="relative p-8 flex items-center justify-center">
                    <div className="flex items-center gap-3 bg-[#82BC87]/10 px-4 py-2 rounded-xl">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5"
                      >
                        <svg className="text-[#82BC87]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                      </motion.div>
                      <span className="text-[#82BC87] font-medium">Searching...</span>
                    </div>
                  </div>
                )}

                {/* Results List */}
                {!isLoading && suggestions && suggestions.length > 0 && (
                  <div className="relative divide-y divide-white/5">
                    {/* Category Labels */}
                    <div className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="px-3 py-1 rounded-full bg-[#82BC87]/10 text-[#82BC87]">
                          {suggestions.length} results
                        </span>
                        <span className="text-gray-500">•</span>
                        <span>Press <kbd className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 text-xs">↑</kbd> <kbd className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 text-xs">↓</kbd> to navigate</span>
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="max-h-[60vh] overflow-y-auto">
                      <div className="p-4 grid grid-cols-1 gap-2">
                        {suggestions.map((item, index) => (
                          <motion.button
                            key={`${item.id}-${item.media_type}`}
                            onClick={() => handleSuggestionClick(item)}
                            className="w-full text-left flex items-start gap-4 p-4 rounded-xl 
                                     bg-gray-800/30 border border-white/5
                                     hover:bg-gray-800/50 hover:border-[#82BC87]/20
                                     transition-all duration-300 group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            {/* Thumbnail */}
                            <div className="relative h-16 w-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={tmdbHelpers.getImageUrl(
                                  item.media_type === 'person' ? item.profile_path : item.poster_path,
                                  'w92'
                                ) || 'https://via.placeholder.com/45x68?text=No+Image'}
                                alt={item.title || item.name}
                                className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white group-hover:text-[#82BC87] transition-colors duration-300 truncate">
                                {item.title || item.name}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  {item.media_type === 'movie' ? (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13v10l6-5z"/>
                                    </svg>
                                  ) : item.media_type === 'tv' ? (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                  )}
                                  <span>{item.media_type === 'movie' ? 'Movie' : item.media_type === 'tv' ? 'TV Show' : 'Actor'}</span>
                                </span>
                                {item.media_type !== 'person' && (item.release_date || item.first_air_date) && (
                                  <>
                                    <span className="text-gray-600">•</span>
                                    <span>{new Date(item.release_date || item.first_air_date).getFullYear()}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Arrow Icon */}
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-[#82BC87] transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-4">
                      <button
                        onClick={handleSearch}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#82BC87] to-[#6da972]
                                 text-white font-medium hover:opacity-90 transition-all duration-300
                                 flex items-center justify-center gap-2 group"
                      >
                        <span>See all results for "{searchTerm}"</span>
                        <motion.svg
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </motion.svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* No Results State */}
                {!isLoading && suggestions && suggestions.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <p>No results found for "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;