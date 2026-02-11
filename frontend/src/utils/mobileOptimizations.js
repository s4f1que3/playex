// Mobile-specific optimizations to fix content disappearing on scroll
export const MOBILE_BREAKPOINT = 768;

export const isMobileDevice = () => {
  return window.innerWidth <= MOBILE_BREAKPOINT || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Get appropriate rootMargin for intersection observers based on device
export const getMobileRootMargin = () => {
  if (isMobileDevice()) {
    // Much more generous margins for mobile to prevent disappearing content
    return '300px 0px 300px 0px';
  }
  return '100px 0px 100px 0px';
};

// Get appropriate threshold for intersection observers
export const getMobileThreshold = () => {
  if (isMobileDevice()) {
    // Lower threshold for mobile - trigger earlier
    return 0.01; // Trigger when just 1% is visible
  }
  return 0.1;
};

// Disable aggressive optimizations on mobile
export const shouldUseContentVisibility = () => {
  if (isMobileDevice()) {
    return false; // Disable content-visibility on mobile
  }
  return CSS.supports && CSS.supports('content-visibility', 'auto');
};

// Get appropriate overscan for virtual scrolling
export const getMobileOverscan = () => {
  if (isMobileDevice()) {
    return 5; // Render 5 extra items above and below on mobile
  }
  return 3;
};

// Optimize scroll behavior for mobile
export const optimizeMobileScroll = () => {
  if (!isMobileDevice()) return;

  // Prevent scroll jank on mobile
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Handle scroll updates
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => window.removeEventListener('scroll', handleScroll);
};

// Better viewport detection for mobile
export const getMobileViewportConfig = () => {
  if (isMobileDevice()) {
    return {
      once: false, // Allow re-triggering on mobile
      amount: 0.01, // Trigger when just 1% visible
      margin: '300px 0px' // Large margins
    };
  }
  return {
    once: true,
    amount: 0.2,
    margin: '100px 0px'
  };
};

// Prevent overscroll bounce on iOS
export const preventOverscrollBounce = () => {
  if (!isMobileDevice()) return;
  
  document.body.style.overscrollBehavior = 'contain';
};

// Initialize all mobile optimizations
export const initMobileOptimizations = () => {
  if (!isMobileDevice()) return;

  console.log('📱 Initializing mobile optimizations...');
  
  // Prevent overscroll bounce
  preventOverscrollBounce();
  
  // Optimize scroll
  const cleanup = optimizeMobileScroll();
  
  // Add mobile-specific meta tags
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
    );
  }
  
  // Disable hover effects on touch devices
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }
  
  console.log('✅ Mobile optimizations enabled');
  
  return cleanup;
};
