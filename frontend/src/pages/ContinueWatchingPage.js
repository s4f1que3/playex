import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getContinueWatching } from '../utils/LocalStorage';
import MediaCard from '../components/common/MediaCard';

const ContinueWatchingPage = () => {
  const continueWatchingData = getContinueWatching();

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
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
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
                <span className="text-cyan-400 font-medium">Continue Watching</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Pick Up Where You
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-indigo-500 ml-3">
                  Left Off
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                Continue watching your favorite movies and TV shows.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-0 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/5 shadow-2xl"
        >
          {/* Results Counter */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20 mb-6 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-400">
              Found <span className="text-cyan-400 font-medium">{continueWatchingData.length}</span> items
            </span>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {continueWatchingData.map((item, index) => (
              <motion.div
                key={`${item.media_id}-${item.media_type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={item.media_type === 'tv' && item.details.last_episode
                    ? `/player/tv/${item.media_id}/${item.details.last_episode.season}/${item.details.last_episode.episode}`
                    : `/player/${item.media_type}/${item.media_id}`
                  }
                >
                  <MediaCard media={item.details} />
                </Link>
              </motion.div>
            ))}
          </div>

          {continueWatchingData.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No items to continue watching</h3>
              <p className="text-gray-400">Start watching some movies or TV shows to see them here!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContinueWatchingPage;
