// File: frontend/src/components/media/HeroSlider.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { motion, AnimatePresence } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { tmdbHelpers } from '../../utils/api';
import { createMediaUrl } from '../../utils/slugify';

const RatingBadge = ({ rating }) => (
  <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
    <svg className="w-4 h-4 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    <span className="text-white text-sm font-medium">{rating.toFixed(1)}</span>
  </div>
);

const SlideContent = ({ item, isActive }) => {
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const releaseYear = item.release_date || item.first_air_date 
    ? new Date(item.release_date || item.first_air_date).getFullYear() 
    : '';

  const getMediaLink = (type) => {
    const slug = createMediaUrl(mediaType, item.id, item.title || item.name).split('/').pop();
    return type === 'info' 
      ? `/${mediaType}/${slug}`
      : `/player/${mediaType}${mediaType === 'tv' ? `/${slug}/1/1` : `/${slug}`}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="container mx-auto px-4"
    >
      <div className="max-w-xl">
        {/* Media Type Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
          </span>
          <span className="text-[#82BC87] font-medium">{mediaType === 'movie' ? 'Movie' : 'TV Series'}</span>
          {releaseYear && (
            <>
              <span className="text-gray-500">•</span>
              <span className="text-white">{releaseYear}</span>
            </>
          )}
          {item.vote_average > 0 && (
            <>
              <span className="text-gray-500">•</span>
              <RatingBadge rating={item.vote_average} />
            </>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            {item.title || item.name}
          </span>
        </motion.h1>

        {/* Overview */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-lg text-gray-300 mb-8 line-clamp-3"
        >
          {item.overview}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            to={getMediaLink('info')}
            className="group relative overflow-hidden px-8 py-4 rounded-xl bg-[#82BC87] hover:bg-[#6da972] 
                     transition-all duration-500 flex items-center gap-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                          transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-medium">More Info</span>
            </motion.div>
          </Link>

          <Link
            to={getMediaLink('watch')}
            className="group relative overflow-hidden px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 
                     backdrop-blur-sm transition-all duration-500 flex items-center gap-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                          transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span className="text-white font-medium">Watch Now</span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

const HeroSlider = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sliderRef = React.useRef(null);
  
  const settings = {
    dots: true, // Change back to true to show Slick dots
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: true,
    fade: true,
    lazyLoad: 'progressive',
    beforeChange: (_, next) => {
      setCurrentSlide(next);
      setCurrentIndex(next);
      setImageLoaded(false);
    },
    customPaging: (i) => (
      <motion.div
        whileHover={{ scale: 1.2 }}
        className={`w-3 h-3 mx-1 rounded-full transition-all duration-500 
          ${i === currentSlide 
            ? 'bg-[#82BC87] shadow-lg shadow-[#82BC87]/50' 
            : 'bg-white/30 hover:bg-white/50'}`}
      />
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
          <div key={item.id} className="relative min-h-screen"> {/* Changed from min-h-[80vh] to min-h-screen */}
            {/* Backdrop Container */}
            <div className="absolute inset-0 w-full h-screen"> {/* Added w-full h-screen */}
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ 
                  scale: currentSlide === index ? 1 : 1.1,
                  filter: imageLoaded ? 'none' : 'blur(10px)'
                }}
                transition={{ 
                  scale: { duration: 8, ease: "easeOut" },
                  filter: { duration: 0.5 }
                }}
                className="relative h-full w-full" // Added w-full
              >
                <img
                  src={tmdbHelpers.getImageUrl(item.backdrop_path, 'original')}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  onLoad={() => setImageLoaded(true)}
                  style={{ 
                    objectPosition: '50% 15%', // Adjusted to show more of the upper part
                    imageRendering: 'crisp-edges',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden'
                  }}
                />
                
                {/* Enhanced Gradient Overlays */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#161616] via-[#161616]/50 to-transparent opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-transparent opacity-95" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#161616]/80 via-transparent to-[#161616]/80" />
                  <div className="absolute inset-0 backdrop-blur-[1px]" />
                </div>

                {/* Subtle Grain Overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.02]" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay'
                  }} 
                />
              </motion.div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <SlideContent item={item} isActive={currentSlide === index} />
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