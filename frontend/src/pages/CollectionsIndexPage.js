import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualizer } from '@tanstack/react-virtual';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';
import { Tooltip } from 'react-tooltip';
import { Select, Tag } from '../components/ui';

const CollectionsIndexPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [isGridView, setIsGridView] = useState(true);
  const itemsPerPage = 36; // 6x6 grid

  const categories = [
    { id: 'all', name: 'All Collections' },
    { id: 'superhero', name: 'Superhero' },
    { id: 'animation', name: 'Animation' },
    { id: 'action', name: 'Action' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'horror', name: 'Horror' }
  ];

  const categoryKeywords = {
    superhero: ['marvel', 'dc comics', 'x-men', 'spider-man', 'batman', 'superman', 'iron man', 'thor', 'captain america', 'avengers', 'guardians of the galaxy', 'ant man', 'black panther'],
    animation: ['toy story', 'shrek', 'how to train your dragon', 'despicable me', 'ice age', 'kung fu panda', 'madagascar', 'pixar', 'dreamworks'],
    action: ['james bond', 'fast and furious', 'mission impossible', 'john wick', 'indiana jones', 'matrix', 'terminator', 'transformers'],
    fantasy: ['harry potter', 'lord of the rings', 'fantastic beasts'],
    horror: ['halloween', 'friday the 13th', 'nightmare on elm street', 'saw', 'conjuring', 'insidious', 'final destination']
  };

  // Create debounced search
  const debouncedSearch = useCallback((value) => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, []);

  const { data: collections, isLoading } = useQuery({
    queryKey: ['allCollections'],
    queryFn: async () => {
      const queries = [
        // Existing Collections
        'marvel', 'star wars', 'harry potter', 'lord of the rings', 
        'dc comics', 'james bond', 'fast and furious', 'mission impossible',
        'jurassic park', 'indiana jones', 'matrix', 'terminator',
        'transformers', 'pirates of the caribbean', 'alien',
        // Additional Popular Collections
        'john wick', 'toy story', 'the godfather', 'back to the future',
        'rocky', 'rambo', 'blade runner', 'planet of the apes',
        'x-men', 'spider-man', 'batman', 'superman',
        'iron man', 'thor', 'captain america', 'avengers',
        // Animation Collections
        'shrek', 'how to train your dragon', 'despicable me', 'ice age',
        'kung fu panda', 'madagascar', 'pixar', 'dreamworks',
        // Horror Collections
        'halloween', 'friday the 13th', 'nightmare on elm street', 'saw',
        'conjuring', 'insidious', 'final destination',
        // International Collections
        'godzilla', 'dragon ball', 'detective conan', 'ring',
        // Recent Collections
        'guardians of the galaxy', 'ant man', 'black panther',
        'fantastic beasts', 'hunger games', 'maze runner', 'divergent'
      ];
      
      const collectionsPromises = queries.map(query => 
        tmdbApi.get('/search/collection', {
          params: {
            query,
            include_adult: false,
            language: 'en-US',
            page: 1
          }
        })
      );
      
      const responses = await Promise.all(collectionsPromises);
      
      const allCollections = responses.flatMap(response => 
        response.data.results.map(collection => {
          // Determine collection category
          let category = 'all';
          const lowerName = collection.name.toLowerCase();
          
          // Check each category's keywords
          Object.entries(categoryKeywords).forEach(([cat, keywords]) => {
            if (keywords.some(keyword => lowerName.includes(keyword.toLowerCase()))) {
              category = cat;
            }
          });

          return {
            ...collection,
            media_type: 'collection',
            poster_path: collection.poster_path,
            title: collection.name,
            id: collection.id,
            category: category // Add category to collection object
          };
        })
      );
      
      // Remove duplicates
      const uniqueCollections = [...new Map(allCollections.map(item => [item.id, item])).values()];
      return uniqueCollections;
    },
    staleTime: 600000
  });

  // Update search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Enhanced filtering logic
  const filteredAndSortedCollections = useMemo(() => {
    let result = [...(collections || [])];
    
    if (selectedCategory !== 'all') {
      result = result.filter(collection => collection.category === selectedCategory);
    }
    
    if (debouncedQuery) {
      result = result.filter(collection => 
        collection.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    
    return result.sort((a, b) => {
      switch (selectedSort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return b.vote_average - a.vote_average;
        default: return b.popularity - a.popularity;
      }
    });
  }, [collections, selectedCategory, debouncedQuery, selectedSort]);

  // Update pagination calculations to use filtered results
  const totalCollections = filteredAndSortedCollections?.length || 0;
  const totalPages = Math.ceil(totalCollections / itemsPerPage);
  
  // Get current page collections
  const getCurrentPageCollections = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCollections?.slice(startIndex, endIndex) || [];
  };

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

  return (
    <div className="min-h-screen bg-[#161616] pt-24">
      <div className="container mx-auto px-4">
        <div className="relative min-h-screen">
          {/* Parallax Hero Section - Similar to MoviesPage */}
          <div className="relative -mx-4 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-[40vh] md:h-[50vh] flex items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616] z-20" />
              <div className="absolute inset-0 bg-[#161616]">
                <div className="absolute inset-0 opacity-5 animate-pulse">
                  <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150" />
                </div>
              </div>

              <div className="container relative z-30 mx-auto px-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-6 backdrop-blur-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                    </span>
                    <span className="text-[#82BC87] font-medium">Browse Collections</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                    Discover
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                      Movie Collections
                    </span>
                  </h1>

                  <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                    From epic franchises to complete series, explore our curated collection of movie universes.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-4 -mt-20 relative z-30">
            {/* Search and Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-gray-900/90 rounded-2xl p-6 border border-white/5 shadow-2xl mb-8"
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
              <div className="flex flex-wrap gap-4 mt-6">
                <Select 
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                  className="min-w-[180px]"
                />
                <Select
                  value={selectedSort}
                  onChange={setSelectedSort}
                  options={[
                    { id: 'popularity', name: 'Most Popular' },
                    { id: 'rating', name: 'Highest Rated' },
                    { id: 'name', name: 'Alphabetical' }
                  ]}
                  className="min-w-[180px]"
                />
                <button
                  onClick={() => setIsGridView(!isGridView)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  {/* View toggle icon */}
                </button>
              </div>
            </motion.div>

            {/* Results Counter */}
            {filteredAndSortedCollections && filteredAndSortedCollections.length > 0 && (
              <motion.div 
                layout
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20 mb-6 w-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
                <span className="text-gray-400">
                  Found <span className="text-[#82BC87] font-medium">{totalCollections.toLocaleString()}</span> collections
                </span>
              </motion.div>
            )}

            {/* Main Content Grid */}
            <motion.div 
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
              layout
            >
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

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  className="mt-12 backdrop-blur-md bg-black/20 p-4 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="pagination-modern"
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-[#82BC87] hover:bg-[#6da972] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 transform group-hover:-translate-y-1 transition-transform duration-300" 
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

export default CollectionsIndexPage;
