// File: frontend/src/components/media/MediaCarousel.js
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaCard from '../common/MediaCard';
import PremiumLoader from '../common/PremiumLoader';

const MediaCarousel = ({ items, loading, error, showType = false }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px threshold
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <PremiumLoader size="small" text="Loading Content" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded">
          Failed to load content. Please try again later.
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      {/* Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none" />

      {/* Navigation Buttons */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-3 rounded-full backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg transform hover:scale-110 transition-all duration-300 group-hover:opacity-100 opacity-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}

        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-3 rounded-full backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg transform hover:scale-110 transition-all duration-300 group-hover:opacity-100 opacity-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {items?.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-[200px]"
          >
            <MediaCard media={item} showType={showType} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MediaCarousel;