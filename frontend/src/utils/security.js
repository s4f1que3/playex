export const disableDevTools = () => {
  // Disable right click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Disable keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Prevent F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+U
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
  });

  // Additional protection against devtools
  const intervalId = setInterval(() => {
    const devtools = /./;
    devtools.toString = function() {
      clearInterval(intervalId);
      return '';
    }
  }, 100);

  // Disable console output
  if (!process.env.NODE_ENV?.includes('development')) {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
  }
};
