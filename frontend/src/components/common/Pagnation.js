// File: frontend/src/components/common/Pagination.js
import React from 'react';

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
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className={`flex justify-center items-center space-x-2 my-6 ${className}`}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-gray-800 text-white hover:bg-[#82BC87] transition duration-300'
        }`}
      >
        &laquo;
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-[#82BC87] text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700 transition duration-300'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-gray-800 text-white hover:bg-[#82BC87] transition duration-300'
        }`}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;