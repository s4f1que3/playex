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

  // Additional protection against devtools with safety check
  try {
    const intervalId = setInterval(() => {
      const devtools = /./;
      if (devtools) {
        devtools.toString = function() {
          try {
            clearInterval(intervalId);
          } catch (e) {}
          return '';
        }
      }
    }, 100);
  } catch (e) {}

  // Disable console with safety check
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'development') {
    try {
      console.log = () => {};
      console.error = () => {};
      console.warn = () => {};
      console.info = () => {};
    } catch (e) {}
  }
};

export const disableSourceMaps = () => {
  if (typeof window !== 'undefined' && typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
    try {
      // Remove source map data safely
      if ('webpackHotUpdate' in window) {
        delete window.webpackHotUpdate;
      }
      if ('__REACT_DEVTOOLS_GLOBAL_HOOK__' in window) {
        delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      }
      
      // Prevent source map access safely
      if (window && Object.defineProperty) {
        Object.defineProperty(window, 'SOURCEMAP_FILENAME', {
          get() { return undefined; },
          set() {},
          configurable: false
        });
      }

      // Remove webpack chunks info safely
      if (typeof document !== 'undefined' && document.getElementsByTagName) {
        const scripts = document.getElementsByTagName('script');
        Array.from(scripts).forEach(script => {
          if (script && script.src && script.src.includes('chunk')) {
            script.removeAttribute('src');
          }
        });
      }
    } catch (e) {}
  }
};

export const hideSourceFiles = () => {
  if (typeof window !== 'undefined' && typeof process !== 'undefined') {
    try {
      // Hide source structure
      const sourceHider = {
        get: function() {
          return undefined;
        },
        set: function() {
          return undefined;
        },
        enumerable: false,
        configurable: false
      };

      // Hide source map related properties first
      ['SourceMap', 'sourceMappingURL', 'sourceURL'].forEach(prop => {
        try {
          Object.defineProperty(window, prop, sourceHider);
        } catch (e) {}
      });

      // Hide webpack-related properties
      ['__webpack_require__', '__webpack_public_path__', '__webpack_modules__'].forEach(prop => {
        try {
          Object.defineProperty(window, prop, sourceHider);
        } catch (e) {}
      });

      // Override sourceURL and sourceMappingURL in scripts
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element && node.tagName === 'SCRIPT') {
              node.removeAttribute('src');
              if (node.textContent) {
                node.textContent = node.textContent
                  .replace(/\/\/[#@]\s*(source(?:URL|MappingURL))=\s*(\S+)/g, '')
                  .replace(/\/\*[#@]\s*(source(?:URL|MappingURL))=\s*(\S+)\s*\*\//g, '');
              }
            }
          });
        });
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      
    } catch (e) {}
  }
};