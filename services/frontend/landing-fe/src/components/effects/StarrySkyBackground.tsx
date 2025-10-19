import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import StaticStarfield from './StaticStarfield';
import ShootingStars from './ShootingStars';
import ConstellationLines from './ConstellationLines';
import NebulaClouds from './NebulaClouds';
import SpaceDust from './SpaceDust';
import { getOptimalStarCount, prefersReducedMotion } from '@/utils/deviceDetection';
import { hasWebGLSupport } from '@/utils/webglSupport';
import { throttle } from '@/utils/throttle';

// ==================== CONSTANTS ====================
// Extract all magic numbers for maintainability

const ANIMATION_CONFIG = {
  // Star counts (adaptive based on device)
  STAR_COUNT_FALLBACK: 1500,

  // Animation timing
  WARP_DURATION: 1.5, // seconds
  SLOWDOWN_RATE: 0.93, // multiplier per frame
  SLOWDOWN_THRESHOLD: 0.02, // speed threshold to stop
  TEXT_REVEAL_DELAY: 600, // ms

  // Movement parameters
  STAR_SPEED: 120, // units per second
  PARALLAX_MULTIPLIER: 2, // mouse parallax sensitivity
  PARALLAX_DEPTH_FACTOR: 0.5, // depth-based parallax strength

  // Spatial bounds
  STAR_FIELD_WIDTH: 200,
  STAR_FIELD_HEIGHT: 200,
  STAR_FIELD_DEPTH: 200,
  Z_NEAR: 50, // stars wrap at this z-position
  Z_FAR: -100, // stars reset to this z-position

  // Visual properties
  STREAK_LENGTH: 20, // line length during warp
  STAR_SIZE_MIN: 0.15,
  STAR_SIZE_MAX: 0.55,
  STAR_SPEED_MIN: 0.5,
  STAR_SPEED_MAX: 1.0,

  // Material properties
  POINT_OPACITY_MIN: 0.3,
  POINT_OPACITY_MAX: 0.9,
  LINE_OPACITY: 0.5,

  // Color variation
  COLOR_VARIATION: 0.3,

  // Performance
  MOUSE_THROTTLE_MS: 16, // ~60fps
} as const;

const SESSION_STORAGE_KEY = 'ieee-hero-animation-seen';

// ==================== TYPES ====================

interface StarData {
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  speed: number;
  size: number;
  depth: number;
}

type AnimationPhase = 'warp' | 'slowing' | 'stopped';

// ==================== COMPONENTS ====================

interface StarsFieldProps {
  isLoading: boolean;
  starCount: number;
}

