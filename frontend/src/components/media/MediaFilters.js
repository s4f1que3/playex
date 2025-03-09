// File: frontend/src/components/media/MediaFilters.js
import React, { useState } from 'react';
import GenreFilter from './GenreFilter';

const MediaFilters = ({ mediaType, onFilterChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(initialFilters.with_genres || []);
  const [sortBy, setSortBy] = useState(initialFilters.sort_by || 'popularity.desc');
  const [releaseYear, setReleaseYear] = useState(initialFilters.primary_release_year || initialFilters.first_air_date_year || '');
  
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity Descending' },
    { value: 'popularity.asc', label: 'Popularity Ascending' },
    { value: 'vote_average.desc', label: 'Rating Descending' },
    { value: 'vote_average.asc', label: 'Rating Ascending' },
    { value: 'primary_release_date.desc', label: 'Release Date Descending' },
    { value: 'primary_release_date.asc', label: 'Release Date Ascending' },
  ];
  
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }
  
  const handleApplyFilters = () => {
    const filters = { sort_by: sortBy };
    
    if (selectedGenres.length > 0) {
      filters.with_genres = selectedGenres.join(',');
    }
    
    if (releaseYear) {
      if (mediaType === 'movie') {
        filters.primary_release_year = releaseYear;
      } else {
        filters.first_air_date_year = releaseYear;
      }
    }
    
    onFilterChange(filters);
    setIsOpen(false);
  };
  
  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    setReleaseYear('');
    
    onFilterChange({ sort_by: 'popularity.desc' });
    setIsOpen(false);
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-2 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {(selectedGenres.length > 0 || sortBy !== 'popularity.desc' || releaseYear) && (
          <button
            onClick={clearFilters}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded w-full py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#82BC87]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Release Year</label>
              <select
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded w-full py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#82BC87]"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-white text-sm font-medium mb-2">Genres</label>
            <GenreFilter
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              mediaType={mediaType}
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={handleApplyFilters}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaFilters;