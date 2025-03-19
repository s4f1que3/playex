import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';

const SuccessAnimation = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <div className="relative">
      {/* Center success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Ripple effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 2],
            opacity: [0.5, 0]
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#82BC87]/30"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.8],
            opacity: [0.5, 0]
          }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#82BC87]/30"
        />

        {/* Success checkmark */}
        <div className="bg-[#82BC87] rounded-full p-4 relative">
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Confetti effect */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0,
            opacity: 1
          }}
          animate={{ 
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            scale: Math.random() * 1.5,
            opacity: 0
          }}
          transition={{ 
            duration: 0.8,
            delay: Math.random() * 0.2
          }}
          className={`absolute w-2 h-2 rounded-full ${
            i % 3 === 0 ? 'bg-[#82BC87]' : 
            i % 3 === 1 ? 'bg-[#E4D981]' : 
            'bg-white'
          }`}
        />
      ))}
    </div>
  </div>
);

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
          className="absolute text-[#82BC87]"
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
          <div className="bg-[#82BC87] rounded-full p-4">
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
        <h3 className="text-[#82BC87] font-medium text-lg">Request Submitted!</h3>
        <p className="text-gray-400 mt-2 text-sm">
          We'll review your request and add the show to our collection.
        </p>
      </motion.div>
    </div>
  </div>
);

const RequestForm = () => {
  const [request, setRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Sending request to:', `${api.defaults.baseURL}/api/email/send-request`);
      
      const response = await api.post('/api/email/send-request', { 
        showName: request.trim() 
      });

      console.log('Response received:', response);
      
      if (response.data.success) {
        setShowSuccess(true);
        setRequest('');
        setTimeout(() => setShowSuccess(false), 2500);
      } else {
        throw new Error(response.data.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setError(
        error.response?.data?.error || 
        error.message || 
        'Failed to send request. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-20 mb-12"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#82BC87]/20 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-xl bg-[#82BC87]/10 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Request a TV Show</h2>
              <p className="text-gray-400 mb-8">
                Can't find your favorite show? Let us know and we'll add it to our collection!
              </p>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="Enter the name of the TV show you'd like to see..."
                    className="w-full px-6 py-4 rounded-xl bg-gray-800/50 border border-white/5 
                             text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-[#82BC87]/50 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={!request || isSubmitting}
                    className={`absolute right-2 top-2 px-6 py-2 rounded-lg 
                              ${request ? 'bg-[#82BC87] hover:bg-[#6da972]' : 'bg-gray-700'} 
                              text-white transition-all duration-300 flex items-center gap-2
                              disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {showSuccess && <MailToSuccessAnimation />}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 text-center text-red-400"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RequestForm;
