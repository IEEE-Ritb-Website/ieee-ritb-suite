import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * NebulaClouds Component - OPTIMIZED
 * Creates volumetric fog layers with subtle color gradients
 * Features:
 * - Multi-layered depth effect
 * - Slow parallax movement
 * - IEEE color palette (blues, purples, pinks)
 * - Semi-transparent, doesn't obstruct stars
 * - Creates ethereal space atmosphere
 * - PERFORMANCE: Async texture generation, cached textures, Perlin-like noise
 */

// Texture cache to prevent regeneration on re-renders
const textureCache = new Map<string, THREE.CanvasTexture>();

// Simple 2D Perlin-like noise (faster than canvas loop)
function noise2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, seed: number): number {
  const corners = (noise2D(x - 1, y - 1, seed) + noise2D(x + 1, y - 1, seed) +
                   noise2D(x - 1, y + 1, seed) + noise2D(x + 1, y + 1, seed)) / 16;
  const sides = (noise2D(x - 1, y, seed) + noise2D(x + 1, y, seed) +
                 noise2D(x, y - 1, seed) + noise2D(x, y + 1, seed)) / 8;
  const center = noise2D(x, y, seed) / 4;
  return corners + sides + center;
}

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

  // Async texture generation function
  const generateNebulaTexture = async (
    color: { r: number; g: number; b: number; name: string },
    index: number
  ): Promise<THREE.CanvasTexture> => {
    const cacheKey = `nebula-${color.name}-${index}`;

    // Return cached texture if available
    if (textureCache.has(cacheKey)) {
      return textureCache.get(cacheKey)!;
    }

    // Generate texture asynchronously
    return new Promise((resolve) => {
      requestIdleCallback(() => {
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

          // Optimized: Use Perlin-like noise instead of random loop
          const noiseScale = 0.02;
          const imageData = ctx.getImageData(0, 0, 512, 512);
          const data = imageData.data;

          for (let y = 0; y < 512; y += 2) { // Step by 2 for performance
            for (let x = 0; x < 512; x += 2) {
              const noiseValue = smoothNoise(x * noiseScale, y * noiseScale, index);
              const alpha = Math.floor(noiseValue * 100); // 0-100 range

              const idx = (y * 512 + x) * 4;
              data[idx] = color.r * 255;
              data[idx + 1] = color.g * 255;
              data[idx + 2] = color.b * 255;
              data[idx + 3] = alpha;

              // Fill adjacent pixel for efficiency
              if (x < 511 && y < 511) {
                const idx2 = ((y + 1) * 512 + (x + 1)) * 4;
                data[idx2] = data[idx];
                data[idx2 + 1] = data[idx + 1];
                data[idx2 + 2] = data[idx + 2];
                data[idx2 + 3] = data[idx + 3];
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        // Cache the texture
        textureCache.set(cacheKey, texture);

        resolve(texture);
      });
    });
  };

  // Create nebula textures and layers asynchronously
  useEffect(() => {
    if (!enabled) return;

    // Capture ref value for cleanup
    const group = groupRef.current;

    const colors = [
      { r: 0.3, g: 0.4, b: 1.0, name: 'blue' },      // IEEE blue
      { r: 0.6, g: 0.3, b: 0.9, name: 'purple' },    // Purple
      { r: 0.2, g: 0.6, b: 0.8, name: 'cyan' },      // Cyan
    ];

    const loadLayers = async () => {
      const layers: CloudLayer[] = [];

      for (let i = 0; i < layerCount; i++) {
        const color = colors[i % colors.length];

        // Generate texture asynchronously
        const texture = await generateNebulaTexture(color, i);

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
    };

    loadLayers();

    // Cleanup function
    return () => {
      layersRef.current.forEach(layer => {
        layer.mesh.geometry.dispose();
        if (layer.mesh.material instanceof THREE.MeshBasicMaterial) {
          const material = layer.mesh.material;
          // Don't dispose cached textures
          material.dispose();
        }
        group?.remove(layer.mesh);
      });
      layersRef.current = [];
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
