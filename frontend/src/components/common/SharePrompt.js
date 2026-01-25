import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SharePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem('playex_share_prompt_seen');
    if (!hasSeenPrompt) {
      setShowPrompt(true);
    }
  }, []);

  // Manage body scroll
  useEffect(() => {
    if (showPrompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPrompt]);

  const handleCopyLink = async () => {
    try {
      setSending(true);
      const siteUrl = 'https://playex.cc';
      await navigator.clipboard.writeText(siteUrl);

      // Show copy feedback
      setCopied(true);

      // Send email notification
      try {
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        await fetch(`${apiBaseUrl}/api/shares/share-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sharedUrl: siteUrl,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Failed to send email:', error);
      }

      setSending(false);

      // Close modal after showing feedback
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to copy link:', error);
      setSending(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem('playex_share_prompt_seen', 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={handleClose}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="relative w-full max-w-md bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl border border-[#82BC87]/20 shadow-2xl overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#82BC87]/20 rounded-full filter blur-[100px]" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#E4D981]/20 rounded-full filter blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-[#82BC87]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Share Playex</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Spread the joy of entertainment
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Love discovering amazing shows and movies? Share Playex with your friends and let them join the fun! It takes just one click.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  onClick={handleCopyLink}
                  disabled={sending}
                  whileHover={{ scale: !sending ? 1.02 : 1 }}
                  whileTap={{ scale: !sending ? 0.98 : 1 }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-green-600 text-white'
                      : sending
                      ? 'bg-gray-600 text-white opacity-75 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#82BC87] to-[#E4D981] hover:from-[#7ab07a] hover:to-[#d4c978] text-[#1a1a1a]'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : sending ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy Link & Share
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={handleClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 rounded-lg font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                >
                  Maybe Later
                </motion.button>
              </div>

              {/* Footer */}
              <p className="text-xs text-center text-gray-500">
                The link will be copied to your clipboard and we'll be notified
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SharePrompt;
