import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ShootingStars from './ShootingStars';
import { getOptimalStarCount, prefersReducedMotion } from '@/utils/deviceDetection';
import { hasWebGLSupport } from '@/utils/webglSupport';
import { throttle } from '@/utils/throttle';
import { usePerformanceMonitor, type PerformanceTier } from '@/hooks/usePerformanceMonitor';
import './HeroStarfield.css';

// ==================== CONSTANTS ====================

const ANIMATION_CONFIG = {
  STAR_COUNT_FALLBACK: 1500,
  WARP_DURATION: 1.5,
  SLOWDOWN_RATE: 0.93,
  SLOWDOWN_THRESHOLD: 0.02,
  STAR_SPEED: 120,
  PARALLAX_MULTIPLIER: 2,
  PARALLAX_DEPTH_FACTOR: 0.5,
  STAR_FIELD_WIDTH: 200,
  STAR_FIELD_HEIGHT: 200,
  STAR_FIELD_DEPTH: 200,
  Z_NEAR: 50,
  Z_FAR: -100,
  STREAK_LENGTH: 20,
  STAR_SIZE_MIN: 0.15,
  STAR_SIZE_MAX: 0.55,
  STAR_SPEED_MIN: 0.5,
  STAR_SPEED_MAX: 1.0,
  POINT_OPACITY_MIN: 0.3,
  POINT_OPACITY_MAX: 0.9,
  LINE_OPACITY: 0.5,
  MOUSE_THROTTLE_MS: 16,
} as const;

// ==================== TYPES ====================

interface StarData {
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  speed: number;
  size: number;
  depth: number;
}

export type AnimationPhase = 'warp' | 'slowing' | 'stopped';

// ==================== COMPONENTS ====================

interface StarsFieldProps {
  isLoading: boolean;
  starCount: number;
  tier: PerformanceTier;
  onPhaseChange?: (phase: AnimationPhase) => void;
}

