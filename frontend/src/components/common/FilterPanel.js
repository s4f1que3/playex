import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useFilterParams } from '../../hooks/useFilterParams';
import { tmdbApi, movieGenres, tvGenres } from '../../utils/api';

const FilterButton = ({ isOpen, onClick, filterCount }) => (
  <motion.button
    onClick={onClick}
    className="group relative px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 
               border border-white/10 transition-all duration-300"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
      </svg>
      <span className="text-white font-medium">Filters</span>
      {filterCount > 0 && (
        <div className="w-6 h-6 rounded-full bg-[#82BC87] flex items-center justify-center">
          <span className="text-white text-sm font-medium">{filterCount}</span>
        </div>
      )}
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </motion.div>
    </div>
  </motion.button>
);

const FilterPanel = ({ mediaType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [yearInput, setYearInput] = useState('');
  const { filters, updateFilters } = useFilterParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch genres
  const { data: genresData } = useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () => tmdbApi.get(`/genre/${mediaType === 'tv' ? 'tv' : 'movie'}/list`)
      .then(res => res.data.genres),
    enabled: mediaType !== 'all',
    staleTime: Infinity
  });

  // Handle year input
  const handleYearSubmit = (e) => {
    e.preventDefault();
    if (yearInput && /^\d{4}$/.test(yearInput)) {
      const year = parseInt(yearInput);
      const currentYear = new Date().getFullYear();
      if (year >= 1900 && year <= currentYear) {
        updateFilters({ primary_release_year: yearInput });
        setYearInput('');
      }
    }
  };

  const handleYearInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setYearInput(value);
  };

  // Toggle genre selection
  const toggleGenre = (genreId) => {
    const currentGenres = filters.with_genres || [];
    const newGenres = currentGenres.includes(genreId)
      ? currentGenres.filter(id => id !== genreId)
      : [...currentGenres, genreId];
    updateFilters({ with_genres: newGenres });
  };

  // Calculate active filter count
  const filterCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  ).length;

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'primary_release_date.desc', label: 'Recently Released' },
    { value: 'revenue.desc', label: 'Highest Revenue' }
  ];

  // Get appropriate genres based on mediaType
  const genres = React.useMemo(() => {
    if (mediaType === 'movie') return movieGenres;
    if (mediaType === 'tv') return tvGenres;
    if (mediaType === 'all') {
      // For trending page, combine movie and TV genres, removing duplicates
      const combinedGenres = [...movieGenres, ...tvGenres];
      return Array.from(new Map(combinedGenres.map(genre => [genre.id, genre])).values());
    }
    return [];
  }, [mediaType]);

  return (
    <div className="relative z-[9999]">
      <FilterButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
        filterCount={filterCount}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
              onClick={() => setIsOpen(false)}
            />

            {/* Filter Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 mt-4 w-[400px] bg-gray-900/95 backdrop-blur-xl 
                         rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-[9995]"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Filter Content</h3>
                <p className="text-gray-400 text-sm">Refine your browsing experience</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Sort By */}
                <div className="space-y-3">
                  <label className="text-white font-medium">Sort By</label>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map(option => (
                      <motion.button
                        key={option.value}
                        onClick={() => updateFilters({ sort_by: option.value })}
                        className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                          ${filters.sort_by === option.value
                            ? 'bg-[#82BC87] text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Year Search */}
                <div className="space-y-3">
                  <label className="text-white font-medium">Release Year</label>
                  <form onSubmit={handleYearSubmit} className="relative">
                    <input
                      type="text"
                      value={yearInput}
                      onChange={handleYearInputChange}
                      placeholder="Search year... (e.g., 2024)"
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 
                               text-white outline-none focus:border-[#82BC87] transition-all duration-300
                               placeholder-gray-500"
                    />
                    {filters.primary_release_year && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-[#82BC87]/20 text-[#82BC87] text-sm">
                          {filters.primary_release_year}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateFilters({ primary_release_year: '' })}
                          className="text-gray-400 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Genre Tags */}
                {genres.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-white font-medium">Genres</label>
                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
                      {genres.map(genre => (
                        <motion.button
                          key={genre.id}
                          onClick={() => toggleGenre(genre.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 
                            ${filters.with_genres?.includes(genre.id)
                              ? 'bg-[#82BC87] text-white shadow-lg shadow-[#82BC87]/20'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="flex items-center gap-2">
                            {genre.name}
                            {filters.with_genres?.includes(genre.id) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </motion.svg>
                            )}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-black/20 border-t border-white/5 flex justify-end gap-3">
                <motion.button
                  onClick={() => {
                    // Reset filters logic
                    const baseParams = new URLSearchParams(location.search);
                    ['sort_by', 'primary_release_year', 'with_genres'].forEach(param => 
                      baseParams.delete(param)
                    );
                    navigate(`${location.pathname}?${baseParams.toString()}`);
                    setIsOpen(false);
                  }}
                  className="px-6 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 
                           transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 rounded-xl bg-[#82BC87] text-white 
                           hover:bg-[#6da972] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
