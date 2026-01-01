import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * useMotion Hook
 * Unified accessibility engine for controlling motion throughout the application.
 * Respects OS-level 'prefers-reduced-motion' settings.
 */
export function useMotion() {
  const prefersReduced = useFramerReducedMotion();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Initial check and sync with Framer Motion hook
    setShouldReduceMotion(!!prefersReduced);
  }, [prefersReduced]);

  /**
   * Helper to automatically select variants based on motion preference.
   * If reduced motion is enabled, it returns a fade-only version of the variant.
   */
  const orchestrate = (standardVariants: any) => {
    if (!shouldReduceMotion) return standardVariants;

    // Create a "Safe" copy of the variants
    const safeVariants: any = { ...standardVariants };

    // Neutralize translations (x, y, scale, rotate) in all keys
    Object.keys(safeVariants).forEach(key => {
      const variant = { ...safeVariants[key] };
      
      // Remove motion-heavy properties
      delete variant.y;
      delete variant.x;
      delete variant.scale;
      delete variant.rotate;
      delete variant.skew;
      
      // Ensure opacity remains for a clean fade
      if (variant.opacity === undefined) {
        variant.opacity = key === 'hidden' ? 0 : 1;
      }

      // Neutralize transition delays/durations if they are purely for motion
      if (variant.transition) {
        variant.transition = {
          ...variant.transition,
          type: 'tween', // Faster than spring
          duration: 0.3, // Snappier for reduced motion
          staggerChildren: 0, // Disable staggers to prevent "scanning" effect
          delayChildren: 0
        };
      }

      safeVariants[key] = variant;
    });

    return safeVariants;
  };

  return {
    shouldReduceMotion,
    orchestrate
  };
}
