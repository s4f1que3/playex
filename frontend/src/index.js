import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import './styles/winter.css';
import './styles/chrome-optimizations.css';
import './i18n'; // Initialize i18n
import { initializeSourceCodeProtection, sanitizeSourceMaps } from './utils/sourceCodeProtection';
import { initAllChromeOptimizations } from './utils/chromeOptimizations';

// Initialize source code protection
initializeSourceCodeProtection();
sanitizeSourceMaps();

// Initialize Chrome-specific optimizations
initAllChromeOptimizations();

// Create a client with Chrome-optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10 minutes
      cacheTime: 900000, // 15 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      // Use Chrome's requestIdleCallback for background refetching
      refetchOnMount: window.__USE_IDLE_CALLBACK__ ? 'always' : true,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
