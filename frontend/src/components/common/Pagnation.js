// File: frontend/src/components/common/Pagination.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageButton = ({ children, active, disabled, onClick }) => (
  <motion.button
    whileHover={!disabled && { scale: 1.05 }}
    whileTap={!disabled && { scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`relative group px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-500
      ${active 
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
        : disabled
          ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
          : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white'
      }`}
  >
    {/* Gradient Hover Effect */}
    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-transparent 
      opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${active ? 'opacity-100' : ''}`} 
    />
    
    {/* Content */}
    <div className="relative flex items-center gap-1">
      {children}
    </div>
  </motion.button>
);

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate range to show around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Show ellipsis if needed before middle pages
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Show ellipsis if needed after middle pages
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-[100px]" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-[100px]" />
      </div>

      {/* Main Container */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 p-4 shadow-2xl">
        <div className="flex items-center justify-center gap-2">
          {/* Previous Page */}
          <PageButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </PageButton>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {pageNumbers.map((page, index) => (
                <motion.div
                  key={`${page}-${index}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {page === '...' ? (
                    <div className="w-8 text-center">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-gray-500 font-medium"
                      >
                        •••
                      </motion.span>
                    </div>
                  ) : (
                    <PageButton
                      active={currentPage === page}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PageButton>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Next Page */}
          <PageButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </PageButton>
        </div>

        {/* Page Info */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1 rounded-full bg-gray-800/50 backdrop-blur-sm text-sm text-gray-400"
          >
            Page {currentPage} of {totalPages}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Pagination;