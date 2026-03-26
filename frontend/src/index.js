import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import './styles/winter.css';
import './styles/chrome-optimizations.css';
import './styles/mobile-optimizations.css';
import './i18n'; // Initialize i18n
import { initAllChromeOptimizations } from './utils/chromeOptimizations';
import { initMobileOptimizations } from './utils/mobileOptimizations';


// Initialize Chrome-specific optimizations
initAllChromeOptimizations();

// Initialize mobile optimizations
initMobileOptimizations();

// Create a client with Chrome-optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10 minutes
      cacheTime: 900000, // 15 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
