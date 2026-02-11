// File: frontend/src/components/common/NewDomain.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeNotice = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('domainNoticeAccepted');
    if(!hasConsented) 
    {
      setShowConsent(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('domainNoticeAccepted', 'true');
    setShowConsent(false);
  };

  
  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm overflow-y-auto touch-none"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70"
            onClick={() => setShowConsent(false)}
          />

          {/* Consent Dialog */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="relative w-full max-w-2xl my-4 sm:my-6 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-y-auto">
              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-72 h-72 bg-cyan-500/20 rounded-full filter blur-[120px]" />
                <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-indigo-500/20 rounded-full filter blur-[120px]" />
              </div>

              <div className="relative flex flex-col h-full max-h-[calc(90vh-3rem)]">
                {/* Header */}
                <div className="relative p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Welcome to Playex!</h3>
                      <p className="text-gray-400">Important updates and recommendations</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-8 space-y-8 overflow-y-auto">
                  {/* Domain Change Notice */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-indigo-400">Domain Update</h4>
                    <p className="text-gray-300">
                      We've moved from "playex.vercel.app" to "playex.cc" for an improved experience.
                      This change might affect your saved preferences and viewing history.
                    </p>
                  </div>

                  {/* Ad Blocker Notice */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-indigo-400">Enhanced Viewing Experience</h4>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white font-medium mb-2">Recommended Ad Blockers</h5>
                          <p className="text-gray-400 text-sm mb-4">
                            For the best viewing experience, we strongly recommend using our suggested ad blockers. 
                            These tools will help eliminate intrusive ads from third-party media players.
                          </p>
                          <Link
                            to="/AdBlockers"
                            onClick={() => setShowConsent(false)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 transition-all duration-300"
                          >
                            <span>View Recommended Ad Blockers</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative p-6 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAccept}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium 
                             hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                  >
                    Got it, continue to site
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

export default WelcomeNotice;