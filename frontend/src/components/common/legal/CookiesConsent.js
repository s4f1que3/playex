// File: frontend/src/components/common/CookieConsent.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PrefetchLink from '../PrefetchLink';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const location = useLocation();
  
  const allowedPaths = ['/privacy', '/terms'];
  
  useEffect(() => {
    const hasConsented = localStorage.getItem('storageConsent');
    const isAllowedPath = allowedPaths.includes(location.pathname);
    
    if (!hasConsented) {
      setShowConsent(!isAllowedPath);
    }
  }, [location.pathname]);

  // Add useEffect to handle body scrolling
  useEffect(() => {
    if (showConsent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConsent]);
  
  const handleAccept = () => {
    localStorage.setItem('storageConsent', 'true');
    setShowConsent(false);
  };
  
  const handleLearnMore = (e) => {
    const linkPath = e.currentTarget.getAttribute('href');
    if (allowedPaths.includes(linkPath)) {
      setShowConsent(false);
    }
  };
  
  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 backdrop-blur-sm overflow-y-auto touch-none"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowConsent(false)}
          />

          {/* Consent Dialog - Make it scrollable on mobile */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="relative w-full max-w-2xl my-4 sm:my-8 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-y-auto">
              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#82BC87]/20 rounded-full filter blur-[100px]" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#E4D981]/20 rounded-full filter blur-[100px]" />
              </div>

              {/* Make content area scrollable */}
              <div className="relative flex flex-col h-full max-h-[calc(90vh-8rem)]">
                {/* Header - Fixed */}
                <div className="relative p-6 border-b border-white/10 flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Your Privacy Choices</h3>
                      <p className="text-gray-400 text-sm">Manage your cookie preferences</p>
                    </div>
                  </div>
                </div>

                {/* Content - Scrollable */}
                <div className="relative p-6 space-y-6 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed">
                    We use cookies and local storage to enhance your experience and deliver personalized content. This includes:
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v11h-4v4H7V3z" />,
                        title: "Preferences",
                        desc: "Save your watchlist and favorites"
                      },
                      {
                        icon: <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" />,
                        title: "Personalization",
                        desc: "Remember your viewing history"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#82BC87]/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                              {item.icon}
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{item.title}</h4>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-sm text-gray-400">
                    By continuing, you agree to our{' '}
                    <PrefetchLink to="/privacy" onClick={handleLearnMore} className="text-[#82BC87] hover:text-[#E4D981] transition-colors duration-300">
                      Privacy Policy
                    </PrefetchLink>
                    {' '}and{' '}
                    <PrefetchLink to="/terms" onClick={handleLearnMore} className="text-[#82BC87] hover:text-[#E4D981] transition-colors duration-300">
                      Terms of Service
                    </PrefetchLink>
                  </div>
                </div>

                {/* Actions - Fixed */}
                <div className="relative p-6 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row-reverse gap-3 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAccept}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white font-medium 
                             hover:shadow-lg hover:shadow-[#82BC87]/20 transition-all duration-300"
                  >
                    Accept All Cookies
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowConsent(false)}
                    className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium 
                             hover:bg-white/10 transition-all duration-300"
                  >
                    Accept Essential Only
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;