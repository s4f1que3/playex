import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';

const MailToSuccessAnimation = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 p-8 max-w-md w-full mx-4">
      <div className="relative h-32 flex items-center justify-center">
        {/* Flying Mail Icon */}
        <motion.div
          initial={{ scale: 1, y: 0 }}
          animate={{
            scale: [1, 1.2, 1, 0],
            y: [0, -20, -60, -100],
            opacity: [1, 1, 0.5, 0]
          }}
          transition={{ duration: 1 }}
          className="absolute text-cyan-500"
        >
          <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </motion.div>

        {/* Success Checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute"
        >
          <div className="bg-cyan-500 rounded-full p-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-6"
      >
        <h3 className="text-cyan-500 font-medium text-lg">Message Sent!</h3>
        <p className="text-gray-400 mt-2 text-sm">
          We'll get back to you as soon as possible.
        </p>
      </motion.div>
    </div>
  </div>
);

export const ContactFormModal = ({ isOpen, onClose, subject = "" }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/api/email/send-contact', { 
        subject,
        message: message.trim() 
      });

      setShowSuccess(true);
      setMessage('');
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2500);
    } catch (error) {
      setError(error?.response?.data?.error || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg m-4 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-[100px]" />
            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[120px]" />
          </div>

          <div className="p-8 relative">
            {/* Logo Tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
                <img src="/logo.png" alt="Playex" className="h-6 w-6" />
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                  Playex
                </span>
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
            </motion.div>

            {/* Close Button with animation */}
            <motion.button
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Header Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                Get in Touch
              </h2>
              {subject && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span className="text-cyan-500">{subject}</span>
                </motion.div>
              )}
              <p className="text-gray-400 mt-4">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  className="w-full h-40 px-6 py-4 rounded-xl bg-gray-800/50 border border-white/5 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 resize-none"
                  required
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gray-900/50 border border-white/10 text-xs text-gray-400">
                  Press Enter to start a new line
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={!message || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 
                         hover:from-[#75b07a] hover:to-[#619665]
                         text-white font-medium transition-all duration-300 
                         flex items-center justify-center gap-3 relative overflow-hidden group
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-lg">Send Message</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </motion.div>
                  </>
                )}
              </motion.button>
            </form>

            {/* Success and Error Animations */}
            <AnimatePresence>
              {showSuccess && <MailToSuccessAnimation />}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-center px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactFormModal;
