import { useEffect, useState } from 'react';
import './QuantumParticles.css';

interface QuantumParticlesProps {
  count?: number;
  className?: string;
}

export default function QuantumParticles({ count = 3, className = '' }: QuantumParticlesProps) {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check device capabilities (Tier 3 effect - high-end only)
    const deviceMemory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;

    console.log('Quantum Particles - Device Info:', {
      deviceMemory: deviceMemory || 'unknown',
      hardwareConcurrency: hardwareConcurrency || 'unknown',
      screenWidth: window.innerWidth,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });

    // More lenient requirements - allow if either is unknown or meets threshold
    const isLowEnd = (deviceMemory && deviceMemory < 2) || (hardwareConcurrency && hardwareConcurrency < 2);

    if (isLowEnd) {
      console.log('Quantum Particles: Disabled due to low-end device detection');
      setIsLowPerformance(true);
    } else {
      console.log('Quantum Particles: Enabled - rendering', count, 'particles');
    }
  }, [count]);

  // Don't render on low-end devices
  if (isLowPerformance) {
    return null;
  }

  return (
    <div className={`quantum-field ${className}`} aria-hidden="true" role="presentation">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="quantum-particle"
          style={{
            top: `${20 + i * 20}%`,
            left: `${10 + i * 30}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${8 + i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
