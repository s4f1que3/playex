import React from 'react';
import { motion } from 'framer-motion';

const PremiumLoader = ({ size = 'default', text = 'Loading', overlay = false }) => {
  const containerClasses = overlay 
    ? "fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center"
    : "flex items-center justify-center";

  const getSizeClasses = () => {
    switch(size) {
      case 'small':
        return 'w-16 h-16';
      case 'large':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/4 w-96 h-96 bg-[#82BC87]/20 rounded-full filter blur-[100px] animate-pulse" />
          <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-[#E4D981]/20 rounded-full filter blur-[100px] animate-pulse" />
        </div>

        <div className="relative flex flex-col items-center">
          {/* Main Loader */}
          <div className={`relative ${getSizeClasses()}`}>
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#82BC87]/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />

            {/* Middle Ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-[#82BC87]/40"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            />

            {/* Inner Ring with Gradient */}
            <motion.div
              className="absolute inset-4 rounded-full bg-gradient-to-r from-[#82BC87] to-[#E4D981]"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-sm" />
            </motion.div>

            {/* Center Dot */}
            <motion.div
              className="absolute inset-[45%] rounded-full bg-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <div className="text-xl text-white font-medium tracking-wide">
              {text}
            </div>
            <motion.div
              className="flex items-center justify-center gap-1 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#82BC87]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;
