import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import { collectionsByCategory, collectionCategories, allCollectionIds } from '../constants/collectionsData';
import PremiumLoader from '../components/common/PremiumLoader';
import SEO from '../components/common/SEO';

// Batch fetch collection details from TMDB
const fetchCollectionsBatch = async (ids) => {
  // Fetch in chunks of 8 to avoid rate limiting
  const chunks = [];
  for (let i = 0; i < ids.length; i += 8) {
    chunks.push(ids.slice(i, i + 8));
  }

  const results = [];
  for (const chunk of chunks) {
    const promises = chunk.map(id =>
      tmdbApi.get(`/collection/${id}`)
        .then(res => res.data)
        .catch(() => null)
    );
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults.filter(Boolean));
  }
  return results;
};

// Search collections via TMDB
const searchCollections = async (query) => {
  const res = await tmdbApi.get('/search/collection', {
    params: { query, page: 1 }
  });
  return res.data.results || [];
};

// Collection card component
const CollectionCard = React.memo(({ collection, index }) => {
  const backdropUrl = collection.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${collection.backdrop_path}`
    : null;
  const posterUrl = collection.poster_path
    ? `https://image.tmdb.org/t/p/w342${collection.poster_path}`
    : null;
  const imageUrl = backdropUrl || posterUrl;
  const partCount = collection.parts?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        to={`/collection/${collection.id}`}
        className="group block relative rounded-xl overflow-hidden bg-gray-800/50 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          
          {/* Part count badge */}
          {partCount > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              <span className="text-xs font-medium text-white">{partCount} {partCount === 1 ? 'movie' : 'movies'}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-cyan-400 transition-colors duration-200">
            {collection.name}
          </h3>
          {collection.overview && (
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
              {collection.overview}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
});

CollectionCard.displayName = 'CollectionCard';

const CollectionsBrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchInputRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get collection IDs for the active category
  const categoryIds = useMemo(() => {
    if (activeCategory === 'all') {
      return allCollectionIds;
    }
    return (collectionsByCategory[activeCategory] || []).map(c => c.id);
  }, [activeCategory]);

  // Fetch collection details
  const { data: collections = [], isLoading, error } = useQuery({
    queryKey: ['collections-browse', activeCategory],
    queryFn: () => fetchCollectionsBatch(categoryIds),
    staleTime: 1000 * 60 * 30, // 30 min
    cacheTime: 1000 * 60 * 60, // 1 hour
    enabled: categoryIds.length > 0 && !debouncedSearch,
    refetchOnWindowFocus: false,
  });

  // Search query
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['collections-search', debouncedSearch],
    queryFn: () => searchCollections(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  // Deduplicated displayed collections
  const displayedCollections = useMemo(() => {
    const source = debouncedSearch.length >= 2 ? searchResults : collections;
    const seen = new Set();
    return source.filter(c => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [collections, searchResults, debouncedSearch]);

  const handleCategoryChange = useCallback((categoryId) => {
    setSearchQuery('');
    setDebouncedSearch('');
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  }, [setSearchParams]);

  const isLoadingState = debouncedSearch.length >= 2 ? isSearching : isLoading;

  return (
    <>
      <SEO
        title="Collections"
        description="Browse movie collections including Marvel, Star Wars, Harry Potter, and more. Discover complete franchises and series on Playex."
        url={window.location.href}
        type="website"
      />
      <div className="min-h-screen bg-[#141822] pt-24">
        <div className="container mx-auto px-4">
          <div className="relative min-h-screen">
            {/* Hero Section */}
            <div className="relative -mx-4 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[35vh] md:h-[45vh] flex items-center"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#141822] z-20" />
                <div className="absolute inset-0 bg-[#141822]">
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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
                      </span>
                      <span className="text-purple-400 font-medium">Movie Collections</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                      Browse
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 ml-3">
                        Collections
                      </span>
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                      Explore complete movie franchises and series. From superhero sagas to animated adventures, find your next binge.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 -mt-16 relative z-30">
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="relative max-w-xl">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search collections... (e.g. Marvel, Star Wars, Harry Potter)"
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-800/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Category Filters */}
              {!debouncedSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-8"
                >
                  <div className="flex flex-wrap gap-2">
                    {collectionCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`
                          inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${activeCategory === cat.id
                            ? 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white border border-purple-500/40 shadow-lg shadow-purple-500/20'
                            : 'bg-gray-800/40 text-gray-300 border border-white/5 hover:bg-gray-700/50 hover:text-white hover:border-white/10'
                          }
                        `}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Results Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <div className="flex items-center gap-3">
                  {debouncedSearch ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {isSearching ? 'Searching...' : `Found ${displayedCollections.length} results for "${debouncedSearch}"`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      <span>
                        <span className="text-cyan-400 font-medium">{displayedCollections.length}</span> collections
                        {activeCategory !== 'all' && (
                          <span> in <span className="text-purple-400 font-medium">{collectionCategories.find(c => c.id === activeCategory)?.name}</span></span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Main Content Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/5 shadow-2xl mb-12"
              >
                {isLoadingState ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-purple-500/30 rounded-full animate-spin border-t-purple-500" />
                      <div className="absolute inset-0 w-12 h-12 border-2 border-cyan-500/20 rounded-full animate-spin animate-reverse border-b-cyan-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <p className="text-gray-400 mt-4 text-sm">Loading collections...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Failed to load collections</h3>
                    <p className="text-gray-400 text-sm">Please try again later or refresh the page.</p>
                  </div>
                ) : displayedCollections.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700/30 border border-white/10 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No collections found</h3>
                    <p className="text-gray-400 text-sm">
                      {debouncedSearch ? `No results for "${debouncedSearch}". Try a different search term.` : 'No collections available for this category.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {displayedCollections.map((collection, index) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Scroll to top button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group hover:-translate-y-1"
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

            {/* Grid Pattern */}
            <style jsx>{`
              .bg-pattern-grid {
                background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
              }
            `}</style>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionsBrowsePage;
