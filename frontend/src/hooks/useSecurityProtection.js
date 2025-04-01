import { useEffect } from 'react';
import { disableDevTools } from '../utils/security';

export const useSecurityProtection = () => {
  useEffect(() => {
    disableDevTools();

    // Add CSS to prevent text selection
    const style = document.createElement('style');
    style.textContent = `
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      /* Exception for input fields */
      input, textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
};
