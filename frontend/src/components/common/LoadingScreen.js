// File: frontend/src/components/common/LoadingScreen.js
import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ finishLoading }) => {
  const [showLoader, setShowLoader] = useState(true);
  
  useEffect(() => {
    // Allow some time for the animation to play
    const timer = setTimeout(() => {
      setShowLoader(false);
      setTimeout(() => {
        if (finishLoading) finishLoading();
      }, 500); // Wait for fade-out animation to complete
    }, 2500); // Total animation duration
    
    return () => clearTimeout(timer);
  }, [finishLoading]);
  
  return (
    <div 
      className={`fixed inset-0 bg-black z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        showLoader ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Logo container with animation */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <img src="/logo.png" alt="Playex" className="h-24 animate-bounce-slow" />
        </div>
        
        {/* Circular loader */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-800"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
            />
            <circle
              className="text-[#82BC87] animate-loaderSpin origin-center"
              strokeWidth="4"
              strokeDasharray="276"
              strokeDashoffset="20"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
            />
          </svg>
        </div>
        
        {/* Text */}
        <div className="absolute bottom-0 left-0 right-0 text-center" style={{bottom: '-20px'}}>
          <h1 className="text-3xl font-bold text-[#82BC87] mb-2 animate-fadeIn" style={{transform: 'translateY(-15px)'}}>
            Playex
          </h1>
          <p className="text-white text-opacity-70 animate-fadeIn animation-delay-300" style={{marginBottom: '25px'}}>
            Your Ultimate Streaming Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;