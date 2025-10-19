import { useEffect, useRef } from 'react';

/**
 * OrbitalParticles Component
 * Creates particles that orbit around a center point (loader logo)
 * Features:
 * - Multiple orbital rings at different speeds
 * - Particle trails
 * - IEEE blue glow effects
 * - Burst animation on completion
 * - Pure CSS for better performance
 */

interface OrbitalParticlesProps {
  ringCount?: number;
  particlesPerRing?: number;
  radius?: number; // pixels
  className?: string;
  isComplete?: boolean; // Trigger burst animation
}

const OrbitalParticles = ({
  ringCount = 2,
  particlesPerRing = 6,
  radius = 80,
  className = '',
  isComplete = false,
}: OrbitalParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger burst animation on completion
  useEffect(() => {
    if (isComplete && containerRef.current) {
      const particles = containerRef.current.querySelectorAll('.orbital-particle');
      particles.forEach((particle, index) => {
        setTimeout(() => {
          particle.classList.add('burst');
        }, index * 20);
      });
    }
  }, [isComplete]);

  const generateParticles = () => {
    const particles = [];
    let particleId = 0;

    for (let ring = 0; ring < ringCount; ring++) {
      const ringRadius = radius + ring * 20;
      const rotationDuration = 3 + ring * 1; // Outer rings slower
      const ringDelay = ring * 0.2;

      for (let i = 0; i < particlesPerRing; i++) {
        const angle = (i / particlesPerRing) * 360;
        const particleDelay = (i / particlesPerRing) * rotationDuration + ringDelay;

        particles.push(
          <div
            key={particleId++}
            className="orbital-particle absolute w-2 h-2 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-4px',
              marginTop: '-4px',
              animation: `orbit ${rotationDuration}s linear infinite`,
              animationDelay: `${particleDelay}s`,
              '--orbit-radius': `${ringRadius}px`,
              '--start-angle': `${angle}deg`,
            } as React.CSSProperties & { [key: string]: string }}
          >
            {/* Particle glow */}
            <div className="absolute inset-0 bg-[#4d7fff] rounded-full animate-pulse-glow" />
            <div
              className="absolute inset-0 bg-[#4d7fff] rounded-full blur-sm opacity-60"
              style={{ transform: 'scale(2)' }}
            />

            {/* Particle trail */}
            <div className="absolute left-full top-1/2 w-4 h-0.5 bg-gradient-to-r from-[#4d7fff] to-transparent opacity-60 -translate-y-1/2" />
          </div>
        );
      }
    }

    return particles;
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative ${className}`}
        style={{
          width: `${(radius + ringCount * 20) * 2}px`,
          height: `${(radius + ringCount * 20) * 2}px`,
        }}
      >
        {generateParticles()}
      </div>

      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(var(--start-angle, 0deg)) translateX(var(--orbit-radius, 80px)) rotate(calc(-1 * var(--start-angle, 0deg)));
          }
          to {
            transform: rotate(calc(var(--start-angle, 0deg) + 360deg)) translateX(var(--orbit-radius, 80px)) rotate(calc(-1 * (var(--start-angle, 0deg) + 360deg)));
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes burst-out {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--burst-x, 0), var(--burst-y, 0)) scale(0);
            opacity: 0;
          }
        }

        .orbital-particle.burst {
          animation: burst-out 0.6s ease-out forwards !important;
          --burst-x: calc((Math.random() - 0.5) * 200px);
          --burst-y: calc((Math.random() - 0.5) * 200px);
        }

        .animate-pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        /* Staggered burst effect */
        .orbital-particle.burst:nth-child(1) { --burst-x: 50px; --burst-y: -50px; }
        .orbital-particle.burst:nth-child(2) { --burst-x: 80px; --burst-y: 20px; }
        .orbital-particle.burst:nth-child(3) { --burst-x: -40px; --burst-y: 70px; }
        .orbital-particle.burst:nth-child(4) { --burst-x: -70px; --burst-y: -30px; }
        .orbital-particle.burst:nth-child(5) { --burst-x: 30px; --burst-y: 80px; }
        .orbital-particle.burst:nth-child(6) { --burst-x: -80px; --burst-y: -60px; }
        .orbital-particle.burst:nth-child(7) { --burst-x: 60px; --burst-y: 60px; }
        .orbital-particle.burst:nth-child(8) { --burst-x: -50px; --burst-y: 50px; }
        .orbital-particle.burst:nth-child(9) { --burst-x: 90px; --burst-y: -20px; }
        .orbital-particle.burst:nth-child(10) { --burst-x: -60px; --burst-y: -70px; }
        .orbital-particle.burst:nth-child(11) { --burst-x: 40px; --burst-y: -80px; }
        .orbital-particle.burst:nth-child(12) { --burst-x: -90px; --burst-y: 30px; }
      `}</style>
    </>
  );
};

export default OrbitalParticles;
