import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SystemAnnouncement = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Check if announcement was previously dismissed in this session
    const isDismissed = sessionStorage.getItem('announcementDismissed');
    if (isDismissed) {
      setShowAnnouncement(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('announcementDismissed', 'true');
    setShowAnnouncement(false);
  };

  return (
    <AnimatePresence>
      {showAnnouncement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#82BC87]/20 via-[#E4D981]/20 to-[#82BC87]/20 animate-gradient-x" />
            <div className="absolute inset-0 backdrop-blur-xl bg-black/80" />

            {/* Content Container */}
            <div className="relative">
              <motion.div
                animate={isMinimized ? { height: "48px" } : { height: "auto" }}
                transition={{ duration: 0.3 }}
                className="container mx-auto px-4"
              >
                <div className="py-4">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]"></span>
                          </span>
                        </div>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[#82BC87] font-medium tracking-wide"
                        >
                          New season release
                        </motion.span>
                      </div>
                      <div className="h-4 w-px bg-gray-700" />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm text-gray-400"
                      >
                        Important Announcement
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 rounded-lg hover:bg-white/5 transition-colors duration-300"
                      >
                        <motion.svg
                          animate={{ rotate: isMinimized ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </motion.svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDismiss}
                        className="p-1 rounded-lg hover:bg-white/5 transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <AnimatePresence>
                    {!isMinimized && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex-1">
                              <p className="text-white mb-2">
                                🎬 <span className="font-medium">A new season of "Wednesday" is available</span>
                              </p>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                Season 2 Part 1 of Wednesday was just released today, the 3rd of September 2025.</p>
                            </div>
                            <div className="flex-shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 bg-gradient-to-r from-[#82BC87] to-[#6da972] rounded-lg 
                                         text-white font-medium shadow-lg shadow-[#82BC87]/20 
                                         hover:shadow-[#82BC87]/30 transition-all duration-300">
                                <a href="/player/tv/119051-wednesday/2/1">
                                Watch Now</a>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemAnnouncement;