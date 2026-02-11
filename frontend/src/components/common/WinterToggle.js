import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WINTER_THEME_ENABLED } from '../../config/winterTheme';

const WinterToggle = () => {
  const [isWinterEnabled, setIsWinterEnabled] = useState(() => {
    const saved = localStorage.getItem('winterTheme');
    return saved !== null ? saved === 'true' : true; // Default to enabled
  });

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    localStorage.setItem('winterTheme', isWinterEnabled.toString());
    // Dispatch event so WinterTheme component can listen
    window.dispatchEvent(new CustomEvent('winterThemeToggle', { detail: isWinterEnabled }));
  }, [isWinterEnabled]);

  // Hide toggle if master switch is off
  if (!WINTER_THEME_ENABLED) return null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsWinterEnabled(!isWinterEnabled)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-xl group"
        aria-label="Toggle winter theme"
      >
        <motion.div
          animate={{ rotate: isWinterEnabled ? 0 : 180 }}
          transition={{ duration: 0.5 }}
        >
          {isWinterEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-200 group-hover:text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </motion.div>

        {/* Glow effect when enabled */}
        {isWinterEnabled && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-blue-400/20 blur-lg -z-10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-sm text-white shadow-xl"
          >
            {isWinterEnabled ? 'Disable Winter Theme' : 'Enable Winter Theme'}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/10 rotate-45 -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WinterToggle;
