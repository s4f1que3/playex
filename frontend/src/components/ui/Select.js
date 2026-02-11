import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const Select = ({ value, onChange, options, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);
  const buttonRef = useRef(null);
  const selectedOption = options.find(opt => opt.id === value);

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect({
        top: rect.top + rect.height + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
        className="w-full flex items-center justify-between bg-black/40 backdrop-blur-xl text-white border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none hover:border-cyan-500/50 transition-all text-sm group"
      >
        <span className="text-gray-200 font-medium">{selectedOption?.name}</span>
        <motion.svg 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {isOpen && buttonRect && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", bounce: 0.25 }}
            style={{
              position: 'absolute',
              top: buttonRect?.top + 'px',
              left: buttonRect?.left + 'px',
              width: buttonRect?.width + 'px',
            }}
            className="fixed z-[1000] mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg shadow-black/50 py-1 overflow-hidden"
          >
            {options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ backgroundColor: "rgba(130, 188, 135, 0.1)" }}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                  ${option.id === value 
                    ? 'text-cyan-400 bg-cyan-500/10' 
                    : 'text-gray-300 hover:text-white'}`}
              >
                {option.name}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Select;
