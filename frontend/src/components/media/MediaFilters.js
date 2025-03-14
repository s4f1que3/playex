// File: frontend/src/components/media/MediaFilters.js
import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../utils/api';
import GenreFilter from './GenreFilter';
import YearFilter from './YearFilter';

const MediaFilters = ({ mediaType, onFilterChange, initialFilters = {} }) => {
  const filterRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(initialFilters.with_genres || []);
  const [sortBy, setSortBy] = useState(initialFilters.sort_by || 'popularity.desc');
  const [releaseYear, setReleaseYear] = useState(initialFilters.primary_release_year || initialFilters.first_air_date_year || '');
  
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popular' },
    { value: 'vote_average.desc', label: 'Top Rated' },
    { value: 'primary_release_date.desc', label: 'Latest' }
  ];

  // Add query for genres to get names
  const { data: genresData } = useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () => tmdbApi.get(`/genre/${mediaType}/list`).then(res => res.data.genres),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Helper to get genre name - Fix the data structure reference
  const getGenreName = (genreId) => {
    const genre = genresData?.find(g => g.id === genreId);
    return genre ? genre.name : genreId;
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    setReleaseYear('');
    handleFilterChange();
    setIsOpen(false);
  };

  // Apply filters when changes are made
  const handleFilterChange = () => {
    const filters = {
      sort_by: sortBy,
      with_genres: selectedGenres,
      [mediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year']: releaseYear
    };
    onFilterChange(filters);
  };

  // Add click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-4">
        {/* Filters dropdown button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <span>Filters</span>
            <svg
              className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Filters dropdown panel */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-96 bg-gray-900 rounded-lg shadow-xl z-50 p-4">
              {/* Sort options */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year filter */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Year</label>
                <YearFilter
                  selectedYear={releaseYear}
                  onChange={(year) => {
                    setReleaseYear(year);
                    handleFilterChange();
                  }}
                />
              </div>

              {/* Genre filter */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Genres</label>
                <GenreFilter
                  selectedGenres={selectedGenres}
                  setSelectedGenres={(genres) => {
                    setSelectedGenres(genres);
                    handleFilterChange();
                  }}
                  mediaType={mediaType}
                  showSelected={false}
                />
              </div>

              {/* Clear filters button */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected filters display */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedGenres.map(genreId => (
            <button
              key={genreId}
              onClick={() => {
                setSelectedGenres(selectedGenres.filter(id => id !== genreId));
                handleFilterChange();
              }}
              className="bg-[#82BC87] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-[#6ea973] transition-colors"
            >
              {getGenreName(genreId)}
              <span>×</span>
            </button>
          ))}
          {releaseYear && (
            <button
              onClick={() => {
                setReleaseYear('');
                handleFilterChange();
              }}
              className="bg-[#82BC87] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-[#6ea973] transition-colors"
            >
              {releaseYear}
              <span>×</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaFilters;