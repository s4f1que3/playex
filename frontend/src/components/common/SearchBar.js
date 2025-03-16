// File: frontend/src/components/common/SearchBar.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, tmdbHelpers } from '../../utils/api';

const SearchBar = ({ isMobile = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
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
  
  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-72'}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="flex group">
        <input
          type="text"
          placeholder="Search movies, TV shows, actors..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.length > 2) {
              setShowSuggestions(true);
            } else {
              setShowSuggestions(false);
            }
          }}
          onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
          className="bg-gray-900/70 backdrop-blur-xl text-white rounded-l-xl border-l border-t border-b border-gray-700/50 px-5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#82BC87]/50 transition-all duration-300 placeholder:text-gray-500 group-hover:bg-gray-800/70"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white rounded-r-xl px-4 hover:opacity-90 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#82BC87]/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
      
      {/* Search suggestions */}
      {showSuggestions && searchTerm.length > 2 && (
        <div className="absolute z-50 mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-xl shadow-black/50 max-h-[480px] overflow-y-auto transition-all duration-300 animate-fadeIn">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin mr-2" />
              <span className="animate-pulse">Searching...</span>
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <ul className="divide-y divide-gray-800/50">
              {suggestions.map((item) => {
                if (!['movie', 'tv', 'person'].includes(item.media_type)) return null;
                
                return (
                  <li key={`${item.id}-${item.media_type}`}>
                    <button
                      className="flex items-center p-4 w-full hover:bg-gray-800/50 transition-all duration-300 text-left group/item"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <div className="relative rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={tmdbHelpers.getImageUrl(
                            item.media_type === 'person' ? item.profile_path : item.poster_path, 
                            'w92'
                          ) || 'https://via.placeholder.com/45x68?text=No+Image'}
                          alt={item.title || item.name}
                          className="w-12 h-18 object-cover rounded-lg transform group-hover/item:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="text-white font-medium group-hover/item:text-[#82BC87] transition-colors duration-300">
                          {item.title || item.name}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center mt-0.5">
                          <span className="inline-flex items-center">
                            {item.media_type === 'movie' ? (
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13v10l6-5z"/></svg>
                            ) : item.media_type === 'tv' ? (
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>
                            ) : (
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            )}
                            {item.media_type === 'movie' ? 'Movie' : item.media_type === 'tv' ? 'TV Show' : 'Actor'}
                          </span>
                          {item.media_type !== 'person' && (item.release_date || item.first_air_date) && (
                            <>
                              <span className="mx-2 text-gray-600">•</span>
                              <span>{new Date(item.release_date || item.first_air_date).getFullYear()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-hover/item:text-[#82BC87] transform group-hover/item:translate-x-1 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </li>
                );
              })}
              <li className="p-3">
                <button
                  onClick={handleSearch}
                  className="w-full text-[#82BC87] hover:text-[#E4D981] text-sm py-2 transition-all duration-300 rounded-lg hover:bg-[#82BC87]/10"
                >
                  See all results for "{searchTerm}"
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <p>No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;