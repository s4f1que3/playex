import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
  const location = useLocation();
  
  // Create a local state for managing filters before applying them
  const [localFilters, setLocalFilters] = useState({
    with_genres: [],
    primary_release_year: '',
    sort_by: 'popularity.desc'
  });

  const navigate = useNavigate();

  // Initialize local filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setLocalFilters({
      with_genres: params.get('with_genres') ? params.get('with_genres').split(',').map(Number) : [],
      primary_release_year: params.get('primary_release_year') || '',
      sort_by: params.get('sort_by') || 'popularity.desc'
    });
  }, [location.search]);

  // Simple toggle for genres
  const toggleGenre = (genreId) => {
    setLocalFilters(prev => {
      const currentGenres = [...(prev.with_genres || [])];
      const index = currentGenres.indexOf(genreId);
      
      if (index > -1) {
        currentGenres.splice(index, 1);
      } else {
        currentGenres.push(genreId);
      }
      
      return {
        ...prev,
        with_genres: currentGenres
      };
    });
  };

  // Handle year input
  const handleYearSubmit = (e) => {
    e.preventDefault();
    if (yearInput && /^\d{4}$/.test(yearInput)) {
      const year = parseInt(yearInput);
      const currentYear = new Date().getFullYear();
      if (year >= 1900 && year <= currentYear) {
        setLocalFilters(prev => ({
          ...prev,
          primary_release_year: yearInput
        }));
        setYearInput('');
      }
    }
  };

  // Remove year filter
  const removeYear = () => {
    setLocalFilters(prev => ({
      ...prev,
      primary_release_year: ''
    }));
  };

  // Apply filters to URL
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (localFilters.sort_by && localFilters.sort_by !== 'popularity.desc') {
      params.set('sort_by', localFilters.sort_by);
    }

    if (localFilters.with_genres?.length > 0) {
      params.set('with_genres', localFilters.with_genres.join(','));
    }

    if (localFilters.primary_release_year) {
      params.set('primary_release_year', localFilters.primary_release_year);
    }

    navigate(`${location.pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  // Reset all filters
  const handleReset = () => {
    setLocalFilters({
      with_genres: [],
      primary_release_year: '',
      sort_by: 'popularity.desc'
    });
    navigate(location.pathname);
    setIsOpen(false);
  };

  // Count active filters
  const filterCount = Object.values(localFilters).filter(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  ).length;

  // Fetch genres
  const { data: genresData } = useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () => tmdbApi.get(`/genre/${mediaType === 'tv' ? 'tv' : 'movie'}/list`)
      .then(res => res.data.genres),
    enabled: mediaType !== 'all',
    staleTime: Infinity
  });

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

  // Helper function to check if a genre is selected
  const isGenreSelected = (genreId) => {
    return localFilters.with_genres?.includes(genreId);
  };

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
              {mediaType === 'tv' && location.pathname === '/fan-favorites' ? (
                // Fan Favorites Message
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Filters Unavailable</h3>
                      <p className="text-yellow-500/80 text-sm">Fan Favorites Notice</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed">
                    Filtering is currently unavailable for Fan Favorites as they represent our community's most beloved shows. These are automatically curated based on user engagement and ratings.
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>Our community's highest rated picks</span>
                    </div>
                  </div>
                </div>
              ) : mediaType === 'tv' ? (
                // Regular TV Shows Message
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Filters Unavailable</h3>
                      <p className="text-yellow-500/80 text-sm">TV Shows Feature Notice</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed">
                    Unfortunately, filters are currently unavailable for TV Shows due to fetching availability. We apologize for the inconvenience.
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>Check out some fan favorites</span>
                      </div>
                      <Link
                        to="/fan-favorites"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                                 bg-[#E4D981]/10 text-[#E4D981] text-sm
                                 hover:bg-[#E4D981]/20 transition-all duration-300"
                      >
                        Fan Favorites
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                // Existing filter content for other media types
                <>
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Filter Content</h3>
                    <p className="text-gray-400 text-sm">Refine your browsing experience</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Sort By */}
                    <div className="space-y-3">
                      <label className="text-white font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
                        </svg>
                        Sort By
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {sortOptions.map(option => (
                          <motion.button
                            key={option.value}
                            onClick={() => setLocalFilters(prev => ({ ...prev, sort_by: option.value }))}
                            className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 relative group overflow-hidden
                              ${localFilters.sort_by === option.value
                                ? 'bg-[#82BC87] text-white shadow-lg shadow-[#82BC87]/20'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                              }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r from-[#82BC87]/10 to-transparent opacity-0 transition-opacity duration-300 ${
                              localFilters.sort_by === option.value ? 'opacity-100' : 'group-hover:opacity-100'
                            }`} />
                            <span className="relative flex items-center justify-center gap-2">
                              {option.label}
                              {localFilters.sort_by === option.value && (
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

                    {/* Year Search */}
                    <div className="space-y-3">
                      <label className="text-white font-medium">Release Year</label>
                      <form onSubmit={handleYearSubmit} className="relative">
                        <input
                          type="text"
                          value={yearInput}
                          onChange={(e) => setYearInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="Search year... (e.g., 2024)"
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 
                                   text-white outline-none focus:border-[#82BC87] transition-all duration-300
                                   placeholder-gray-500"
                        />
                        {localFilters.primary_release_year && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="px-3 py-1 rounded-lg bg-[#82BC87]/20 text-[#82BC87] text-sm">
                              {localFilters.primary_release_year}
                            </span>
                            <button
                              type="button"
                              onClick={removeYear}
                              className="text-gray-400 hover:text-white"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414z" clipRule="evenodd" />
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
                                ${isGenreSelected(genre.id)
                                  ? 'bg-[#82BC87] text-white shadow-lg shadow-[#82BC87]/20'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="flex items-center gap-2">
                                {genre.name}
                                {isGenreSelected(genre.id) && (
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
                      onClick={handleReset}
                      className="px-6 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 
                               transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset
                    </motion.button>
                    <motion.button
                      onClick={applyFilters}
                      className="px-6 py-2 rounded-xl bg-[#82BC87] text-white 
                               hover:bg-[#6da972] transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Apply Filters
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