const StarsField = ({ isLoading, starCount }: StarsFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const [phase, setPhase] = useState<AnimationPhase>('warp');
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const speedMultiplier = useRef(1);
  const lineToCircleProgress = useRef(0);

  // Memoize star data generation
  const { stars, positions, colors, linePositions, starTexture } = useMemo(() => {
    const stars: StarData[] = [];
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const linePositions = new Float32Array(starCount * 6);

    // Create star texture with radial gradient
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(0.6, 'rgba(200, 220, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }

    const starTexture = new THREE.CanvasTexture(canvas);

    // Generate stars
    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * ANIMATION_CONFIG.STAR_FIELD_WIDTH;
      const y = (Math.random() - 0.5) * ANIMATION_CONFIG.STAR_FIELD_HEIGHT;
      const z =
        Math.random() * ANIMATION_CONFIG.STAR_FIELD_DEPTH +
        ANIMATION_CONFIG.Z_FAR;

      const originalPosition = new THREE.Vector3(x, y, z);
      const position = originalPosition.clone();
      const depth =
        (z - ANIMATION_CONFIG.Z_FAR) / ANIMATION_CONFIG.STAR_FIELD_DEPTH;
      const size =
        Math.random() * (ANIMATION_CONFIG.STAR_SIZE_MAX - ANIMATION_CONFIG.STAR_SIZE_MIN) +
        ANIMATION_CONFIG.STAR_SIZE_MIN;
      const speed =
        Math.random() * (ANIMATION_CONFIG.STAR_SPEED_MAX - ANIMATION_CONFIG.STAR_SPEED_MIN) +
        ANIMATION_CONFIG.STAR_SPEED_MIN;

      stars.push({
        position,
        originalPosition,
        speed,
        size,
        depth,
      });

      // Position attributes
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color attributes - Realistic star colors based on temperature
      // 70% blue/white (IEEE theme), 20% yellow, 10% red
      const colorType = Math.random();
      let r, g, b;

      if (colorType < 0.4) {
        // Blue giants (hot) - IEEE primary color
        r = 0.3 + Math.random() * 0.2;
        g = 0.5 + Math.random() * 0.2;
        b = 0.95 + Math.random() * 0.05;
      } else if (colorType < 0.7) {
        // White/light blue (medium) - IEEE electric
        r = 0.9 + Math.random() * 0.1;
        g = 0.95 + Math.random() * 0.05;
        b = 1.0;
      } else if (colorType < 0.9) {
        // Yellow-white (cooler)
        r = 1.0;
        g = 0.95 + Math.random() * 0.05;
        b = 0.7 + Math.random() * 0.2;
      } else {
        // Red dwarfs (coolest)
        r = 1.0;
        g = 0.4 + Math.random() * 0.2;
        b = 0.3 + Math.random() * 0.2;
      }

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;

      // Line positions (for warp streaks)
      linePositions[i * 6] = x;
      linePositions[i * 6 + 1] = y;
      linePositions[i * 6 + 2] = z;
      linePositions[i * 6 + 3] = x;
      linePositions[i * 6 + 4] = y;
      linePositions[i * 6 + 5] = z - ANIMATION_CONFIG.STREAK_LENGTH;
    }

    return { stars, positions, colors, linePositions, starTexture };
  }, [starCount]);

  // Attach buffer attributes programmatically
  useEffect(() => {
    if (pointsRef.current) {
      const geom = pointsRef.current.geometry;
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }

    if (linesRef.current) {
      const geom = linesRef.current.geometry;
      geom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    }
  }, [positions, colors, linePositions]);

  // Cleanup Three.js resources on unmount
  useEffect(() => {
    return () => {
      // Dispose texture
      if (starTexture) {
        starTexture.dispose();
      }

      // Dispose geometries and materials
      if (pointsRef.current) {
        pointsRef.current.geometry.dispose();
        const material = pointsRef.current.material as THREE.Material;
        material.dispose();
      }

      if (linesRef.current) {
        linesRef.current.geometry.dispose();
        const material = linesRef.current.material as THREE.Material;
        material.dispose();
      }
    };
  }, [starTexture]);

  // Throttled mouse move handler
  useEffect(() => {
    const throttledMouseMove = throttle((e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, ANIMATION_CONFIG.MOUSE_THROTTLE_MS);

    window.addEventListener('mousemove', throttledMouseMove);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
    };
  }, []);

  // Animation loop
  useFrame((_state, delta) => {
    if (isLoading || !pointsRef.current || !linesRef.current) return;

    timeRef.current += delta;

    const positionsArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const linePositionsArray = linesRef.current.geometry.attributes.position
      .array as Float32Array;

    // Phase transitions
    if (phase === 'warp' && timeRef.current > ANIMATION_CONFIG.WARP_DURATION) {
      setPhase('slowing');
    }

    if (phase === 'slowing') {
              speedMultiplier.current *= ANIMATION_CONFIG.SLOWDOWN_RATE;
            lineToCircleProgress.current = Math.min(
              lineToCircleProgress.current + delta * 1.5,
              1
            );
      
            if (speedMultiplier.current < ANIMATION_CONFIG.SLOWDOWN_THRESHOLD) {
              setPhase('stopped');
            }
          }
    // Parallax effect
    const parallaxX = mouseRef.current.x * ANIMATION_CONFIG.PARALLAX_MULTIPLIER;
    const parallaxY = mouseRef.current.y * ANIMATION_CONFIG.PARALLAX_MULTIPLIER;

    // Update star positions
    stars.forEach((star, i) => {
      if (phase === 'warp' || phase === 'slowing') {
        // Move stars forward during warp/slowing
        const speed = phase === 'warp' ? 1 : speedMultiplier.current;
        star.position.z += delta * ANIMATION_CONFIG.STAR_SPEED * star.speed * speed;

        // Wrap stars that go past the camera
        if (star.position.z > ANIMATION_CONFIG.Z_NEAR) {
          star.position.z = ANIMATION_CONFIG.Z_FAR;
          star.originalPosition.z = star.position.z;
        }

        // Update line positions with morphing effect
        const streakLength =
          ANIMATION_CONFIG.STREAK_LENGTH * (1 - lineToCircleProgress.current);
        linePositionsArray[i * 6] = star.position.x;
        linePositionsArray[i * 6 + 1] = star.position.y;
        linePositionsArray[i * 6 + 2] = star.position.z;
        linePositionsArray[i * 6 + 3] = star.position.x;
        linePositionsArray[i * 6 + 4] = star.position.y;
        linePositionsArray[i * 6 + 5] = star.position.z - streakLength;
      } else {
        // Parallax effect when stopped
        const parallaxFactor = star.depth * ANIMATION_CONFIG.PARALLAX_DEPTH_FACTOR;
        star.position.x = star.originalPosition.x + parallaxX * parallaxFactor;
        star.position.y = star.originalPosition.y + parallaxY * parallaxFactor;
      }

      // Update point positions
      positionsArray[i * 3] = star.position.x;
      positionsArray[i * 3 + 1] = star.position.y;
      positionsArray[i * 3 + 2] = star.position.z;
    });

    // Mark geometries for update
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    // Update material opacities
    const lineMaterial = linesRef.current.material as THREE.LineBasicMaterial;
    lineMaterial.opacity =
      phase === 'stopped'
        ? 0
        : ANIMATION_CONFIG.LINE_OPACITY * (1 - lineToCircleProgress.current);

    const pointMaterial = pointsRef.current.material as THREE.PointsMaterial;
    let baseOpacity =
      ANIMATION_CONFIG.POINT_OPACITY_MIN +
      lineToCircleProgress.current *
        (ANIMATION_CONFIG.POINT_OPACITY_MAX - ANIMATION_CONFIG.POINT_OPACITY_MIN);

    // Add subtle twinkling effect when stopped
    if (phase === 'stopped') {
      baseOpacity += Math.sin(timeRef.current * 3 + Math.random() * 100) * 0.15;
    }

    pointMaterial.opacity = baseOpacity;
  });

  return (
    <>
      {/* Background Effects (render first for depth) */}
      <NebulaClouds layerCount={3} enabled={phase === 'stopped'} />

      {/* Points (circles) - Multi-colored stars */}
      <points ref={pointsRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={ANIMATION_CONFIG.POINT_OPACITY_MIN}
          map={starTexture}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Lines (streaks) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color={0xaaccff}
          transparent
          opacity={ANIMATION_CONFIG.LINE_OPACITY}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Constellation Lines - connects nearby stars */}
      <ConstellationLines stars={stars} maxDistance={30} maxConnections={3} phase={phase} />

      {/* Shooting Stars - meteors streaking across */}
      <ShootingStars count={3} spawnInterval={5} />

      {/* Space Dust - subtle micro-particles */}
      <SpaceDust count={150} enabled={phase === 'stopped'} />
    </>
  );
};

