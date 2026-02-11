import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GenreDropdown = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const genres = {
    Featured: [
      { id: 'all', name: 'All', icon: '🎬' },
    ],
    Genres: [ 
      { id: 'action', name: 'Action', icon: '💥' },
      { id: 'superhero', name: 'Superhero', icon: '🦹'},
      { id: 'adventure', name: 'Adventure', icon: '🗺️' },
      { id: 'animation', name: 'Animation', icon: '🎨' },
      { id: 'comedy', name: 'Comedy', icon: '😄' },
      { id: 'crime', name: 'Crime', icon: '🚔' },
      { id: 'drama', name: 'Drama', icon: '🎭' },
      { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
      { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️' },
      { id: 'horror', name: 'Horror', icon: '👻' },
      { id: 'romance', name: 'Romance', icon: '💕' },
      { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
      { id: 'thriller', name: 'Thriller', icon: '😱' },
    ]
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSelection = Object.values(genres)
    .flat()
    .find(item => item.id === value) || genres.Featured[0];

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-black/30 border border-white/10 text-white
          hover:bg-black/40 transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          min-w-[200px] justify-between
        `}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{currentSelection.icon}</span>
          <span className="text-sm font-medium">{currentSelection.name}</span>
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[100] w-[280px] mt-2 origin-top-right rounded-xl shadow-lg bg-gray-900/95 backdrop-blur-xl border border-white/10"
            style={{ 
              filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3))',
              willChange: 'transform, opacity'
            }}
          >
            <div className="py-2">
              {Object.entries(genres).map(([category, items]) => (
                <div key={category} className="px-2">
                  <p className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {category}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onChange(item.id);
                          setIsOpen(false);
                        }}
                        className={`
                          text-left px-3 py-2 rounded-lg flex items-center gap-2
                          hover:bg-white/5 transition-colors duration-200
                          ${value === item.id ? 'bg-white/10 text-cyan-400' : 'text-white'}
                        `}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenreDropdown;
