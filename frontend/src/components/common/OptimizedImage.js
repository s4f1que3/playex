// Optimized Image Component with lazy loading, blur placeholder, and WebP support
import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = '2/3',
  priority = false, // For above-the-fold images
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Lazy load images when they come into view
  useIntersectionObserver(imgRef, (entry) => {
    if (entry.isIntersecting && !isInView) {
      setIsInView(true);
    }
  }, { rootMargin: '50px' }); // Start loading 50px before entering viewport

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
  };

  // Placeholder image - ultra-light gradient
  const placeholderStyle = {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Blur placeholder */}
      {!isLoaded && !error && (
        <div
          className="absolute inset-0 animate-pulse"
          style={placeholderStyle}
        />
      )}

      {/* Actual image */}
      {(isInView || priority) && !error && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes={sizes}
          {...props}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"
        >
          <div className="text-center text-gray-400 p-4">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">No Image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedImage);
