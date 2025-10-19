import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ConstellationLines Component
 * Connects nearby stars with glowing lines to create dynamic constellations
 * Features:
 * - Dynamic line generation based on star proximity
 * - Pulsing IEEE blue gradient
 * - Performance optimized with distance threshold
 * - Creates "circuit board in space" aesthetic
 */

interface StarData {
  position: THREE.Vector3;
}

interface ConstellationLinesProps {
  stars: StarData[];
  maxDistance?: number; // Maximum distance to connect stars
  maxConnections?: number; // Max connections per star
  phase?: 'warp' | 'slowing' | 'stopped';
}

const ConstellationLines = ({
  stars,
  maxDistance = 30,
  maxConnections = 3,
  phase = 'stopped',
}: ConstellationLinesProps) => {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const timeRef = useRef(0);

  // Generate connection pairs based on proximity
  const connectionPairs = useMemo(() => {
    const pairs: [number, number][] = [];
    const connectionsCount = new Map<number, number>();

    for (let i = 0; i < stars.length; i++) {
      if ((connectionsCount.get(i) || 0) >= maxConnections) continue;

      for (let j = i + 1; j < stars.length; j++) {
        if ((connectionsCount.get(j) || 0) >= maxConnections) continue;

        const distance = stars[i].position.distanceTo(stars[j].position);

        if (distance < maxDistance) {
          pairs.push([i, j]);
          connectionsCount.set(i, (connectionsCount.get(i) || 0) + 1);
          connectionsCount.set(j, (connectionsCount.get(j) || 0) + 1);

          if ((connectionsCount.get(i) || 0) >= maxConnections) break;
        }
      }
    }

    return pairs;
  }, [stars, maxDistance, maxConnections]);

  // Create line geometry and material
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(connectionPairs.length * 6);
    const colors = new Float32Array(connectionPairs.length * 6);

    connectionPairs.forEach((pair, index) => {
      const [i, j] = pair;
      const star1 = stars[i];
      const star2 = stars[j];

      // Position data
      positions[index * 6] = star1.position.x;
      positions[index * 6 + 1] = star1.position.y;
      positions[index * 6 + 2] = star1.position.z;
      positions[index * 6 + 3] = star2.position.x;
      positions[index * 6 + 4] = star2.position.y;
      positions[index * 6 + 5] = star2.position.z;

      // IEEE blue gradient colors
      const color1 = new THREE.Color(0x4d7fff); // IEEE primary
      const color2 = new THREE.Color(0x6b8cff); // IEEE vivid

      colors[index * 6] = color1.r;
      colors[index * 6 + 1] = color1.g;
      colors[index * 6 + 2] = color1.b;
      colors[index * 6 + 3] = color2.r;
      colors[index * 6 + 4] = color2.g;
      colors[index * 6 + 5] = color2.b;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      linewidth: 1,
    });

    return { geometry, material };
  }, [connectionPairs, stars]);

  // Update line positions when stars move (parallax)
  useEffect(() => {
    if (!lineSegmentsRef.current) return;

    const positions = lineSegmentsRef.current.geometry.attributes
      .position.array as Float32Array;

    connectionPairs.forEach((pair, index) => {
      const [i, j] = pair;
      const star1 = stars[i];
      const star2 = stars[j];

      positions[index * 6] = star1.position.x;
      positions[index * 6 + 1] = star1.position.y;
      positions[index * 6 + 2] = star1.position.z;
      positions[index * 6 + 3] = star2.position.x;
      positions[index * 6 + 4] = star2.position.y;
      positions[index * 6 + 5] = star2.position.z;
    });

    lineSegmentsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Animate opacity - pulsing effect
  useFrame((_state, delta) => {
    if (!lineSegmentsRef.current) return;

    timeRef.current += delta;

    const material = lineSegmentsRef.current.material as THREE.LineBasicMaterial;

    // Only show when animation is stopped
    if (phase === 'stopped') {
      // Pulsing effect
      const pulseOpacity = 0.1 + Math.sin(timeRef.current * 0.8) * 0.08;
      material.opacity = pulseOpacity;
      material.visible = true;
    } else {
      // Hide during warp/slowing
      material.visible = false;
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <lineSegments ref={lineSegmentsRef} geometry={geometry} material={material} />
  );
};

export default ConstellationLines;
