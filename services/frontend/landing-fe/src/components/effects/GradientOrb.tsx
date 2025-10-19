import { useEffect, useState } from 'react';
import './GradientOrb.css';

interface GradientOrbProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export default function GradientOrb({ position = 'top-right', className = '' }: GradientOrbProps) {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check device capabilities (Tier 3 effect)
    const deviceMemory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;

    const isLowEnd = (deviceMemory && deviceMemory < 8) || (hardwareConcurrency && hardwareConcurrency < 8);

    if (isLowEnd) {
      setIsLowPerformance(true);
    }
  }, []);

  // Don't render on low-end devices
  if (isLowPerformance) {
    return null;
  }

  const positionClasses: Record<typeof position, string> = {
    'top-left': 'gradient-orb-top-left',
    'top-right': 'gradient-orb-top-right',
    'bottom-left': 'gradient-orb-bottom-left',
    'bottom-right': 'gradient-orb-bottom-right',
  };

  return (
    <div
      className={`gradient-orb ${positionClasses[position]} ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  );
}
