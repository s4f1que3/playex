import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';

const CollectionsIndexPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const itemsPerPage = 36; // 6x6 grid

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
        response.data.results.map(collection => ({
          ...collection,
          media_type: 'collection',
          poster_path: collection.poster_path,
          title: collection.name,
          id: collection.id
        }))
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

  // Filter collections based on debounced search query
  const filteredCollections = useMemo(() => {
    if (!collections) return [];
    if (!debouncedQuery.trim()) return collections;
    
    return collections.filter(collection => 
      collection.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [collections, debouncedQuery]);

  // Update pagination calculations to use filtered results
  const totalCollections = filteredCollections?.length || 0;
  const totalPages = Math.ceil(totalCollections / itemsPerPage);
  
  // Get current page collections
  const getCurrentPageCollections = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCollections?.slice(startIndex, endIndex) || [];
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Movie Collections
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400"
            >
              Explore complete movie series and franchises
            </motion.p>
          </div>
          
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
        </div>

        {filteredCollections && filteredCollections.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20 mb-6 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
            </svg>
            <span className="text-gray-400">
              Found <span className="text-[#82BC87] font-medium">{totalCollections.toLocaleString()}</span> collections
            </span>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/5 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={debouncedQuery}
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
              />
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CollectionsIndexPage;
