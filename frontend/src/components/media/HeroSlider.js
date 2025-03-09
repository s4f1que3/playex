// File: frontend/src/components/media/HeroSlider.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { tmdbHelpers } from '../../utils/api';
import { useWatchProgress } from '../../hooks/useWatchProgress';

const HeroSlider = ({ items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { getMediaProgress } = useWatchProgress();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    beforeChange: (_, next) => setCurrentSlide(next),
    customPaging: (i) => (
      <div
        className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
          i === currentSlide ? 'bg-[#82BC87]' : 'bg-gray-500'
        }`}
      />
    ),
    dotsClass: 'slick-dots custom-dots',
  };
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className="relative z-10">
      <Slider {...settings}>
        {items.map((item) => {
          const { 
            id, 
            backdrop_path, 
            title, 
            name, 
            overview, 
            release_date, 
            first_air_date, 
            media_type 
          } = item;
          
          const mediaType = media_type || (title ? 'movie' : 'tv');
          const releaseYear = release_date || first_air_date 
            ? new Date(release_date || first_air_date).getFullYear() 
            : '';
            
          // Get watch progress for continue watching button
          const progress = getMediaProgress(id, mediaType);
          const hasStarted = progress && progress.watched > 0;
          
          return (
            <div key={id} className="relative">
              {/* Backdrop image */}
              <div className="aspect-[21/9] relative overflow-hidden">
                <img
                  src={tmdbHelpers.getImageUrl(backdrop_path, 'original') || 'https://via.placeholder.com/1920x800?text=No+Image'}
                  alt={title || name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#161616] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent"></div>
              </div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-lg">
                    <span className="inline-block bg-[#E6C6BB] text-[#161616] px-2 py-1 rounded text-sm mb-4">
                      {mediaType === 'movie' ? 'Movie' : 'TV Series'} • {releaseYear}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title || name}</h1>
                    <p className="text-gray-300 mb-6 line-clamp-3">{overview}</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/${mediaType}/${id}`}
                        className="btn-primary"
                      >
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          More Info
                        </span>
                      </Link>
                      {hasStarted && (
                        <Link
                          to={mediaType === 'movie' ? `/player/movie/${id}` : `/tv/${id}`}
                          className="btn-secondary"
                        >
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Continue Watching
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
      
      {/* Custom Styling for Dots */}
      <style jsx="true">{`
        .custom-dots {
          position: absolute;
          bottom: 20px;
          display: flex !important;
          justify-content: center;
          width: 100%;
        }
        .slick-slider {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;