import { hasWebGL2Support } from './webglSupport';

/**
 * Device detection utility for adaptive performance optimization
 * Detects device capabilities to adjust star count and quality settings
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isLowEndDevice: boolean;
  hardwareConcurrency: number;
  devicePixelRatio: number;
  supportsWebGL2: boolean;
}

/**
 * Detect if the device is mobile (phone)
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipod', 'blackberry', 'windows phone'];

  return mobileKeywords.some(keyword => ua.includes(keyword));
};

/**
 * Detect if the device is a tablet
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent.toLowerCase();
  const isIpad = ua.includes('ipad') || (ua.includes('macintosh') && navigator.maxTouchPoints > 1);
  const isAndroidTablet = ua.includes('android') && !ua.includes('mobile');

  return isIpad || isAndroidTablet;
};

/**
 * Detect if the device is low-end based on CPU cores and device type
 */
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const cores = navigator.hardwareConcurrency || 2;
  const isMobile = isMobileDevice();
  const isTablet = isTabletDevice();

  // Mobile/tablet with <= 4 cores, or desktop with <= 2 cores
  if (isMobile || isTablet) {
    return cores <= 4;
  }

  return cores <= 2;
};

/**
 * Get comprehensive device capabilities
 */
export const getDeviceCapabilities = (): DeviceCapabilities => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isLowEndDevice: false,
      hardwareConcurrency: 4,
      devicePixelRatio: 1,
      supportsWebGL2: false,
    };
  }

  return {
    isMobile: isMobileDevice(),
    isTablet: isTabletDevice(),
    isLowEndDevice: isLowEndDevice(),
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    devicePixelRatio: window.devicePixelRatio || 1,
    supportsWebGL2: hasWebGL2Support(),
  };
};

/**
 * Check if WebGL2 is supported
 * @deprecated Use hasWebGL2Support from webglSupport.ts instead
 */
export const supportsWebGL2 = (): boolean => {
  return hasWebGL2Support();
};

/**
 * Get optimal star count based on device capabilities
 */
export const getOptimalStarCount = (): number => {
  const capabilities = getDeviceCapabilities();

  // Mobile phones: lowest star count
  if (capabilities.isMobile) {
    return capabilities.isLowEndDevice ? 300 : 500;
  }

  // Tablets: medium star count
  if (capabilities.isTablet) {
    return capabilities.isLowEndDevice ? 600 : 900;
  }

  // Desktop: high star count
  if (capabilities.isLowEndDevice) {
    return 1200;
  }

  // High-end desktop
  return capabilities.hardwareConcurrency >= 8 ? 2500 : 1800;
};

/**
 * Detect if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
