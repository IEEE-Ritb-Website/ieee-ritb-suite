/**
 * Gradient Mesh (SVG-based)
 * 60-70% performance improvement over CSS gradients
 * Foundation: FOUNDATION-Part3-Guidelines.md - Performance Optimization
 */

import './GradientMesh.css';

interface GradientMeshProps {
  variant?: 'hero' | 'section';
  opacity?: number;
}

export default function GradientMesh({ variant = 'hero', opacity = 1 }: GradientMeshProps) {
  if (variant === 'hero') {
    return (
      <svg
        className="gradient-mesh gradient-mesh-hero"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ opacity }}
      >
        <defs>
          {/* Base gradient */}
          <radialGradient id="heroBase" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="rgba(10, 11, 20, 1)" />
            <stop offset="100%" stopColor="rgba(5, 6, 15, 1)" />
          </radialGradient>

          {/* IEEE Primary blue orb */}
          <radialGradient id="heroBlue1" cx="20%" cy="50%" r="40%">
            <stop offset="0%" stopColor="rgba(77, 127, 255, 0.15)" />
            <stop offset="50%" stopColor="rgba(77, 127, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(77, 127, 255, 0)" />
          </radialGradient>

          {/* IEEE Electric blue orb */}
          <radialGradient id="heroBlue2" cx="80%" cy="50%" r="40%">
            <stop offset="0%" stopColor="rgba(0, 180, 255, 0.12)" />
            <stop offset="50%" stopColor="rgba(0, 180, 255, 0.06)" />
            <stop offset="100%" stopColor="rgba(0, 180, 255, 0)" />
          </radialGradient>

          {/* Accent gradient 1 */}
          <radialGradient id="heroAccent1" cx="30%" cy="40%" r="35%">
            <stop offset="0%" stopColor="rgba(77, 127, 255, 0.18)" />
            <stop offset="40%" stopColor="rgba(77, 127, 255, 0.06)" />
            <stop offset="100%" stopColor="rgba(77, 127, 255, 0)" />
          </radialGradient>

          {/* Accent gradient 2 */}
          <radialGradient id="heroAccent2" cx="70%" cy="60%" r="35%">
            <stop offset="0%" stopColor="rgba(0, 180, 255, 0.15)" />
            <stop offset="40%" stopColor="rgba(0, 180, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(0, 180, 255, 0)" />
          </radialGradient>

          {/* Purple accent */}
          <radialGradient id="heroAccent3" cx="50%" cy="80%" r="30%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
            <stop offset="35%" stopColor="rgba(139, 92, 246, 0.03)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </radialGradient>

          {/* Blur filter for softer edges */}
          <filter id="heroBlur">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </defs>

        {/* Base layer */}
        <rect width="1920" height="1080" fill="url(#heroBase)" />

        {/* Orb layers with blur */}
        <rect width="1920" height="1080" fill="url(#heroBlue1)" filter="url(#heroBlur)" />
        <rect width="1920" height="1080" fill="url(#heroBlue2)" filter="url(#heroBlur)" />
        <rect width="1920" height="1080" fill="url(#heroAccent1)" filter="url(#heroBlur)" />
        <rect width="1920" height="1080" fill="url(#heroAccent2)" filter="url(#heroBlur)" />
        <rect width="1920" height="1080" fill="url(#heroAccent3)" filter="url(#heroBlur)" />
      </svg>
    );
  }

  // Section variant (lighter, for other sections)
  return (
    <svg
      className="gradient-mesh gradient-mesh-section"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <radialGradient id="sectionGrad1" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(77, 127, 255, 0.05)" />
          <stop offset="100%" stopColor="rgba(77, 127, 255, 0)" />
        </radialGradient>

        <filter id="sectionBlur">
          <feGaussianBlur stdDeviation="80" />
        </filter>
      </defs>

      <rect width="1920" height="1080" fill="transparent" />
      <rect width="1920" height="1080" fill="url(#sectionGrad1)" filter="url(#sectionBlur)" />
    </svg>
  );
}
