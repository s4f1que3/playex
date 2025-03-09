// File: frontend/src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="text-[#E4D981] mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className="text-5xl font-bold text-white">404</h1>
      <h2 className="text-2xl font-semibold text-white mt-2 mb-4">Page Not Found</h2>
      
      <p className="text-gray-400 mb-8 max-w-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="space-x-4">
        <Link to="/" className="btn-primary">
          Go to Homepage
        </Link>
        
        <Link to="/movies" className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition duration-300">
          Browse Movies
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;