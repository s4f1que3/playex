// File: frontend/src/components/media/MediaCarousel.js
import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MediaCard from '../common/MediaCard';
import { Link } from 'react-router-dom';

const MediaCarousel = ({ title, items, viewAllLink, loading, error }) => {

  // Add padding to Slider settings
  const settings = {
    dots: true,
    infinite: items?.length > 4,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    lazyLoad: 'ondemand',
    arrows: false, // Disable default arrows
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };


  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-gray-800 animate-pulse rounded-lg aspect-[2/3]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
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
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center space-x-4">
          {viewAllLink && (
            <Link to={viewAllLink} className="text-[#E4D981] hover:text-[#82BC87] transition duration-300 text-sm font-medium">
              View All
            </Link>
          )}
        </div>
      </div>
      
      <style jsx="true">{`
        .slick-prev, .slick-next {
          display: none !important;
        }
      `}</style>
      
      <div className="carousel-container">
        <Slider {...settings}>
          {items.map((item) => (
            <div key={item.id} className="px-2">
              <MediaCard media={item} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MediaCarousel;