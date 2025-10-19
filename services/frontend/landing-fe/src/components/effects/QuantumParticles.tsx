import { useEffect, useState, useRef, Component } from 'react';
import type { ReactNode } from 'react';
import './QuantumParticles.css';

interface QuantumParticlesProps {
  count?: number;
  className?: string;
}

// Error Boundary to catch rendering failures
class QuantumParticlesErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('QuantumParticles rendering error:', error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Graceful degradation - just don't render
    }
    return this.props.children;
  }
}

function QuantumParticlesCore({ count = 3, className = '' }: QuantumParticlesProps) {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const isMonitoringRef = useRef(false);

  // Track mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Check device capabilities (Tier 3 effect - high-end only)
    const deviceMemory = 'deviceMemory' in navigator ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory : undefined;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Don't render if user prefers reduced motion
    if (prefersReducedMotion) {
      if (isMountedRef.current) {
        setIsLowPerformance(true);
      }
      return;
    }

    // More lenient requirements - allow if either is unknown or meets threshold
    const isLowEnd = (deviceMemory !== undefined && deviceMemory < 2) || (hardwareConcurrency !== undefined && hardwareConcurrency < 2);

    if (isLowEnd) {
      if (isMountedRef.current) {
        setIsLowPerformance(true);
      }
    } else {
      // Delay render to prevent initial page load impact
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setShouldRender(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Performance monitoring - disable if FPS drops
  useEffect(() => {
    if (!shouldRender || isLowPerformance || isMonitoringRef.current) return;

    isMonitoringRef.current = true;
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number | null = null;
    let hasDisabled = false;

    const monitorPerformance = () => {
      // Safety check - don't continue if unmounted or disabled
      if (!isMountedRef.current || hasDisabled) {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        return;
      }

      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // If FPS drops below 20, disable particles
        if (fps < 20 && !hasDisabled) {
          hasDisabled = true;
          console.warn('QuantumParticles: Disabling due to low FPS:', fps);

          // Cancel current frame before state update
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }

          // Only update state if still mounted
          if (isMountedRef.current) {
            setIsLowPerformance(true);
          }
          return;
        }
      }

      // Schedule next frame only if not disabled
      if (!hasDisabled && isMountedRef.current) {
        animationFrameId = requestAnimationFrame(monitorPerformance);
      }
    };

    // Start monitoring after 2 seconds
    const monitorTimeout = setTimeout(() => {
      if (isMountedRef.current && !hasDisabled) {
        animationFrameId = requestAnimationFrame(monitorPerformance);
      }
    }, 2000);

    return () => {
      isMonitoringRef.current = false;
      hasDisabled = true;
      clearTimeout(monitorTimeout);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  }, [shouldRender, isLowPerformance]);

  // Don't render on low-end devices or if not ready
  if (isLowPerformance || !shouldRender) {
    return null;
  }

  return (
    <div
      ref={particlesRef}
      className={`quantum-field ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`quantum-particle-${i}`}
          className="quantum-particle"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 25}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${8 + i * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function QuantumParticles(props: QuantumParticlesProps) {
  return (
    <QuantumParticlesErrorBoundary>
      <QuantumParticlesCore {...props} />
    </QuantumParticlesErrorBoundary>
  );
}
