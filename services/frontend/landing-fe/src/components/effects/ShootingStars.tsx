import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ShootingStars Component
 * Creates realistic meteor streaks across the star field
 * Features:
 * - Random spawn positions and trajectories
 * - Varying speeds and trail lengths
 * - IEEE blue glow effect
 * - Particle burst on completion
 * - Performance optimized with object pooling
 */

interface ShootingStar {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  speed: number;
  trailLength: number;
  brightness: number;
  lifetime: number;
  maxLifetime: number;
  isActive: boolean;
}

interface ShootingStarsProps {
  count?: number;
  spawnInterval?: number; // seconds between spawns
}

const ShootingStars = ({ count = 3, spawnInterval = 5 }: ShootingStarsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const linesRef = useRef<THREE.LineSegments[]>([]);
  const burstParticlesRef = useRef<THREE.Points[]>([]);
  const spawnTimerRef = useRef(0);

  // Material for shooting star trails
  const trailMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(0x4d7fff), // IEEE blue
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    });
  }, []);

  // Material for burst particles
  const burstMaterial = useMemo(() => {
    // Create spark texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(77, 127, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(77, 127, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(77, 127, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }

    const texture = new THREE.CanvasTexture(canvas);

    return new THREE.PointsMaterial({
      size: 0.3,
      map: texture,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Initialize shooting star pool
  useEffect(() => {
    const stars: ShootingStar[] = [];
    const lines: THREE.LineSegments[] = [];
    const bursts: THREE.Points[] = [];

    for (let i = 0; i < count; i++) {
      // Create shooting star object
      const star: ShootingStar = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        speed: 0,
        trailLength: 0,
        brightness: 0,
        lifetime: 0,
        maxLifetime: 0,
        isActive: false,
      };

      // Create line for trail
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(6); // 2 points
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const line = new THREE.LineSegments(geometry, trailMaterial);
      line.visible = false;
      groupRef.current?.add(line);
      lines.push(line);

      // Create burst particle system
      const burstGeometry = new THREE.BufferGeometry();
      const burstCount = 20;
      const burstPositions = new Float32Array(burstCount * 3);
      burstGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(burstPositions, 3)
      );
      const burst = new THREE.Points(burstGeometry, burstMaterial);
      burst.visible = false;
      groupRef.current?.add(burst);
      bursts.push(burst);

      stars.push(star);
    }

    shootingStarsRef.current = stars;
    linesRef.current = lines;
    burstParticlesRef.current = bursts;

    // Cleanup
    return () => {
      lines.forEach(line => {
        line.geometry.dispose();
        groupRef.current?.remove(line);
      });
      bursts.forEach(burst => {
        burst.geometry.dispose();
        groupRef.current?.remove(burst);
      });
    };
  }, [count, trailMaterial, burstMaterial]);

  // Spawn a new shooting star
  const spawnShootingStar = (index: number) => {
    const star = shootingStarsRef.current[index];
    if (!star) return;

    // Random starting position (off-screen)
    const side = Math.random();
    if (side < 0.5) {
      // Top-left to bottom-right
      star.position.set(
        -150 + Math.random() * 100,
        80 + Math.random() * 40,
        -50 + Math.random() * 100
      );
      star.velocity.set(
        60 + Math.random() * 40,
        -50 - Math.random() * 30,
        20 + Math.random() * 20
      );
    } else {
      // Top-right to bottom-left
      star.position.set(
        50 + Math.random() * 100,
        80 + Math.random() * 40,
        -50 + Math.random() * 100
      );
      star.velocity.set(
        -60 - Math.random() * 40,
        -50 - Math.random() * 30,
        20 + Math.random() * 20
      );
    }

    star.speed = 0.8 + Math.random() * 0.4;
    star.trailLength = 15 + Math.random() * 10;
    star.brightness = 0.6 + Math.random() * 0.4;
    star.lifetime = 0;
    star.maxLifetime = 2 + Math.random() * 1.5; // 2-3.5 seconds
    star.isActive = true;

    linesRef.current[index].visible = true;
  };

  // Trigger burst effect
  const triggerBurst = (position: THREE.Vector3, index: number) => {
    const burst = burstParticlesRef.current[index];
    if (!burst) return;

    const positions = burst.geometry.attributes.position.array as Float32Array;
    const burstCount = positions.length / 3;

    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      positions[i * 3] = position.x + Math.cos(angle) * radius;
      positions[i * 3 + 1] = position.y + Math.sin(angle) * radius;
      positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 2;
    }

    burst.geometry.attributes.position.needsUpdate = true;
    burst.visible = true;

    // Fade out burst over time
    setTimeout(() => {
      burst.visible = false;
    }, 500);
  };

  // Animation loop
  useFrame((_state, delta) => {
    // Spawn timer
    spawnTimerRef.current += delta;
    if (spawnTimerRef.current >= spawnInterval) {
      // Find inactive star and spawn it
      const inactiveIndex = shootingStarsRef.current.findIndex(s => !s.isActive);
      if (inactiveIndex !== -1) {
        spawnShootingStar(inactiveIndex);
      }
      spawnTimerRef.current = 0;
    }

    // Update each shooting star
    shootingStarsRef.current.forEach((star, index) => {
      if (!star.isActive) return;

      star.lifetime += delta;

      // Check if star should be deactivated
      if (star.lifetime >= star.maxLifetime) {
        star.isActive = false;
        linesRef.current[index].visible = false;
        triggerBurst(star.position.clone(), index);
        return;
      }

      // Update position
      star.position.add(
        star.velocity.clone().multiplyScalar(delta * star.speed)
      );

      // Update trail line
      const line = linesRef.current[index];
      const positions = line.geometry.attributes.position.array as Float32Array;

      // Head of trail
      positions[0] = star.position.x;
      positions[1] = star.position.y;
      positions[2] = star.position.z;

      // Tail of trail
      const trailDir = star.velocity.clone().normalize().multiplyScalar(-star.trailLength);
      positions[3] = star.position.x + trailDir.x;
      positions[4] = star.position.y + trailDir.y;
      positions[5] = star.position.z + trailDir.z;

      line.geometry.attributes.position.needsUpdate = true;

      // Fade in/out based on lifetime
      const fadeTime = 0.3;
      let opacity = star.brightness;
      if (star.lifetime < fadeTime) {
        opacity *= star.lifetime / fadeTime;
      } else if (star.lifetime > star.maxLifetime - fadeTime) {
        opacity *= (star.maxLifetime - star.lifetime) / fadeTime;
      }
      (line.material as THREE.LineBasicMaterial).opacity = opacity;
    });

    // Animate burst particles (fade and expand)
    burstParticlesRef.current.forEach(burst => {
      if (!burst.visible) return;

      const material = burst.material as THREE.PointsMaterial;
      material.opacity = Math.max(0, material.opacity - delta * 2);
      material.size += delta * 0.5;

      if (material.opacity <= 0) {
        burst.visible = false;
        material.opacity = 1;
        material.size = 0.3;
      }
    });
  });

  return <group ref={groupRef} />;
};

export default ShootingStars;
