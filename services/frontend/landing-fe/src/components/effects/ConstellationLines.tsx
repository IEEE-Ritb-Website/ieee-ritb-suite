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
  const fadeInProgress = useRef(0); // For smooth appearance transition

  // Optimized: Generate connection pairs using spatial grid partitioning
  // Reduces complexity from O(n²) to O(n) with grid-based neighbor lookup
  const connectionPairs = useMemo(() => {
    const pairs: [number, number][] = [];
    const connectionsCount = new Map<number, number>();

    // Create spatial grid for fast neighbor lookup
    const gridSize = maxDistance * 1.5;
    const grid = new Map<string, number[]>();

    // Populate grid with star indices
    stars.forEach((star, index) => {
      const gridX = Math.floor(star.position.x / gridSize);
      const gridY = Math.floor(star.position.y / gridSize);
      const gridZ = Math.floor(star.position.z / gridSize);
      const key = `${gridX},${gridY},${gridZ}`;

      if (!grid.has(key)) {
        grid.set(key, []);
      }
      grid.get(key)!.push(index);
    });

    // Check only stars in neighboring grid cells
    for (let i = 0; i < stars.length; i++) {
      if ((connectionsCount.get(i) || 0) >= maxConnections) continue;

      const star = stars[i];
      const gridX = Math.floor(star.position.x / gridSize);
      const gridY = Math.floor(star.position.y / gridSize);
      const gridZ = Math.floor(star.position.z / gridSize);

      // Check 27 neighboring cells (3x3x3 cube around current cell)
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const neighborKey = `${gridX + dx},${gridY + dy},${gridZ + dz}`;
            const neighbors = grid.get(neighborKey) || [];

            for (const j of neighbors) {
              if (j <= i) continue; // Avoid duplicate pairs and self-connections
              if ((connectionsCount.get(j) || 0) >= maxConnections) continue;

              const distance = star.position.distanceTo(stars[j].position);

              if (distance < maxDistance) {
                pairs.push([i, j]);
                connectionsCount.set(i, (connectionsCount.get(i) || 0) + 1);
                connectionsCount.set(j, (connectionsCount.get(j) || 0) + 1);

                if ((connectionsCount.get(i) || 0) >= maxConnections) break;
              }
            }
            if ((connectionsCount.get(i) || 0) >= maxConnections) break;
          }
          if ((connectionsCount.get(i) || 0) >= maxConnections) break;
        }
        if ((connectionsCount.get(i) || 0) >= maxConnections) break;
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
  // Optimized: Only update when phase is 'stopped' (parallax active)
  const prevStarsRef = useRef(stars);

  useEffect(() => {
    if (!lineSegmentsRef.current || phase !== 'stopped') return;

    // Skip if stars haven't moved (performance optimization)
    let starsChanged = false;
    for (let i = 0; i < Math.min(5, stars.length); i++) {
      if (!prevStarsRef.current[i] ||
          !stars[i].position.equals(prevStarsRef.current[i].position)) {
        starsChanged = true;
        break;
      }
    }

    if (!starsChanged) return;

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
    prevStarsRef.current = stars.map(s => ({ ...s, position: s.position.clone() }));
  }, [stars, connectionPairs, phase]);

  // Animate opacity - pulsing effect with smooth transitions
  useFrame((_state, delta) => {
    if (!lineSegmentsRef.current) return;

    timeRef.current += delta;

    const material = lineSegmentsRef.current.material as THREE.LineBasicMaterial;

    // Smooth fade-in when transitioning to stopped phase
    if (phase === 'stopped') {
      // Ease-in fade over 1.5 seconds
      fadeInProgress.current = Math.min(fadeInProgress.current + delta * 0.8, 1);

      // Smooth easing function (ease-out cubic)
      const easedProgress = 1 - Math.pow(1 - fadeInProgress.current, 3);

      // Pulsing effect combined with fade-in
      const pulseOpacity = 0.1 + Math.sin(timeRef.current * 0.8) * 0.08;
      material.opacity = pulseOpacity * easedProgress;
      material.visible = true;
    } else {
      // Fade out when transitioning away from stopped
      fadeInProgress.current = Math.max(fadeInProgress.current - delta * 2, 0);

      if (fadeInProgress.current > 0) {
        // Still visible during fade-out
        material.opacity = 0.15 * fadeInProgress.current;
        material.visible = true;
      } else {
        material.visible = false;
      }
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
