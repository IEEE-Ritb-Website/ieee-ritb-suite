import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SpaceDust Component
 * Creates tiny floating particles that catch light from nearby stars
 * Features:
 * - Subtle, adds micro-detail to the scene
 * - Very lightweight (100-200 particles)
 * - Slow drifting movement
 * - Fades based on distance from camera
 * - Uses instanced rendering for performance
 */

interface SpaceDustProps {
  count?: number;
  enabled?: boolean;
}

const SpaceDust = ({ count = 150, enabled = true }: SpaceDustProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 3));
  const timeRef = useRef(0);

  // Create dust particles
  const { geometry, material, texture } = useMemo(() => {
    // Create tiny particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gradient = ctx.createRadialGradient(4, 4, 0, 4, 4, 4);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 8, 8);
    }

    const texture = new THREE.CanvasTexture(canvas);

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random positions in a large volume
      positions[i * 3] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 2] = Math.random() * 150 - 100;

      // Subtle color tint (mostly white/blue)
      const colorVar = 0.9 + Math.random() * 0.1;
      colors[i * 3] = colorVar;
      colors[i * 3 + 1] = colorVar * 0.95;
      colors[i * 3 + 2] = 1;

      // Vary sizes
      sizes[i] = 0.05 + Math.random() * 0.08;

      // Random velocities (very slow)
      velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.3;
      velocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create material
    const material = new THREE.PointsMaterial({
      size: 0.08,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry, material, texture };
  }, [count]);

  // Animate dust particles
  useFrame((_state, delta) => {
    if (!enabled || !pointsRef.current) return;

    timeRef.current += delta;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Apply velocity
      positions[i * 3] += velocitiesRef.current[i * 3] * delta;
      positions[i * 3 + 1] += velocitiesRef.current[i * 3 + 1] * delta;
      positions[i * 3 + 2] += velocitiesRef.current[i * 3 + 2] * delta;

      // Add subtle wave motion
      positions[i * 3 + 1] += Math.sin(timeRef.current + i * 0.1) * 0.01;

      // Wrap particles that go too far
      if (Math.abs(positions[i * 3]) > 150) {
        positions[i * 3] = -Math.sign(positions[i * 3]) * 150;
      }
      if (Math.abs(positions[i * 3 + 1]) > 150) {
        positions[i * 3 + 1] = -Math.sign(positions[i * 3 + 1]) * 150;
      }
      if (positions[i * 3 + 2] > 50 || positions[i * 3 + 2] < -100) {
        positions[i * 3 + 2] = -100;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Subtle opacity pulsing
    (pointsRef.current.material as THREE.PointsMaterial).opacity =
      0.3 + Math.sin(timeRef.current * 0.5) * 0.15;
  });

  // Cleanup
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [geometry, material, texture]);

  if (!enabled) return null;

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export default SpaceDust;
