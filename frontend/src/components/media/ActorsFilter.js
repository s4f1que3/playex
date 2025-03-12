// File: frontend/src/components/media/ActorsFilters.js
import React, { useState, useEffect } from 'react';

const ActorsFilters = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {
    sort_by: 'popularity.desc',
  });
  
  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  const handleSortChange = (e) => {
    setFilters(prev => ({
      ...prev,
      sort_by: e.target.value
    }));
  };
  
  return (
    <div className="bg-[#161616] p-4 rounded-lg mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort dropdown */}
        <div>
          <label htmlFor="sort_by" className="block text-sm text-gray-400 mb-1">Sort By</label>
          <select
            id="sort_by"
            value={filters.sort_by}
            onChange={handleSortChange}
            className="bg-[#1F1F1F] text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#82BC87]"
          >
            <option value="popularity.desc">Popularity (Descending)</option>
            <option value="popularity.asc">Popularity (Ascending)</option>
            <option value="name.asc">Name (A-Z)</option>
            <option value="name.desc">Name (Z-A)</option>
          </select>
        </div>
        
        {/* Note: TMDB API has limited filtering options for actors/people
           We could add more custom filters in the future if needed */}
      </div>
    </div>
  );
};

export default ActorsFilters;