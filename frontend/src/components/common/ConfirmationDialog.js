import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Backdrop with blur effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Dialog Container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl 
                       rounded-2xl overflow-hidden w-full max-w-lg border border-white/10 shadow-2xl"
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full filter blur-[100px] animate-pulse" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-white/5 rounded-full filter blur-[100px] animate-pulse" />
            </div>

            {/* Content Container */}
            <div className="relative">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
              </div>

              {/* Message */}
              <div className="p-6">
                <p className="text-gray-300 text-lg leading-relaxed">{message}</p>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="px-6 py-2.5 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 
                           hover:text-white border border-white/5 transition-all duration-300 backdrop-blur-sm
                           hover:border-white/10"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="relative overflow-hidden px-6 py-2.5 rounded-xl bg-gradient-to-r 
                           from-red-600/90 to-red-700/90 text-white shadow-lg transition-all duration-300
                           hover:shadow-red-600/25 backdrop-blur-sm group"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                              transform -translate-x-full group-hover:translate-x-full transition-transform 
                              duration-1000" />
                  
                  {/* Button content */}
                  <span className="relative flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Confirm
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
