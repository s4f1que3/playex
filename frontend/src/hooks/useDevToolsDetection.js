import { useEffect } from 'react';

export const useDevToolsDetection = () => {
  useEffect(() => {
    // Only enable dev tools detection in production AND on desktop devices
    if (process.env.NODE_ENV !== 'production') {
      return; // Skip detection in development
    }

    // Detect if user is on mobile device
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    if (isMobileDevice()) {
      return; // Skip detection on mobile devices
    }

    // Detect DevTools opening using console size (desktop only, with higher threshold)
    const detectDevTools = () => {
      const threshold = 300; // Increased threshold to avoid false positives
      
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        handleDevToolsDetected();
      }
    };

    const handleDevToolsDetected = () => {
      // Only warn in console, don't block the site
      console.warn('🛡️ Developer Tools detected. This is a protected application.');
    };

    // Run detection periodically (less frequently)
    const interval = setInterval(() => {
      detectDevTools();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);
};
