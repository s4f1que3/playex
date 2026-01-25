// Service worker registration and management utility
// frontend/src/utils/serviceWorkerManager.js

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('Service Worker registered successfully:', registration);

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          // New service worker is ready
          console.log('New service worker version available');
          // Optionally notify user about update
          notifyUserAboutUpdate();
        }
      });
    });

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update().catch((error) => {
        console.log('Error checking for service worker updates:', error);
      });
    }, 60 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

export const unregisterServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const unregisterPromises = registrations.map((registration) =>
      registration.unregister()
    );
    await Promise.all(unregisterPromises);
    console.log('All service workers unregistered');
    return true;
  } catch (error) {
    console.error('Error unregistering service workers:', error);
    return false;
  }
};

export const notifyUserAboutUpdate = () => {
  // You can use your own notification system here
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Playex Update Available', {
      body: 'A new version is available. Please refresh the page.',
      icon: '/logo.png',
      badge: '/logo.png'
    });
  }
};

// Check if there's a waiting service worker and skip it
export const skipWaitingServiceWorker = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
};

// Clear all caches
export const clearAllCaches = async () => {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map((cacheName) => caches.delete(cacheName))
  );
};

// Get cache statistics
export const getCacheStats = async () => {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  let totalEntries = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    totalEntries += keys.length;

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return {
    cacheNames,
    totalSize: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
    totalEntries
  };
};

export default {
  registerServiceWorker,
  unregisterServiceWorker,
  skipWaitingServiceWorker,
  clearAllCaches,
  getCacheStats
};
