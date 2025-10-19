/**
 * Custom hook for count-up animations
 * Animates a number from 0 to target value with easing
 */

import { useEffect, useState, useRef } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number; // in milliseconds
  delay?: number; // delay before starting
  decimals?: number;
  suffix?: string;
  prefix?: string;
  easing?: (t: number) => number;
}

// Easing functions
const easingFunctions = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  linear: (t: number) => t,
};

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
  suffix = '',
  prefix = '',
  easing = easingFunctions.easeOutExpo,
}: UseCountUpOptions): string {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Intersection Observer to trigger animation when element is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          setIsVisible(true);
          hasAnimatedRef.current = true;
        }
      },
      { threshold: 0.3 }
    );

    // Find the element in the DOM (look for .stat-number class)
    const statElement = document.querySelector('.stat-number');
    if (statElement) {
      observer.observe(statElement as Element);
      elementRef.current = statElement as HTMLElement;
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp + delay;

      if (timestamp < startTime) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easing(progress);
      const currentCount = start + (end - start) * easedProgress;

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end exactly at the target
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, start, end, duration, delay, easing]);

  // Format the number
  const formattedCount = count.toFixed(decimals);

  return `${prefix}${formattedCount}${suffix}`;
}

// Simplified version that doesn't require intersection observer
export function useSimpleCountUp(
  end: number,
  duration: number = 2000,
  decimals: number = 0
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = end * easedProgress;

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return Math.round(count * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
