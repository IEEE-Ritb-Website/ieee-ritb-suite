import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * NebulaClouds Component
 * Creates volumetric fog layers with subtle color gradients
 * Features:
 * - Multi-layered depth effect
 * - Slow parallax movement
 * - IEEE color palette (blues, purples, pinks)
 * - Semi-transparent, doesn't obstruct stars
 * - Creates ethereal space atmosphere
 */

interface CloudLayer {
  mesh: THREE.Mesh;
  speed: THREE.Vector2;
  phase: number;
}

interface NebulaCloudsProps {
  layerCount?: number;
  enabled?: boolean;
}

const NebulaClouds = ({ layerCount = 3, enabled = true }: NebulaCloudsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const layersRef = useRef<CloudLayer[]>([]);

  // Create nebula textures and layers
  useMemo(() => {
    if (!enabled) return;

    const layers: CloudLayer[] = [];
    const colors = [
      { r: 0.3, g: 0.4, b: 1.0, name: 'blue' },      // IEEE blue
      { r: 0.6, g: 0.3, b: 0.9, name: 'purple' },    // Purple
      { r: 0.2, g: 0.6, b: 0.8, name: 'cyan' },      // Cyan
    ];

    for (let i = 0; i < layerCount; i++) {
      const color = colors[i % colors.length];

      // Create cloud texture using canvas
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Create nebula-like gradient
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);

        gradient.addColorStop(0, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.15)`);
        gradient.addColorStop(0.3, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.1)`);
        gradient.addColorStop(0.6, `rgba(${color.r * 200}, ${color.g * 200}, ${color.b * 200}, 0.05)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        // Add some noise/texture
        for (let j = 0; j < 1000; j++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const size = Math.random() * 3;
          const opacity = Math.random() * 0.3;

          ctx.fillStyle = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${opacity})`;
          ctx.fillRect(x, y, size, size);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      // Create plane mesh
      const geometry = new THREE.PlaneGeometry(300, 300);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.4 - i * 0.1, // Further layers are more subtle
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Position layers at different depths
      mesh.position.z = -120 - i * 20;
      mesh.position.x = (Math.random() - 0.5) * 100;
      mesh.position.y = (Math.random() - 0.5) * 80;

      groupRef.current?.add(mesh);

      layers.push({
        mesh,
        speed: new THREE.Vector2(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.3
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }

    layersRef.current = layers;

    // Cleanup function
    return () => {
      layers.forEach(layer => {
        layer.mesh.geometry.dispose();
        if (layer.mesh.material instanceof THREE.MeshBasicMaterial) {
          const material = layer.mesh.material;
          if (material.map) material.map.dispose();
          material.dispose();
        }
        groupRef.current?.remove(layer.mesh);
      });
    };
  }, [layerCount, enabled]);

  // Animate clouds - subtle movement
  useFrame((state, delta) => {
    if (!enabled) return;

    layersRef.current.forEach((layer, index) => {
      // Slow floating movement
      layer.phase += delta * 0.1;

      layer.mesh.position.x += Math.sin(layer.phase) * layer.speed.x * delta;
      layer.mesh.position.y += Math.cos(layer.phase * 0.8) * layer.speed.y * delta;

      // Slow rotation
      layer.mesh.rotation.z += delta * 0.02 * (index % 2 === 0 ? 1 : -1);

      // Subtle opacity pulsing
      if (layer.mesh.material instanceof THREE.MeshBasicMaterial) {
        const baseOpacity = 0.4 - index * 0.1;
        layer.mesh.material.opacity =
          baseOpacity + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05;
      }
    });
  });

  if (!enabled) return null;

  return <group ref={groupRef} />;
};

export default NebulaClouds;
