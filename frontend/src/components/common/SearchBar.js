import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, tmdbHelpers } from '../../utils/api';
import { createMediaUrl } from '../../utils/slugify';
import { findSimilarTitles, getSearchSuggestions } from '../../utils/search';

const SearchBar = ({ isMobile = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['searchSuggestions', searchTerm],
    queryFn: async () => {
      const response = await tmdbApi.get('/search/multi', { 
        params: { 
          query: searchTerm,
          include_adult: false,
          language: 'en-US'
        }
      });
      
      const results = response.data.results;
      
      if (results.length === 0 && searchTerm.length >= 2) {
        const fuzzyResponse = await tmdbApi.get('/search/multi', {
          params: {
            query: searchTerm.slice(0, Math.max(2, searchTerm.length - 2)),
            include_adult: false,
            language: 'en-US'
          }
        });
        
        const fuzzyResults = fuzzyResponse.data.results;
        const similarResults = findSimilarTitles(searchTerm, fuzzyResults);
        
        if (similarResults.length > 0) {
          return {
            results: similarResults.slice(0, 5),
            suggestions: getSearchSuggestions(searchTerm, fuzzyResults)
          };
        }
      }
      
      return {
        results: results.slice(0, 5),
        suggestions: []
      };
    },
    enabled: searchTerm.length > 1,
    staleTime: 60000
  });

  const { results = [], suggestions: typoSuggestions = [] } = suggestions || {};

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
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
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
    const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    const title = item.title || item.name;
    
    const adjustedMediaType = mediaType === 'person' ? 'actor' : mediaType;
    const mediaUrl = createMediaUrl(adjustedMediaType, item.id, title);
    navigate(mediaUrl);
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
      className={`relative ${isMobile ? 'w-full' : 'w-[325px]'}`} 
      ref={searchRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <form onSubmit={handleSearch} className="flex group">
        <div className="relative flex-grow">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={isMobile ? "Search..." : "Search movies, shows & actors"}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length > 2) setShowSuggestions(true);
                else setShowSuggestions(false);
              }}
              onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
              className="w-full bg-gray-900/90 text-white placeholder-gray-400 
                         focus:placeholder-gray-200 placeholder-opacity-60 focus:placeholder-opacity-100
                         px-10 py-2 md:px-12 md:py-3 rounded-xl border border-white/5 focus:border-[#82BC87]/20
                         focus:outline-none focus:ring-2 focus:ring-[#82BC87]/20
                         text-sm md:text-base font-medium tracking-normal
                         transition-all duration-300"
            />
            
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 
                          group-hover:text-[#82BC87] transition-colors duration-300">
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 md:h-5 md:w-5"
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

            <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 
                          bg-gray-800/50 rounded-lg px-2 py-1
                          border border-white/5 opacity-50 group-hover:opacity-100
                          transition-all duration-300">
              <span className="text-[10px] text-gray-400 font-medium">⌘K</span>
            </div>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && searchTerm.length > 2 && (
          <motion.div
            variants={suggestionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed md:absolute z-50 ${isMobile ? 'left-0 right-0 mx-4' : 'w-full'} mt-2 md:mt-4`}
            style={{
              top: isMobile ? (searchRef.current?.getBoundingClientRect().bottom + 10) + 'px' : 'auto'
            }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <div className="bg-gray-900/95 border border-white/5 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)]">
                {isLoading && (
                  <div className="relative p-4 md:p-8 flex items-center justify-center">
                    <div className="flex items-center gap-3 bg-[#82BC87]/10 px-3 py-2 rounded-xl">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 md:w-5 md:h-5"
                      >
                        <svg className="text-[#82BC87]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                      </motion.div>
                      <span className="text-[#82BC87] text-sm md:text-base font-medium">Searching...</span>
                    </div>
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="relative divide-y divide-white/5">
                    <div className="px-4 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="px-2 py-1 rounded-full bg-[#82BC87]/10 text-[#82BC87]">
                          {results.length} results
                        </span>
                        {!isMobile && (
                          <>
                            <span className="text-gray-500">•</span>
                            <span>Press <kbd className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 text-xs">↑</kbd> <kbd className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 text-xs">↓</kbd> to navigate</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[40vh] md:max-h-[60vh] overflow-y-auto overscroll-contain">
                      <div className="p-2 md:p-4 grid grid-cols-1 gap-2">
                        {results.map((item, index) => {
                          const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                          const title = item.title || item.name;
                          const year = item.release_date || item.first_air_date;
                          const mediaUrl = createMediaUrl(mediaType, item.id, title);

                          return (
                            <motion.button
                              key={`${item.id}-${item.media_type}`}
                              onClick={() => handleSuggestionClick(item)}
                              className="w-full text-left flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl 
                                       bg-gray-800/30 border border-white/5
                                       hover:bg-gray-800/50 hover:border-[#82BC87]/20 active:bg-gray-800/60
                                       transition-all duration-300 group"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="relative h-14 w-10 md:h-16 md:w-12 rounded-lg overflow-hidden flex-shrink-0">
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

                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm md:text-base text-white group-hover:text-[#82BC87] transition-colors duration-300 truncate">
                                  {item.title || item.name}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs md:text-sm text-gray-400">
                                  <span className="flex items-center gap-1">
                                    {item.media_type === 'movie' ? (
                                      <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13v10l6-5z"/>
                                      </svg>
                                    ) : item.media_type === 'tv' ? (
                                      <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
                                      </svg>
                                    ) : (
                                      <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
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

                              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover:text-[#82BC87] transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                              </svg>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3 md:p-4">
                      <button
                        onClick={handleSearch}
                        className="w-full py-2 md:py-3 rounded-xl bg-gradient-to-r from-[#82BC87] to-[#6da972]
                                 text-white text-sm md:text-base font-medium hover:opacity-90 transition-all duration-300
                                 flex items-center justify-center gap-2 group"
                      >
                        <span>See all results for "{searchTerm}"</span>
                        <motion.svg
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-5 md:w-5"
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

                {!isLoading && results.length === 0 && (
                  <div className="p-4 md:p-8 text-center text-gray-400">
                    <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <p className="text-sm md:text-base">No results found for "{searchTerm}"</p>
                  </div>
                )}

                {typoSuggestions.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/5">
                    <p className="text-xs text-gray-400 mb-2">Did you mean:</p>
                    <div className="flex flex-wrap gap-2">
                      {typoSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchTerm(suggestion)}
                          className="px-2 py-1 text-xs rounded-lg bg-[#82BC87]/10 text-[#82BC87] 
                                   hover:bg-[#82BC87]/20 transition-colors duration-300"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
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