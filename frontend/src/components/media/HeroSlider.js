import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { motion, AnimatePresence } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { tmdbHelpers } from '../../utils/api';
import { createMediaUrl } from '../../utils/slugify';

const RatingBadge = ({ rating }) => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/30"
  >
    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    <span className="text-white text-sm font-bold">{rating.toFixed(1)}</span>
  </motion.div>
);

const SlideContent = ({ item, isActive }) => {
  // Ensure item exists before trying to access properties
  if (!item) {
    return null;
  }

  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const releaseYear = item.release_date || item.first_air_date 
    ? new Date(item.release_date || item.first_air_date).getFullYear() 
    : '';

  const getMediaLink = (type) => {
    const title = item.title || item.name;
    const id = item.id;
    const slug = createMediaUrl(mediaType, id, title).split('/').pop();
    
    if (type === 'info') {
      return `/${mediaType}/${slug}`;
    } else {
      return mediaType === 'tv' 
        ? `/player/${mediaType}/${slug}/1/1`
        : `/player/${mediaType}/${slug}`;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="container mx-auto px-4 md:px-8 relative z-40"
    >
      <div className="max-w-2xl relative z-40">
        {/* Media Type Badge - Enhanced with vibrant colors */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/30 mb-6 shadow-2xl shadow-purple-500/20"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-purple-400 to-cyan-400" />
          </span>
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-sm tracking-wide">
            {mediaType === 'movie' ? 'MOVIE' : 'TV SERIES'}
          </span>
          {releaseYear && (
            <>
              <span className="text-white/50">•</span>
              <span className="text-white font-semibold">{releaseYear}</span>
            </>
          )}
          {item.vote_average > 0 && (
            <>
              <span className="text-white/50">•</span>
              <RatingBadge rating={item.vote_average} />
            </>
          )}
        </motion.div>

        {/* Title - Enhanced with gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 15 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-4xl md:text-7xl font-black mb-6 leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/90 drop-shadow-2xl">
            {item.title || item.name}
          </span>
        </motion.h1>

        {/* Overview - With fade in */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-base md:text-lg text-gray-200 mb-8 line-clamp-3 leading-relaxed"
        >
          {item.overview}
        </motion.p>

        {/* Action Buttons - Redesigned with vibrant colors */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-wrap gap-4 relative z-50"
        >
          <Link
            to={getMediaLink('info')}
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-bold text-base">More Info</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.div>
          </Link>

          <Link
            to={getMediaLink('watch')}
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border-2 border-white/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 rounded-2xl flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span className="text-white font-bold text-base">Watch Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

const HeroSlider = ({ items = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sliderRef = React.useRef(null);
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    fade: true,
    lazyLoad: 'progressive',
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    waitForAnimate: false,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      setImageLoaded(false);
    },
    afterChange: (current) => {
      setCurrentSlide(current);
    },
    customPaging: (i) => (
      <motion.div
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <motion.div
          animate={i === currentSlide ? { 
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`rounded-full cursor-pointer transition-all duration-500
            ${i === currentSlide 
              ? 'w-3 h-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 shadow-[0_0_20px_rgba(139,92,246,0.8)] shadow-blue-500/80' 
              : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'}`}
        />
      </motion.div>
    ),
    dotsClass: 'slick-dots custom-dots',
    ref: sliderRef,
  };
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="relative min-h-screen">
            {/* Backdrop Container */}
            <div className="absolute inset-0 w-full h-screen">
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ 
                  scale: currentSlide === index ? 1 : 1.05,
                  filter: imageLoaded && currentSlide === index ? 'none' : 'blur(8px)'
                }}
                transition={{ 
                  scale: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                  filter: { duration: 0.3 }
                }}
                className="relative h-full w-full"
                style={{ willChange: 'transform, filter' }}
              >
                <img
                  src={tmdbHelpers.getImageUrl(item.backdrop_path, 'original')}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  onLoad={() => {
                    if (currentSlide === index) {
                      setImageLoaded(true);
                    }
                  }}
                  style={{ 
                    objectPosition: '50% 15%',
                    imageRendering: 'crisp-edges',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden'
                  }}
                />
                
                {/* Enhanced Gradient Overlays with vibrant colors */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-[#0f0f2a]/60 to-transparent opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#1a0a2a]/40 to-transparent opacity-95" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f2a]/80 via-transparent to-[#0a0a1a]/90" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-cyan-900/10" />
                  <div className="absolute inset-0 backdrop-blur-[0.5px]" />
                </div>

                {/* Subtle Grain Overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.015]" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }} 
                />
              </motion.div>
            </div>

            {/* Content Container - Render all slides but only show active one */}
            <div className="absolute inset-0 flex items-center z-30">
              <div className={`w-full ${currentSlide === index ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <SlideContent item={item} isActive={currentSlide === index} />
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Keep the styles for Slick dots */}
      <style jsx="true">{`
        .custom-dots {
          position: absolute;
          bottom: 3rem;
          display: flex !important;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          z-index: 50;
        }
        
        .slick-slider {
          margin-bottom: 0;
        }

        /* Optimize image rendering */
        img {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;