// ==================== MAIN COMPONENT ====================

interface StarrySkyBackgroundProps {
  isLoading: boolean;
}

export default function StarrySkyBackground({ isLoading }: StarrySkyBackgroundProps) {

  // Check for accessibility preferences
  const hasReducedMotion = prefersReducedMotion();
  const hasWebGL = hasWebGLSupport();

  // Check session storage for repeat visits
  const hasSeenAnimation = sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';

  // Get optimal star count based on device
  const starCount = useMemo(
    () => getOptimalStarCount() || ANIMATION_CONFIG.STAR_COUNT_FALLBACK,
    []
  );



  // Show static fallback for accessibility or repeat visits
  if (hasReducedMotion || !hasWebGL || hasSeenAnimation) {
    return <StaticStarfield />;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Dark gradient with nebula glares */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      {/* Nebula glares - responsive sizing */}
      <div
        className="absolute top-20 left-1/4 w-48 h-48 md:w-64 md:h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '4s' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/3 w-32 h-32 md:w-48 md:h-48 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '5s', animationDelay: '1s' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-1/2 w-40 h-40 md:w-56 md:h-56 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '6s', animationDelay: '2s' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-28 h-28 md:w-40 md:h-40 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '5.5s', animationDelay: '0.5s' }}
        aria-hidden="true"
      />



      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <StarsField isLoading={isLoading} starCount={starCount} />
        </Suspense>
      </Canvas>

      {/* Text overlay - responsive sizing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white tracking-wider transition-all duration-1000 ${
            !isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{
            textShadow:
              '0 0 12px rgba(255, 255, 255, 0.8), 0 0 40px rgba(147, 197, 253, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 900,
          }}
        >
          IEEE RIT-B
        </h1>
      </div>
    </div>
  );
}
