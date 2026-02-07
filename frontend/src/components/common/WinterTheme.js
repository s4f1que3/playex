import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  WINTER_THEME_ENABLED, 
  SNOWFLAKE_COUNT, 
  ICICLE_COUNT, 
  LARGE_SNOW_COUNT, 
  SPARKLE_COUNT,
  MIN_SNOW_DURATION,
  MAX_SNOW_DURATION,
  MIN_SNOW_SIZE,
  MAX_SNOW_SIZE
} from '../../config/winterTheme';

const WinterTheme = () => {
  const [snowflakes, setSnowflakes] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('winterTheme');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    // Listen for theme toggle
    const handleToggle = (e) => {
      setIsEnabled(e.detail);
    };

    window.addEventListener('winterThemeToggle', handleToggle);
    return () => window.removeEventListener('winterThemeToggle', handleToggle);
  }, []);

  useEffect(() => {
    if (!isEnabled || !WINTER_THEME_ENABLED) return;

    // Generate snowflakes
    const generateSnowflakes = () => {
      const flakes = [];
      
      for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
        flakes.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: MIN_SNOW_DURATION + Math.random() * (MAX_SNOW_DURATION - MIN_SNOW_DURATION),
          opacity: 0.3 + Math.random() * 0.7,
          size: MIN_SNOW_SIZE + Math.random() * (MAX_SNOW_SIZE - MIN_SNOW_SIZE),
          delay: Math.random() * 5,
          drift: -20 + Math.random() * 40,
        });
      }
      
      setSnowflakes(flakes);
    };

    // Generate sparkles - pre-calculate positions for better performance
    const generateSparkles = () => {
      const sparks = [];
      for (let i = 0; i < SPARKLE_COUNT; i++) {
        sparks.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 3,
        });
      }
      setSparkles(sparks);
    };

    generateSnowflakes();
    generateSparkles();
  }, [isEnabled]);

  if (!isEnabled || !WINTER_THEME_ENABLED) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Snowflakes - optimized with will-change */}
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            top: '-20px',
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            filter: 'blur(0.5px)',
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)',
            willChange: 'transform',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, flake.drift, 0, -flake.drift, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: flake.animationDuration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Icicles - Top of screen */}
      <div className="absolute top-0 left-0 right-0 flex justify-around">
        {[...Array(ICICLE_COUNT)].map((_, i) => (
          <motion.div
            key={`icicle-${i}`}
            className="relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              width: '2px',
              filter: 'drop-shadow(0 0 2px rgba(130, 188, 135, 0.3))',
            }}
          >
            {/* Icicle shape */}
            <div
              className="bg-gradient-to-b from-white/80 via-blue-100/60 to-transparent"
              style={{
                height: `${20 + Math.random() * 40}px`,
                clipPath: 'polygon(50% 0%, 0% 0%, 50% 100%)',
                width: '8px',
                marginLeft: '-3px',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Frost Overlay - Corners */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-transparent via-blue-100/5 to-blue-200/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-transparent via-blue-100/5 to-blue-200/10 blur-3xl pointer-events-none" />
      
      {/* Bottom frost */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100/5 to-transparent pointer-events-none" />

      {/* Floating Snowflakes (larger, decorative) - optimized */}
      {[...Array(LARGE_SNOW_COUNT)].map((_, i) => (
        <motion.div
          key={`large-snow-${i}`}
          className="absolute text-3xl"
          style={{
            left: `${15 + i * 20}%`,
            top: `${20 + (i % 3) * 20}%`,
            opacity: 0.08,
            willChange: 'transform',
          }}
          animate={{
            y: [0, 15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ❄️
        </motion.div>
      ))}

      {/* Sparkles - pre-generated positions for better performance */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={`sparkle-${sparkle.id}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
            willChange: 'opacity, transform',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default WinterTheme;
