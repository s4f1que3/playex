import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { disableSourceMaps, disableDevTools } from './utils/security';

// Initialize security before React loads
try {
  disableSourceMaps();
  disableDevTools();
} catch (error) {
  console.warn('Security initialization failed:', error);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