const StarsField = ({ isLoading, starCount, tier, onPhaseChange }: StarsFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const [phase, setPhase] = useState<AnimationPhase>('warp');
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const speedMultiplier = useRef(1);
  const lineToCircleProgress = useRef(0);

  // Dynamic values based on tier
  const shootingStarConfig = useMemo(() => {
    if (tier === 'PERFORMANCE') return { count: 0, interval: 99999 };
    if (tier === 'BALANCED') return { count: 1, interval: 15 };
    return { count: 2, interval: 8 };
  }, [tier]);

  useEffect(() => {
    if (onPhaseChange) {
      onPhaseChange(phase);
    }
  }, [phase, onPhaseChange]);

  const { stars, positions, colors, linePositions, starTexture } = useMemo(() => {
    const stars: StarData[] = [];
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const linePositions = new Float32Array(starCount * 6);

    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 32, 32);
    }
    const starTexture = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * ANIMATION_CONFIG.STAR_FIELD_WIDTH;
      const y = (Math.random() - 0.5) * ANIMATION_CONFIG.STAR_FIELD_HEIGHT;
      const z = Math.random() * ANIMATION_CONFIG.STAR_FIELD_DEPTH + ANIMATION_CONFIG.Z_FAR;

      const originalPosition = new THREE.Vector3(x, y, z);
      const position = originalPosition.clone();
      const depth = (z - ANIMATION_CONFIG.Z_FAR) / ANIMATION_CONFIG.STAR_FIELD_DEPTH;
      const size = Math.random() * (ANIMATION_CONFIG.STAR_SIZE_MAX - ANIMATION_CONFIG.STAR_SIZE_MIN) + ANIMATION_CONFIG.STAR_SIZE_MIN;
      const speed = Math.random() * (ANIMATION_CONFIG.STAR_SPEED_MAX - ANIMATION_CONFIG.STAR_SPEED_MIN) + ANIMATION_CONFIG.STAR_SPEED_MIN;

      stars.push({ position, originalPosition, speed, size, depth });

      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;

      const colorType = Math.random();
      let r, g, b;
      if (colorType < 0.4) { r = 0.3; g = 0.5; b = 1.0; }
      else if (colorType < 0.7) { r = 0.9; g = 0.95; b = 1.0; }
      else { r = 1.0; g = 0.95; b = 0.8; }
      colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b;

      linePositions[i * 6] = x; linePositions[i * 6 + 1] = y; linePositions[i * 6 + 2] = z;
      linePositions[i * 6 + 3] = x; linePositions[i * 6 + 4] = y; linePositions[i * 6 + 5] = z - ANIMATION_CONFIG.STREAK_LENGTH;
    }
    return { stars, positions, colors, linePositions, starTexture };
  }, [starCount]);

  useEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pointsRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    if (linesRef.current) {
      linesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    }
  }, [positions, colors, linePositions]);

  useEffect(() => {
    const points = pointsRef.current;
    const lines = linesRef.current;
    return () => {
      if (starTexture) starTexture.dispose();
      if (points) { points.geometry.dispose(); (points.material as THREE.Material).dispose(); }
      if (lines) { lines.geometry.dispose(); (lines.material as THREE.Material).dispose(); }
    };
  }, [starTexture]);

  useEffect(() => {
    const throttledMouseMove = throttle((e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, ANIMATION_CONFIG.MOUSE_THROTTLE_MS);
    window.addEventListener('mousemove', throttledMouseMove);
    return () => window.removeEventListener('mousemove', throttledMouseMove);
  }, []);

  useFrame((_state, delta) => {
    if (isLoading || !pointsRef.current || !linesRef.current) return;
    timeRef.current += delta;

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const linePositionsArray = linesRef.current.geometry.attributes.position.array as Float32Array;

    if (phase === 'warp' && timeRef.current > ANIMATION_CONFIG.WARP_DURATION) {
      setPhase('slowing');
    }

    if (phase === 'slowing') {
      speedMultiplier.current *= ANIMATION_CONFIG.SLOWDOWN_RATE;
      lineToCircleProgress.current = Math.min(lineToCircleProgress.current + delta * 1.5, 1);
      if (speedMultiplier.current < ANIMATION_CONFIG.SLOWDOWN_THRESHOLD) {
        setPhase('stopped');
      }
    }

    smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.08;
    smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.08;

    const parallaxX = smoothMouseRef.current.x * ANIMATION_CONFIG.PARALLAX_MULTIPLIER;
    const parallaxY = smoothMouseRef.current.y * ANIMATION_CONFIG.PARALLAX_MULTIPLIER;

    stars.forEach((star, i) => {
      if (phase === 'warp' || phase === 'slowing') {
        const speed = phase === 'warp' ? 1 : speedMultiplier.current;
        star.position.z += delta * ANIMATION_CONFIG.STAR_SPEED * star.speed * speed;
        if (star.position.z > ANIMATION_CONFIG.Z_NEAR) {
          star.position.z = ANIMATION_CONFIG.Z_FAR;
          star.originalPosition.z = star.position.z;
        }

        const streakLength = ANIMATION_CONFIG.STREAK_LENGTH * (1 - lineToCircleProgress.current);
        linePositionsArray[i * 6] = star.position.x;
        linePositionsArray[i * 6 + 1] = star.position.y;
        linePositionsArray[i * 6 + 2] = star.position.z;
        linePositionsArray[i * 6 + 3] = star.position.x;
        linePositionsArray[i * 6 + 4] = star.position.y;
        linePositionsArray[i * 6 + 5] = star.position.z - streakLength;
      } else {
        const parallaxFactor = star.depth * ANIMATION_CONFIG.PARALLAX_DEPTH_FACTOR;
        star.position.x = star.originalPosition.x + parallaxX * parallaxFactor;
        star.position.y = star.originalPosition.y + parallaxY * parallaxFactor;
      }

      positionsArray[i * 3] = star.position.x;
      positionsArray[i * 3 + 1] = star.position.y;
      positionsArray[i * 3 + 2] = star.position.z;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    const lineMaterial = linesRef.current.material as THREE.LineBasicMaterial;
    lineMaterial.opacity = phase === 'stopped' ? 0 : ANIMATION_CONFIG.LINE_OPACITY * (1 - lineToCircleProgress.current);

    const pointMaterial = pointsRef.current.material as THREE.PointsMaterial;
    let baseOpacity = ANIMATION_CONFIG.POINT_OPACITY_MIN + lineToCircleProgress.current * (ANIMATION_CONFIG.POINT_OPACITY_MAX - ANIMATION_CONFIG.POINT_OPACITY_MIN);

    if (phase === 'stopped') {
      baseOpacity += Math.sin(timeRef.current * 2.5) * 0.08;
    }
    pointMaterial.opacity = baseOpacity;
  });

  return (
    <>
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
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={0xaaccff} transparent opacity={ANIMATION_CONFIG.LINE_OPACITY} blending={THREE.AdditiveBlending} />
      </lineSegments>
      {shootingStarConfig.count > 0 && (
        <ShootingStars count={shootingStarConfig.count} spawnInterval={shootingStarConfig.interval} />
      )}
    </>
  );
};

// ==================== MAIN COMPONENT ====================

interface HeroStarfieldProps {
  isLoading: boolean;
  onPhaseChange?: (phase: AnimationPhase) => void;
}

export default function HeroStarfield({ isLoading, onPhaseChange }: HeroStarfieldProps) {
  const hasReducedMotion = prefersReducedMotion();
  const hasWebGL = hasWebGLSupport();
  const { tier } = usePerformanceMonitor(false);
  
  const starCount = useMemo(() => {
    const baseCount = getOptimalStarCount() || ANIMATION_CONFIG.STAR_COUNT_FALLBACK;
    // Scale initial star count based on current tier if detected early
    if (tier === 'PERFORMANCE') return Math.floor(baseCount * 0.4);
    if (tier === 'BALANCED') return Math.floor(baseCount * 0.7);
    return baseCount;
  }, [tier]);

  if (hasReducedMotion || !hasWebGL) {
    return (
      <div className="hero-starfield hero-starfield-static">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-black to-indigo-950/20" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="hero-starfield">
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <StarsField isLoading={isLoading} starCount={starCount} tier={tier} onPhaseChange={onPhaseChange} />
        </Suspense>
      </Canvas>
    </div>
  );
}
