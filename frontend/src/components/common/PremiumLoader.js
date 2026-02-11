import React from 'react';
import { motion } from 'framer-motion';

const PremiumLoader = ({ size = 'default', text = 'Loading', overlay = false }) => {
  const getSizeClasses = () => {
    switch(size) {
      case 'small': return 'w-16 h-16';
      case 'large': return 'w-32 h-32';
      default: return 'w-24 h-24';
    }
  };

  return (
    <div className={overlay ? "fixed inset-0 bg-black z-50" : "relative"}>
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute inset-0 bg-grid-pattern opacity-[0.03]"
          animate={{ 
            rotate: [0, 90],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear" 
          }}
        />
      </div>

      <div className="relative h-screen flex flex-col items-center justify-center">
        {/* Logo Animation */}
        <div className={`relative ${getSizeClasses()}`}>
          {/* Orbital Rings */}
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 rounded-full border border-cyan-500/20"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { 
                  duration: 8 - index * 2,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }
              }}
            />
          ))}

          {/* Particle Effects */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-500"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-50px)`
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 1, 0.2],
                filter: [
                  'brightness(1) blur(0px)',
                  'brightness(1.5) blur(2px)',
                  'brightness(1) blur(0px)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Center Core */}
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-90"
            animate={{
              scale: [1, 0.8, 1],
              rotate: [0, 180, 360],
              filter: [
                'hue-rotate(0deg)',
                'hue-rotate(90deg)',
                'hue-rotate(0deg)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm" />
            
            {/* Inner Glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-cyan-500"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>

        {/* Enhanced Text Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 relative"
        >
          <motion.h2
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-indigo-500 tracking-wider"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 200%' }}
          >
            {text}
          </motion.h2>

          {/* Animated Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-500"
                animate={{
                  y: [-2, -8, -2],
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Glowing Line */}
          <motion.div
            className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumLoader;
