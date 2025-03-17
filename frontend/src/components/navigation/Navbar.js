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
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981]">
              Playex
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/movies" className="nav-link">Movies</Link>
            <Link to="/tv" className="nav-link">TV Shows</Link>
            <Link to="/fan-favorites" className="nav-link text-[#E4D981] font-medium">Fan Favorites</Link>
            <Link to="/actors" className="nav-link">Actors</Link>
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

            {/* Login/Profile Button */}
            {isAuthenticated ? (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#82BC87]/10 hover:bg-[#82BC87]/20 text-[#82BC87] border border-[#82BC87]/20 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#82BC87]/10 hover:bg-[#82BC87]/20 text-[#82BC87] border border-[#82BC87]/20 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </Link>
            )}
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