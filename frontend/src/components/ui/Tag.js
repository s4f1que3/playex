import React from 'react';

const Tag = ({ children, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${active 
          ? 'bg-cyan-500 text-white' 
          : 'bg-black/20 text-gray-300 hover:bg-black/30'
        }`}
    >
      {children}
    </button>
  );
};

export default Tag;
