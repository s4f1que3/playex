// File: frontend/src/components/layout/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/common/SearchBar';
import DropdownMenu from '../components/navigation/DropdownMenu';
import NavigationDropdown from '../components/navigation/NavigationDropdown';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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
          <Link to="/" className="group flex items-center space-x-2">
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Enhanced SearchBar */}
            <SearchBar />
            <DropdownMenu key={Date.now()} /> {/* Force remount with unique key */}
          </div>

          {/* Mobile Navigation - Replace old mobile menu with NavigationDropdown */}
          <div className="md:hidden flex items-center gap-3">
            <SearchBar isMobile />
            <NavigationDropdown />
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;