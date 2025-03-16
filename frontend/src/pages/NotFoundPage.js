// File: frontend/src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0] 
          }} 
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-5"
        >
          <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150" />
        </motion.div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#82BC87]/20 rounded-full filter blur-[100px]"
        />
        <motion.div
          animate={{ 
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E4D981]/20 rounded-full filter blur-[120px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="relative inline-block mb-8"
          >
            <div className="text-[12rem] font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] filter drop-shadow-glow">
              404
            </div>
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-[#82BC87]/20 to-[#E4D981]/20 filter blur-3xl"
            />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-12 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Lost in the Stream
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The content you're looking for has drifted into another dimension. 
              Don't worry though – there's plenty more to discover!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-[#82BC87] to-[#6da972] text-white font-medium 
                         hover:shadow-lg hover:shadow-[#82BC87]/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                             transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <motion.span
                className="relative flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Return Home
              </motion.span>
            </Link>

            <Link
              to="/movies"
              className="group relative overflow-hidden px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 
                         text-white font-medium border border-white/10 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                             transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <motion.span
                className="relative flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2H5V9zm-1 4h1v2H4v-2z" />
                </svg>
                Explore Content
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Grid Pattern Style */}
      <style jsx>{`
        .bg-pattern-grid {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .drop-shadow-glow {
          filter: drop-shadow(0 0 10px rgba(130,188,135,0.3))
                 drop-shadow(0 0 20px rgba(228,217,129,0.2));
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;