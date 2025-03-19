import React from 'react';
import { Link } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';

const Navbar = () => {
  const isAuthenticated = false; // Replace with actual authentication logic

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <PrefetchLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981]">
              Playex
            </span>
          </PrefetchLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <PrefetchLink to="/" className="nav-link">Home</PrefetchLink>
            <PrefetchLink to="/movies" className="nav-link">Movies</PrefetchLink>
            <PrefetchLink to="/tv" className="nav-link">TV Shows</PrefetchLink>
            <PrefetchLink to="/fan-favorites" className="nav-link text-[#E4D981] font-medium">Fan Favorites</PrefetchLink>
            <PrefetchLink to="/actors" className="nav-link">Actors</PrefetchLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Dropdown Menu with key */}
            <DropdownMenu key="main-dropdown" />
          </div>
        </div>
      </div>

      {/* Add styles for nav links */}
      <style jsx>{`
        .nav-link {
          color: #E5E7EB;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .nav-link:hover {
          color: white;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;