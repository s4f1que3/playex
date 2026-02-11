import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbHelpers } from '../../utils/api';
import { createMediaUrl } from '../../utils/slugify';

const CastList = ({ cast }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Changed to false
  const [hoveredId, setHoveredId] = useState(null);
  
  if (!cast?.length) return null;

  // Calculate items to show (2 rows)
  const itemsPerRow = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;
  const initialItems = itemsPerRow * 2;
  
  const displayCast = isExpanded ? cast : cast.slice(0, initialItems);
  
  const getActorLink = (actor) => {
    // Create a slug from the actor's name and ID
    const slug = createMediaUrl('actor', actor.id, actor.name).split('/').pop();
    return `/actor/${slug}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-12 pb-8"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Featured Cast</h2>
                <p className="text-gray-400 text-sm">{cast.length} cast members</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              transition={{ 
                layout: { duration: 0.3 },
                ease: "easeInOut"
              }}
            >
              <AnimatePresence mode="wait">
                {displayCast.map((actor, index) => (
                  <motion.div
                    key={actor.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      layout: { duration: 0.3 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                      delay: index * 0.03
                    }}
                    onHoverStart={() => setHoveredId(actor.id)}
                    onHoverEnd={() => setHoveredId(null)}
                  >
                    <Link 
                      to={getActorLink(actor)}
                      className="block bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl 
                               overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl 
                               hover:shadow-cyan-500/10 relative group"
                    >
                      <div className="aspect-[2/3] relative overflow-hidden">
                        <img
                          src={tmdbHelpers.getImageUrl(actor.profile_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
                          alt={actor.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        
                        {/* Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full 
                                      group-hover:translate-y-0 transition-transform duration-300">
                          <div className="space-y-1">
                            <h3 className="text-white font-bold leading-tight">{actor.name}</h3>
                            {actor.character && (
                              <p className="text-cyan-500 text-sm font-medium">
                                {actor.character}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Hover Action Indicator */}
                        <motion.div
                          initial={false}
                          animate={{ opacity: hoveredId === actor.id ? 1 : 0 }}
                          className="absolute top-2 right-2 bg-cyan-500 rounded-full p-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 010-1.414L10.586 10 7.293 6.707a1 1 011.414-1.414l4 4a1 1 010 1.414l-4 4a1 1 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* New Bottom Button Group */}
            {cast.length > initialItems && (
              <div className="flex gap-3 mt-6">
                <motion.button
                  layout
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex-1 px-4 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 
                           text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isExpanded ? (
                    <>
                      <span>Show Less</span>
                      <motion.svg 
                        animate={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </motion.svg>
                    </>
                  ) : (
                    <>
                      <span>Show All {cast.length} Cast Members</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CastList;