// File: frontend/src/components/layout/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/common/SearchBar';
import DropdownMenu from '../components/navigation/DropdownMenu';
import PrefetchLink from '../components/common/PrefetchLink';  // Update import
import HeaderAccountMenu from '../components/navigation/HeaderAccountMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

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
          <PrefetchLink to="/" className="group flex items-center space-x-2 min-w-[100px] mr-2">
            <motion.img 
              src="/logo.png" 
              alt="Playex"
              className="h-8 md:h-10 transform group-hover:scale-105 transition-transform duration-300"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#82BC87] to-[#E4D981] bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#E4D981] group-hover:to-[#82BC87]">
              Playex
            </span>
          </PrefetchLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Enhanced SearchBar */}
            <SearchBar />
            <DropdownMenu key={Date.now()} /> {/* Force remount with unique key */}
            <HeaderAccountMenu />
          </div>

          {/* Mobile Menu Button with Animation */}
          <div className="md:hidden flex items-center">
            <div className="flex-grow flex items-center justify-end gap-2">
              <div className="w-full max-w-[202px]">
                <SearchBar isMobile />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-white p-1"
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </motion.div>
              </motion.button>
              <HeaderAccountMenu />
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Now using the same items as DropdownMenu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-[#161616]/95 backdrop-blur-md pb-4 mt-1"
            >
              <div className="py-3">
                <div className="space-y-1">
                  {/* Quick Actions Section */}
                  <div className="mb-4">
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-400">Quick Actions</p>
                    </div>
                    <Link
                      to="/"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#82BC87] bg-[#82BC87]/10"
                      onClick={handleNavLinkClick}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">Home</span>
                    </Link>
                  </div>

                  {/* Featured Section */}
                  <div className="mb-4">
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-400">Featured</p>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/fan-favorites"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#E4D981] bg-[#E4D981]/10"
                        onClick={handleNavLinkClick}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        <span className="font-medium">Fan Favorites</span>
                      </Link>
                      
                    </div>
                  </div>

                  {/* Main Navigation Section */}
                  <div className="mb-4">
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-400">Navigation</p>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/movies"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#9B89B3]"
                        onClick={handleNavLinkClick}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                        </svg>
                        <span className="font-medium">Movies</span>
                      </Link>
                      <Link
                        to="/tv-shows"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#89B3B0]"
                        onClick={handleNavLinkClick}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">TV Shows</span>
                      </Link>
                      <Link
                        to="/trending"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#B389A1]"
                        onClick={handleNavLinkClick}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-medium">Trending</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;