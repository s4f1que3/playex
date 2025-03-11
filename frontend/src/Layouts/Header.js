// File: frontend/src/components/layout/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/common/SearchBar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#161616] shadow-md' : 'bg-gradient-to-b from-[#161616] to-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Playex" className="h-10" />
            <span className="ml-2 text-2xl font-bold text-[#82BC87]">Playex</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/movies" className="text-white hover:text-[#E4D981] transition duration-300">
              Movies
            </Link>
            <Link to="/tv-shows" className="text-white hover:text-[#E4D981] transition duration-300">
              TV Shows
            </Link>
            <Link to="/trending" className="text-white hover:text-[#E4D981] transition duration-300">
              Trending
            </Link>
            <Link to="/watchlist" className="text-white hover:text-[#E4D981] transition duration-300">
              Watchlist
            </Link>
            <Link to="/favorites" className="text-white hover:text-[#E4D981] transition duration-300">
              Favorites
            </Link>
            <SearchBar />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <SearchBar isMobile />
            <nav className="flex flex-col space-y-4 mt-4">
              <Link 
                to="/movies" 
                className="text-white hover:text-[#E4D981] transition duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                to="/tv-shows" 
                className="text-white hover:text-[#E4D981] transition duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                TV Shows
              </Link>
              <Link 
                to="/trending" 
                className="text-white hover:text-[#E4D981] transition duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trending
              </Link>
              {currentUser ? (
                <>
                  <Link 
                    to="/watchlist" 
                    className="text-white hover:text-[#E4D981] transition duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Watchlist
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="text-white hover:text-[#E4D981] transition duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                </>
              ) : (
                <>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;