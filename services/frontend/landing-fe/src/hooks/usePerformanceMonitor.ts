import { useState, useEffect, useRef } from 'react';

export type PerformanceTier = 'ULTRA' | 'BALANCED' | 'PERFORMANCE' | 'LOW';

const getInitialTier = (): PerformanceTier => {
  try {
    const saved = localStorage.getItem('perfMode');
    if (saved === 'low') return 'LOW';
    if (typeof navigator !== 'undefined') {
      const cores = navigator.hardwareConcurrency || 4;
      // @ts-ignore
      const memory = navigator.deviceMemory || 4; 
      if (cores <= 4 && memory <= 4) return 'LOW';
    }
  } catch (e) {}
  return 'ULTRA';
};

/**
 * usePerformanceMonitor Hook
 * Real-time FPS tracking and dynamic quality tiering.
 * Helps maintain 60fps by signaling components to reduce complexity.
 * 
 * @param includeFps Whether to update the fps state (causes re-renders every second)
 */
export function usePerformanceMonitor(includeFps = true) {
  const [tier, setTier] = useState<PerformanceTier>(getInitialTier);
  const [fps, setFps] = useState(60);
  
  // Internal tracking
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const MAX_HISTORY = 60; // 1 second of history at 60fps

  useEffect(() => {
    let animationFrameId: number;

    const monitor = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;

      if (delta >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / delta);
        
        if (includeFps) {
          setFps(currentFps);
        }
        
        // Add to history
        fpsHistory.current.push(currentFps);
        if (fpsHistory.current.length > MAX_HISTORY) {
          fpsHistory.current.shift();
        }

        // Tier Logic
        const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;

        if (fpsHistory.current.length >= 30) { // Need at least 0.5s of data
          if (avgFps < 30) {
            setTier(prev => prev !== 'LOW' ? 'LOW' : prev);
          } else if (avgFps < 40) {
            setTier(prev => prev !== 'PERFORMANCE' ? 'PERFORMANCE' : prev);
          } else if (avgFps < 52) {
            setTier(prev => prev !== 'BALANCED' ? 'BALANCED' : prev);
          } else if (avgFps >= 58) {
            // Only upshift if we have plenty of overhead
            setTier(prev => prev !== 'ULTRA' ? 'ULTRA' : prev);
          }
        }

        frameCount.current = 0;
        lastTime.current = now;
      }

      animationFrameId = requestAnimationFrame(monitor);
    };

    animationFrameId = requestAnimationFrame(monitor);
    return () => cancelAnimationFrame(animationFrameId);
  }, [includeFps]);

  return { fps, tier };
}
