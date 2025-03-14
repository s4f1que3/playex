import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const MovieCarousel = ({ movies }) => {
  return (
    <div className="relative w-full h-full">
      {/* Adjust the overlay gradient for better text visibility on mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10" />
      
      <div className="absolute inset-0">
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className="h-full"
          containerClass="container-with-dots"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024
              },
              items: 1,
              partialVisibilityGutter: 40
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0
              },
              items: 1,
              partialVisibilityGutter: 30
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464
              },
              items: 1,
              partialVisibilityGutter: 30
            }
          }}
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="relative h-full">
              {/* Adjust content positioning for mobile */}
              <div className="absolute inset-0 flex items-end md:items-center z-20 p-4 md:p-8 lg:p-16">
                <div className="w-full md:w-2/3 lg:w-1/2">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                    {movie.title}
                  </h1>
                  {/* Hide overview on very small screens */}
                  <p className="hidden sm:block text-white/90 text-sm md:text-base mb-4">
                    {movie.overview}
                  </p>
                  {/* Adjust button size for mobile */}
                  <Link
                    to={`/movie/${movie.id}`}
                    className="inline-block px-4 md:px-6 py-2 md:py-3 bg-[#82BC87] hover:bg-opacity-80 text-white rounded-lg transition duration-300 text-sm md:text-base"
                  >
                    Watch Now
                  </Link>
                </div>
              </div>
              
              {/* Adjust image handling for mobile */}
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MovieCarousel;