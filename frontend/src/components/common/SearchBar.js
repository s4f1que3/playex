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
    <div className={`relative ${isMobile ? 'w-full' : 'w-64'}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="flex">
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
          className="bg-gray-900 text-white rounded-l-md border-l border-t border-b border-gray-700 px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#82BC87]"
        />
        <button
          type="submit"
          className="bg-[#82BC87] text-white rounded-r-md px-3 hover:bg-opacity-80 transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
      
      {/* Search suggestions */}
      {showSuggestions && searchTerm.length > 2 && (
        <div className="absolute z-50 mt-1 w-full bg-[#161616] border border-gray-800 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : suggestions && suggestions.length > 0 ? (
            <ul>
              {suggestions.map((item) => {
                // Skip suggestions that are not movies, TV shows, or people
                if (!['movie', 'tv', 'person'].includes(item.media_type)) {
                  return null;
                }
                
                return (
                  <li key={`${item.id}-${item.media_type}`} className="border-b border-gray-800 last:border-b-0">
                    <button
                      className="flex items-center p-3 w-full hover:bg-gray-800 transition duration-300 text-left"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <img
                        src={tmdbHelpers.getImageUrl(
                          item.media_type === 'person' ? item.profile_path : item.poster_path, 
                          'w92'
                        ) || 'https://via.placeholder.com/45x68?text=No+Image'}
                        alt={item.title || item.name}
                        className="w-10 h-15 object-cover rounded mr-3"
                      />
                      <div>
                        <div className="text-white font-medium">{item.title || item.name}</div>
                        <div className="text-xs text-gray-400">
                          {item.media_type === 'movie' ? 'Movie' : 
                           item.media_type === 'tv' ? 'TV Show' : 'Actor'} 
                          {item.media_type !== 'person' && item.release_date || item.first_air_date ? 
                            ` • ${new Date(item.release_date || item.first_air_date).getFullYear()}` : ''}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
              <li className="p-2 text-center">
                <button
                  onClick={handleSearch}
                  className="text-[#E4D981] hover:text-[#82BC87] text-sm transition duration-300"
                >
                  See all results for "{searchTerm}"
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;