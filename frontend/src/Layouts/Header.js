// File: frontend/src/components/layout/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/common/SearchBar';
import DropdownMenu from '../components/navigation/DropdownMenu';
import PrefetchLink from '../components/common/PrefetchLink';  // Update import

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced scroll effect with transparency
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

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

  // Navigation items for mobile menu only
  const navigationItems = [
    { path: '/movies', label: 'Movies' },
    { path: '/tv-shows', label: 'TV Shows' },
    { path: '/fan-favorites', label: 'Fan Favorites' },
    { path: '/trending', label: 'Trending' },
    { path: '/actors', label: 'Actors' },
    { path: '/watchlist', label: 'Watchlist' },
    { path: '/favorites', label: 'Favorites' }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#161616]/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-[#161616] to-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Enhanced Logo with Animation */}
          <PrefetchLink to="/" className="group flex items-center space-x-2">
            <motion.img 
              src="/logo.png" 
              alt="Playex"
              className="h-10 transform group-hover:scale-105 transition-transform duration-300"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#82BC87] to-[#E4D981] bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#E4D981] group-hover:to-[#82BC87]">
              Playex
            </span>
          </PrefetchLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Enhanced SearchBar */}
            <SearchBar />
            <DropdownMenu key={Date.now()} /> {/* Force remount with unique key */}
          </div>

          {/* Mobile Menu Button with Animation */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 }
              }}
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
            </motion.div>
          </motion.button>
        </nav>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-[#161616]/95 backdrop-blur-md"
            >
              <SearchBar isMobile />
              <nav className="flex flex-col space-y-4 mt-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-white hover:text-[#E4D981] transition duration-300 ${
                      location.pathname === item.path ? 'text-[#E4D981]' : ''
                    }`}
                    onClick={handleNavLinkClick}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;