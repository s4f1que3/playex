/**
 * Source Code Protection Utility
 * Prevents unauthorized access to source code via DevTools and other methods
 */

export const initializeSourceCodeProtection = () => {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    if (process.env.NODE_ENV === 'production') {
      e.preventDefault();
    }
  });

  // Detect and block common DevTools shortcuts
  document.addEventListener('keydown', (e) => {
    if (process.env.NODE_ENV === 'production') {
      // F12 - DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        showProtectionWarning();
      }
      // Ctrl+Shift+I - DevTools (Windows/Linux)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        showProtectionWarning();
      }
      // Cmd+Option+I - DevTools (Mac)
      if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault();
        showProtectionWarning();
      }
      // Ctrl+Shift+J - Console
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        showProtectionWarning();
      }
      // Cmd+Option+J - Console (Mac)
      if (e.metaKey && e.altKey && e.key === 'j') {
        e.preventDefault();
        showProtectionWarning();
      }
      // Ctrl+Shift+C - Inspector
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        showProtectionWarning();
      }
      // Cmd+Option+C - Inspector (Mac)
      if (e.metaKey && e.altKey && e.key === 'c') {
        e.preventDefault();
        showProtectionWarning();
      }
    }
  });

  // Disable console methods in production
  if (process.env.NODE_ENV === 'production') {
    window.console.log = () => {};
    window.console.warn = () => {};
    window.console.error = () => {};
    window.console.info = () => {};
    window.console.debug = () => {};
  }

  // Detect DevTools by checking console timing
  const checkDevTools = setInterval(() => {
    const start = performance.now();
    console.profile();
    const end = performance.now();
    console.profileEnd();

    if (end - start > 100) {
      if (process.env.NODE_ENV === 'production') {
        clearInterval(checkDevTools);
        showProtectionWarning();
      }
    }
  }, 500);

  // Disable zoom to prevent DevTools detection workaround
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });
};

export const showProtectionWarning = () => {
  const warning = document.getElementById('devtools-warning');
  if (!warning) {
    const div = document.createElement('div');
    div.id = 'devtools-warning';
    div.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      font-family: Arial, sans-serif;
      color: white;
    `;
    div.innerHTML = `
      <div style="text-align: center; padding: 40px; background: rgba(20, 20, 20, 0.95); border-radius: 10px; border: 2px solid #ff4444;">
        <h1 style="color: #ff4444; margin-bottom: 20px; font-size: 28px;">🛡️ Protected Application</h1>
        <p style="font-size: 16px; margin-bottom: 15px;">Developer Tools and unauthorized access are disabled.</p>
        <p style="font-size: 14px; color: #888;">Please close Developer Tools to continue using this application.</p>
      </div>
    `;
    document.body.appendChild(div);
  }
};

export const sanitizeSourceMaps = () => {
  // Remove source maps in production
  if (process.env.NODE_ENV === 'production') {
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
      if (script.src && script.src.includes('.map')) {
        script.remove();
      }
    });
  }
};
