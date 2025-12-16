import { useEffect } from 'react';

export const useDevToolsDetection = () => {
  useEffect(() => {
    // Detect DevTools opening using console size
    const detectDevTools = () => {
      const threshold = 160;
      
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        handleDevToolsDetected();
      }
    };

    // Alternative detection method using console object
    const detectDevToolsConsole = () => {
      const consoleTest = () => {};
      consoleTest.toString = () => {
        handleDevToolsDetected();
        return '';
      };
      console.log(consoleTest);
    };

    // Debugger detection
    const detectDebugger = () => {
      const start = performance.now();
      debugger; // eslint-disable-line no-debugger
      const end = performance.now();
      
      if (end - start > 100) {
        handleDevToolsDetected();
      }
    };

    const handleDevToolsDetected = () => {
      // Option 1: Show warning message
      console.warn('🛡️ Developer Tools detected. This is a protected application.');
      
      // Option 2: Block interactions (optional)
      // window.location.href = '/';
      
      // Option 3: Clear console and show custom message
      console.clear();
      console.log(
        '%c⚠️ WARNING',
        'color: red; font-size: 20px; font-weight: bold;'
      );
      console.log(
        '%cDevTools is disabled for this application.',
        'color: #ff4444; font-size: 14px;'
      );
      
      // Option 4: Add visual indicator to page
      if (process.env.NODE_ENV === 'production') {
        document.body.style.opacity = '0.5';
        document.body.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a1a; color: white; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
              <h1>🛡️ Developer Tools Disabled</h1>
              <p>This application is protected against unauthorized access.</p>
              <p>Please close Developer Tools to continue.</p>
            </div>
          </div>
        `;
      }
    };

    // Run detection immediately
    detectDevTools();
    detectDevToolsConsole();

    // Run detection periodically
    const interval = setInterval(() => {
      detectDevTools();
    }, 500);

    // Listen for DevTools open/close events
    window.addEventListener('devtoolschange', () => {
      handleDevToolsDetected();
    });

    return () => {
      clearInterval(interval);
    };
  }, []);
};
