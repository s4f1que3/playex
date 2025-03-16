import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertDialog = ({ isOpen, title = 'Alert', message, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Enhanced Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 backdrop-blur-lg"
          style={{
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)'
          }}
        />

        {/* Dialog Container */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-sm"
        >
          {/* Glass Card - Adjusted top margin for icon */}
          <div className="relative overflow-hidden mt-12"> {/* Changed from no margin to mt-12 */}
            {/* Top Accent Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600" />

            {/* Main Content */}
            <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-b-2xl border border-white/10">
              {/* Icon Container - Adjusted positioning */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2"> {/* Changed from -top-8 to -top-10 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-red-500 p-0.5" // Increased size from w-16/h-16 to w-20/h-20
                >
                  <div className="w-full h-full rounded-2xl bg-black/90 flex items-center justify-center">
                    <svg className="w-10 h-10 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"> {/* Increased icon size */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* Content - Adjusted top padding */}
              <div className="pt-16 p-6"> {/* Changed from pt-12 to pt-16 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center space-y-4"
                >
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="text-gray-400">{message}</p>
                </motion.div>

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500/80 to-red-500/80 
                           text-white font-medium shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 
                           transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    <span>Got It</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-16 h-16 opacity-30">
              <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="0.5">
                <path d="M0 100V0h100" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 opacity-30 rotate-180">
              <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="0.5">
                <path d="M0 100V0h100" />
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertDialog;

