import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Loader } from '../common/loading';

interface StarData {
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  speed: number;
  size: number;
  depth: number;
}

const StarsField = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const [phase, setPhase] = useState<'warp' | 'slowing' | 'stopped'>('warp');
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const speedMultiplier = useRef(1);
  const lineToCircleProgress = useRef(0);

  const starCount = 4500;

  const { stars, positions, colors, linePositions, starTexture } = useMemo(() => {
    const stars: StarData[] = [];
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const linePositions = new Float32Array(starCount * 6);

    // Create star texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(0.6, 'rgba(200, 220, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const starTexture = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = Math.random() * 200 - 100;

      const originalPosition = new THREE.Vector3(x, y, z);
      const position = originalPosition.clone();
      const depth = (z + 100) / 200;
      const size = Math.random() * 0.4 + 0.15;
      const speed = Math.random() * 0.5 + 0.5;

      stars.push({
        position,
        originalPosition,
        speed,
        size,
        depth
      });

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // White to light blue colors
      const colorVariation = Math.random() * 0.3;
      colors[i * 3] = 0.9 + colorVariation;
      colors[i * 3 + 1] = 0.95 + colorVariation * 0.5;
      colors[i * 3 + 2] = 1;

      // Initialize line positions
      linePositions[i * 6] = x;
      linePositions[i * 6 + 1] = y;
      linePositions[i * 6 + 2] = z;
      linePositions[i * 6 + 3] = x;
      linePositions[i * 6 + 4] = y;
      linePositions[i * 6 + 5] = z - 20;
    }

    return { stars, positions, colors, linePositions, starTexture };
  }, [starCount]);

  useEffect(() => {
    // Attach BufferAttributes programmatically so TS doesn't require the JSX `args` prop
    if (pointsRef.current) {
      const geom = pointsRef.current.geometry as THREE.BufferGeometry;
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }

    if (linesRef.current) {
      const geom = linesRef.current.geometry as THREE.BufferGeometry;
      geom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    }
    // positions/colors/linePositions are stable (from useMemo), but include them
    // so the attributes are reattached if starCount changes.
  }, [positions, colors, linePositions]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((_state, delta) => {
    if (!pointsRef.current || !linesRef.current) return;

    timeRef.current += delta;

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const linePositionsArray = linesRef.current.geometry.attributes.position.array as Float32Array;

    // Phase transitions
    if (phase === 'warp' && timeRef.current > 1.5) {
      setPhase('slowing');
    }

    if (phase === 'slowing') {
      speedMultiplier.current *= 0.93;
      lineToCircleProgress.current = Math.min(lineToCircleProgress.current + delta * 1.5, 1);

      if (speedMultiplier.current < 0.02) {
        setPhase('stopped');
        setTimeout(() => {
          onAnimationComplete();
        }, 600);
      }
    }

    // Parallax effect
    const parallaxX = mouseRef.current.x * 2;
    const parallaxY = mouseRef.current.y * 2;

    stars.forEach((star, i) => {
      if (phase === 'warp' || phase === 'slowing') {
        // Move stars forward
        const speed = phase === 'warp' ? 1 : speedMultiplier.current;
        star.position.z += delta * 120 * star.speed * speed;

        if (star.position.z > 50) {
          star.position.z = -100;
          star.originalPosition.z = star.position.z;
        }

        // Update line positions with morphing effect
        const streakLength = 20 * (1 - lineToCircleProgress.current);
        linePositionsArray[i * 6] = star.position.x;
        linePositionsArray[i * 6 + 1] = star.position.y;
        linePositionsArray[i * 6 + 2] = star.position.z;
        linePositionsArray[i * 6 + 3] = star.position.x;
        linePositionsArray[i * 6 + 4] = star.position.y;
        linePositionsArray[i * 6 + 5] = star.position.z - streakLength;
      } else {
        // Parallax effect when stopped
        const parallaxFactor = star.depth * 0.5;
        star.position.x = star.originalPosition.x + parallaxX * parallaxFactor;
        star.position.y = star.originalPosition.y + parallaxY * parallaxFactor;
      }

      // Update point positions
      positionsArray[i * 3] = star.position.x;
      positionsArray[i * 3 + 1] = star.position.y;
      positionsArray[i * 3 + 2] = star.position.z;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    // Line opacity fades as they morph to circles
    const lineMaterial = linesRef.current.material as THREE.LineBasicMaterial;
    lineMaterial.opacity = phase === 'stopped' ? 0 : 0.5 * (1 - lineToCircleProgress.current);

    // Points become visible as lines fade
    const pointMaterial = pointsRef.current.material as THREE.PointsMaterial;
    pointMaterial.opacity = 0.3 + lineToCircleProgress.current * 0.6;
  });

  return (
    <>
      {/* Points (circles) */}
      <points ref={pointsRef}>
        <bufferGeometry />         {/* attributes are set in useEffect */}
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.3}
          map={starTexture}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Lines (streaks) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />         {/* attributes are set in useEffect */}
        <lineBasicMaterial
          color={0xaaccff}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
};

export default function StarrySkyHero({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const [showText, setShowText] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {!isLoaded && <Loader />}

      {/* Dark gradient with nebula glares */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      {/* Nebula glares */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '5s', animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '5.5s', animationDelay: '0.5s' }} />

      {isLoaded && (
        <Canvas
          camera={{ position: [0, 0, 30], fov: 75 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <StarsField onAnimationComplete={() => {
              onAnimationComplete();
              setShowText(true);
            }} />
          </Suspense>
        </Canvas>
      )}

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          className={`text-4xl md:text-9xl font-bold text-white tracking-wider transition-all duration-1000 ${showText ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          style={{
            textShadow: '0 0 12px rgba(255, 255, 255, 0.8), 0 0 40px rgba(147, 197, 253, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 900
          }}
        >
          IEEE RIT-B
        </h1>
      </div>
    </div>
  );
}