// Hook to provide mobile-optimized Framer Motion viewport settings
import { useMemo } from 'react';
import { getMobileViewportConfig } from '../utils/mobileOptimizations';

/**
 * Returns mobile-optimized viewport configuration for Framer Motion whileInView
 * On mobile: Uses lower amounts and doesn't restrict to "once" to prevent disappearing content
 * On desktop: Uses standard settings with "once" for performance
 */
export const useMobileViewport = (customConfig = {}) => {
  return useMemo(() => {
    const defaultConfig = getMobileViewportConfig();
    return {
      ...defaultConfig,
      ...customConfig
    };
  }, [customConfig]);
};

export default useMobileViewport;
