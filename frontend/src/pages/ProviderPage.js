import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaCard from '../components/common/MediaCard';
import PremiumLoader from '../components/common/PremiumLoader';
import { Helmet } from 'react-helmet-async';

// Provider info mapping
const providerInfo = {
  8: { name: 'Netflix', shortName: 'NF', color: '#E50914', gradient: 'from-red-600 to-red-700' },
  9: { name: 'Prime Video', shortName: 'PV', color: '#00A8E1', gradient: 'from-blue-500 to-blue-600' },
  337: { name: 'Disney+', shortName: 'D+', color: '#113CCF', gradient: 'from-blue-600 to-indigo-700' },
  350: { name: 'Apple TV+', shortName: 'TV', color: '#000000', gradient: 'from-gray-800 to-black' },
  1899: { name: 'HBO Max', shortName: 'HBO', color: '#5B2E82', gradient: 'from-purple-600 to-purple-800' },
  15: { name: 'Hulu', shortName: 'HU', color: '#1CE783', gradient: 'from-green-500 to-emerald-600' },
  2303: { name: 'Paramount+', shortName: 'P+', color: '#0064FF', gradient: 'from-blue-500 to-blue-700' },
  2616: { name: 'Peacock', shortName: 'PC', color: '#000000', gradient: 'from-yellow-500 to-orange-500' },
};

const ProviderPage = () => {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const providerName = searchParams.get('name') || providerInfo[providerId]?.name || 'Streaming Provider';
  const provider = providerInfo[providerId] || { color: '#06b6d4', gradient: 'from-cyan-600 to-blue-700', shortName: 'SP' };
  
  const [mediaType, setMediaType] = useState('movie');
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState([]);

  // Fetch content by provider
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['providerContent', providerId, mediaType, page],
    queryFn: async () => {
      console.log('Fetching provider content:', { providerId, mediaType, page });
      try {
        const response = await tmdbApi.get(`/discover/${mediaType}`, {
          params: {
            with_watch_providers: providerId,
            watch_region: 'US',
            sort_by: 'popularity.desc',
            page: page,
            'include_adult': false
          }
        });
        console.log('Provider content response:', response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching provider content:', err);
        throw err;
      }
    },
    keepPreviousData: true
  });

  // Update results when data changes
  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllResults(data.results);
      } else {
        setAllResults(prev => [...prev, ...data.results]);
      }
    }
  }, [data, page]);

  const handleLoadMore = () => {
    if (data && page < data.total_pages) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1);
    setAllResults([]);
  }, [mediaType, providerId]);

  return (
    <>
      <Helmet>
        <title>{providerName} - Browse Content | Playex</title>
        <meta name="description" content={`Discover movies and TV shows available on ${providerName}`} />
      </Helmet>

      <div className="min-h-screen bg-[#161616] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0] 
            }} 
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 opacity-5"
          >
            <div className="absolute inset-0 bg-pattern-grid transform scale-150" />
          </motion.div>
          {/* Color accent */}
          <div 
            className="absolute top-0 right-0 w-1/3 h-1/3 blur-[120px] opacity-20"
            style={{ background: provider.color }}
          />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {/* Back Button */}
            <motion.button
              whileHover={{ x: -4 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-cyan-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </motion.button>

            {/* Provider Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Provider Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${provider.gradient} flex items-center justify-center shadow-2xl`}>
                  <span className="text-white text-3xl font-bold tracking-tight">
                    {provider.shortName}
                  </span>
                </div>
                {/* Glow effect */}
                <div 
                  className="absolute -inset-2 rounded-2xl blur-xl opacity-50 -z-10"
                  style={{ background: provider.color }}
                />
              </motion.div>

              {/* Title and Stats */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-6xl font-bold mb-3">
                  <span className="text-white">{providerName}</span>
                  <span className="ml-3 text-2xl md:text-3xl text-gray-500">Library</span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg mb-4">
                  Explore exclusive {mediaType === 'movie' ? 'movies' : 'TV shows'} available on {providerName}
                </p>
                
                {/* Stats Bar */}
                {data && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center gap-4"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      <span className="text-white font-semibold">{data.total_results?.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm">
                        {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
                      </span>
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: provider.color }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white font-semibold">Page {page}</span>
                      <span className="text-gray-400 text-sm">of {data.total_pages}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Media Type Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 mb-10"
          >
            <button
              onClick={() => setMediaType('movie')}
              className="relative group"
            >
              <div className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                mediaType === 'movie'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Movies
                </div>
              </div>
              {mediaType === 'movie' && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${provider.gradient} opacity-20 -z-10`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {mediaType === 'movie' && (
                <motion.div
                  layoutId="activeTabBorder"
                  className="absolute inset-0 rounded-xl border-2"
                  style={{ borderColor: provider.color }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>

            <button
              onClick={() => setMediaType('tv')}
              className="relative group"
            >
              <div className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                mediaType === 'tv'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 0v14h12V3H4z" clipRule="evenodd" />
                  </svg>
                  TV Shows
                </div>
              </div>
              {mediaType === 'tv' && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${provider.gradient} opacity-20 -z-10`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {mediaType === 'tv' && (
                <motion.div
                  layoutId="activeTabBorder"
                  className="absolute inset-0 rounded-xl border-2"
                  style={{ borderColor: provider.color }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </motion.div>

          {/* Content Grid */}
          {(isLoading || isFetching) && allResults.length === 0 ? (
            <PremiumLoader />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-400 text-xl font-semibold mb-2">Error Loading Content</p>
                  <p className="text-gray-400 mb-6">{String(error) || 'Please try again later'}</p>
                  <button 
                    onClick={() => refetch()}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          ) : !allResults || allResults.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <div>
                  <p className="text-gray-300 text-xl font-semibold mb-2">No Content Available</p>
                  <p className="text-gray-500">No {mediaType === 'movie' ? 'movies' : 'TV shows'} found from {providerName}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {allResults.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        delay: index < 18 ? index * 0.03 : 0,
                        duration: 0.3
                      }}
                      layout
                    >
                      <MediaCard
                        media={{
                          ...item,
                          media_type: mediaType
                        }}
                        showType={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {data && page < data.total_pages && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-16"
                >
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="group relative px-10 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading More...
                        </>
                      ) : (
                        <>
                          Load More Content
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-y-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </span>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </button>
                  
                  <p className="text-gray-500 text-sm mt-4">
                    Showing {allResults.length} of {data.total_results?.toLocaleString()} {mediaType === 'movie' ? 'movies' : 'TV shows'}
                  </p>
                </motion.div>
              )}

              {/* End of Results */}
              {data && page >= data.total_pages && allResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-16 py-8"
                >
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400 font-medium">You've reached the end of the library</span>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProviderPage;
