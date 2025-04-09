import React, { useState, useMemo, useCallback, Suspense, useTransition } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';
import { Select, Tag } from '../components/ui';
import GenreDropdown from '../components/ui/GenreDropdown';
import RequestForm from '../components/requests/RequestForm';
import { useCollectionsPrefetch } from '../hooks/useCollectionsPrefetch';
import { categoryKeywords, categories } from '../constants/categoryKeywords';
import { collectionService } from '../services/collectionService';
import { useDebounce } from 'use-debounce';

const CHUNK_SIZE = 30; // Number of items to load per chunk
const PREFETCH_THRESHOLD = 2; // Number of chunks to prefetch ahead

const CollectionsIndexPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [isGridView, setIsGridView] = useState(true);
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = 36; // 6x6 grid

  useCollectionsPrefetch(categoryKeywords);

  // Modified query to include category filtering
  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections', selectedCategory],
    queryFn: () => collectionService.getAllCollections(categoryKeywords),
    staleTime: 300000, 
    cacheTime: 3600000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    suspense: true,
    useErrorBoundary: true,
    retry: 2,
    retryDelay: 1000,
  });

  // Update search handler to use debounced value
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Updated category selector handler with startTransition
  const handleCategoryChange = (category) => {
    startTransition(() => {
      setSelectedCategory(category);
      setCurrentPage(1); // Reset to first page when changing category
    });
  };

  // Updated filtering logic
  const filteredAndSortedCollections = useMemo(() => {
    if (!collections) return [];
    
    let result = collections;

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(c => c.category === selectedCategory);
    }
    
    // Apply search filter
    if (debouncedQuery) {
      const searchTerm = debouncedQuery.toLowerCase();
      result = result.filter(c => {
        const searchableText = [
          c.title,
          c.overview,
          ...(c.genres || []).map(g => g.name),
          c.searchText
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchableText.includes(searchTerm);
      });
    }
    
    // Apply sort with improved handling
    return result.sort((a, b) => {
      switch (selectedSort) {
        case 'name': 
          return (a.title || a.name || '').localeCompare(b.title || b.name || '');
        case 'rating': 
          return ((b.vote_average || 0) - (a.vote_average || 0)) || 
                 ((b.popularity || 0) - (a.popularity || 0)); // Secondary sort by popularity
        default: // popularity
          return ((b.popularity || 0) - (a.popularity || 0));
      }
    });
  }, [collections, selectedCategory, debouncedQuery, selectedSort]);

  // Get current page collections
  const getCurrentPageCollections = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCollections?.slice(startIndex, endIndex) || [];
  }, [currentPage, filteredAndSortedCollections, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.2
      }
    }
  };

  const isLoadingState = isLoading || isPending;

  return (
    <div className="min-h-screen bg-[#161616] pt-16 sm:pt-20 md:pt-24">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="relative min-h-screen">
          {/* Parallax Hero Section */}
          <div className="relative -mx-2 sm:-mx-4 overflow-hidden mb-20 sm:mb-1"> {/* Reduced margin bottom */}
            <motion.div className="relative min-h-screen">
              <div className="relative h-[35vh] sm:h-[45vh] md:h-[55vh] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616] z-20" />
                <div className="absolute inset-0 bg-[#161616]">
                  <div className="absolute inset-0 opacity-5 animate-pulse">
                    <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150" />
                  </div>
                </div>
                <div className="container relative z-30 mx-auto px-3 sm:px-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl"
                  >
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-4 sm:mb-6 backdrop-blur-sm">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                      </span>
                      <span className="text-[#82BC87] font-medium">Browse Collections</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                      Discover
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                        Movie Collections
                      </span>
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
                      From epic franchises to complete series, explore our curated collection of movie universes.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-2 sm:px-4 -mt-10 sm:-mt-[430px] relative z-30"> {/* Reduced negative margin */}
            {/* Search and Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-50 backdrop-blur-xl bg-gray-900/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 shadow-2xl mb-6 sm:mb-8"
            >
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search collections..."
                  className="w-full bg-black/30 text-white placeholder-gray-400 border border-white/10 rounded-xl px-5 py-2.5 pl-11 focus:outline-none focus:border-[#82BC87]/50 transition-all text-sm"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Filters */}
              <div className="relative z-50 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6">
                <GenreDropdown
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  disabled={isPending}
                />
                <Select
                  value={selectedSort}
                  onChange={setSelectedSort}
                  options={[
                    { id: 'popularity', name: 'Most Popular' },
                    { id: 'rating', name: 'Highest Rated' },
                    { id: 'name', name: 'Alphabetical' }
                  ]}
                  className="w-full sm:w-auto sm:min-w-[180px]"
                />
                <button
                  onClick={() => setIsGridView(!isGridView)}
                  className="w-full sm:w-auto p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  {/* View toggle icon */}
                </button>
              </div>
            </motion.div>

            {/* Results Counter */}
            {filteredAndSortedCollections && filteredAndSortedCollections.length > 0 && (
              <motion.div 
                layout
                className="relative z-40 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-black/20 mb-4 sm:mb-6 w-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
                <span className="text-gray-400">
                  Found <span className="text-[#82BC87] font-medium">{filteredAndSortedCollections.length.toLocaleString()}</span> collections
                </span>
              </motion.div>
            )}

            {/* Main Content Grid */}
            <motion.div 
              className="relative z-30 bg-gray-900/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/5 shadow-2xl"
              layout
            >
              {isLoadingState ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#82BC87] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400">Loading collections...</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedCategory}-${debouncedQuery}-${selectedSort}`}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <MediaGrid 
                      items={getCurrentPageCollections()}
                      loading={isLoading}
                      showType={true}
                      gridView={isGridView}
                      onHover={(item) => {
                        // Show preview tooltip
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
              {Math.ceil(filteredAndSortedCollections.length / itemsPerPage) > 1 && (
                <motion.div 
                  className="mt-8 sm:mt-12 backdrop-blur-md bg-black/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredAndSortedCollections.length / itemsPerPage)}
                    onPageChange={handlePageChange}
                    className="pagination-modern"
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Request Form - Add this before the final closing divs */}
            <div className="mt-12 sm:mt-20">
              <RequestForm 
                title="Missing a Collection?"
                description="Can't find your favorite movie collection or franchise? Let us know and we'll add it to our database!"
                buttonText="Request Collection"
              />
            </div>
          </div>

          {/* Scroll to Top Button - Adjusted for better mobile placement */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 bg-[#82BC87] hover:bg-[#6da972] text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 transform group-hover:-translate-y-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CollectionsIndexPage);