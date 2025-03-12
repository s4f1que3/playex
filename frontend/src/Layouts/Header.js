// File: frontend/src/components/layout/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/common/SearchBar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const timeoutRef = useRef(null);
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

  // Close desktop menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDesktopMenuOpen(false);
  };

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDesktopMenuOpen(true);
  };

  const handleMenuMouseLeave = () => {
    // Add a small delay before closing the menu for smoother experience
    timeoutRef.current = setTimeout(() => {
      setIsDesktopMenuOpen(false);
    }, 150);
  };

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
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Bar first */}
            <SearchBar />
            
            {/* Desktop Menu Toggle Button - With smooth hover */}
            <div 
              className="relative" 
              ref={desktopMenuRef}
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMenuMouseLeave}
            >
              <button
                className={`text-white hover:text-[#E4D981] transition-all duration-300 p-2 rounded-full hover:bg-[#1F1F1F] ${isDesktopMenuOpen ? 'bg-[#1F1F1F] text-[#E4D981]' : ''}`}
                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                aria-label="Menu"
              >
                {isDesktopMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              
              {/* Desktop Dropdown Menu with smooth transitions */}
              <div 
                className={`absolute right-0 mt-2 w-56 bg-[#1F1F1F] rounded-lg shadow-lg overflow-hidden border border-gray-800 transition-all duration-300 origin-top-right transform ${
                  isDesktopMenuOpen 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <div className="py-2">
                  <Link 
                    to="/movies" 
                    className="block px-4 py-3 text-white hover:bg-[#2D2D2D] hover:text-[#E4D981] transition-all duration-200"
                    onClick={handleNavLinkClick}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                      </svg>
                      Movies
                    </div>
                  </Link>
                  <Link 
                    to="/tv-shows" 
                    className="block px-4 py-3 text-white hover:bg-[#2D2D2D] hover:text-[#E4D981] transition-all duration-200"
                    onClick={handleNavLinkClick}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      TV Shows
                    </div>
                  </Link>
                  <Link 
                    to="/trending" 
                    className="block px-4 py-3 text-white hover:bg-[#2D2D2D] hover:text-[#E4D981] transition-all duration-200"
                    onClick={handleNavLinkClick}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Trending
                    </div>
                  </Link>
                  <Link 
                    to="/actors" 
                    className="block px-4 py-3 text-white hover:bg-[#2D2D2D] hover:text-[#E4D981] transition-all duration-200"
                    onClick={handleNavLinkClick}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Actors
                    </div>
                  </Link>
                  
                  <div className="border-t border-gray-700 my-2"></div>
                  
                  <Link 
                    to="/watchlist" 
                    className="block px-4 py-3 text-white hover:bg-[#2D2D2D] hover:text-[#E4D981] transition-all duration-200"
                    onClick={handleNavLinkClick}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Watchlist
                    </div>
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="block px-4 py-3 text-white hover:bg-[#2D2D2D] hover:text-[#E4D981] transition-all duration-200"
                    onClick={handleNavLinkClick}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Favorites
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

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
                onClick={handleNavLinkClick}
              >
                Movies
              </Link>
              <Link 
                to="/tv-shows" 
                className="text-white hover:text-[#E4D981] transition duration-300"
                onClick={handleNavLinkClick}
              >
                TV Shows
              </Link>
              <Link 
                to="/trending" 
                className="text-white hover:text-[#E4D981] transition duration-300"
                onClick={handleNavLinkClick}
              >
                Trending
              </Link>
              <Link 
                to="/actors" 
                className="text-white hover:text-[#E4D981] transition duration-300"
                onClick={handleNavLinkClick}
              >
                Actors
              </Link>
              <Link 
                to="/watchlist" 
                className="text-white hover:text-[#E4D981] transition duration-300"
                onClick={handleNavLinkClick}
              >
                Watchlist
              </Link>
              <Link 
                to="/favorites" 
                className="text-white hover:text-[#E4D981] transition duration-300"
                onClick={handleNavLinkClick}
              >
                Favorites
              </Link>                                        
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;