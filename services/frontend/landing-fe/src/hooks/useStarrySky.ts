import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarData {
    position: THREE.Vector3;
    originalPosition: THREE.Vector3;
    speed: number;
    size: number;
    depth: number;
}

interface UseStarryAnimationOptions {
    starCount?: number;
    warpDuration?: number;
    slowdownRate?: number;
    starSpeed?: number;
    loadingDelay?: number;
}

export const useStarryAnimation = (options: UseStarryAnimationOptions = {}) => {
    const {
        starCount = 4500,
        warpDuration = 1.5,
        slowdownRate = 0.93,
        starSpeed = 120,
        loadingDelay = 1000,
    } = options;

    const pointsRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const [phase, setPhase] = useState<'warp' | 'slowing' | 'stopped'>('warp');
    const [isLoaded, setIsLoaded] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);
    const mouseRef = useRef({ x: 0, y: 0 });
    const timeRef = useRef(0);
    const speedMultiplier = useRef(1);
    const lineToCircleProgress = useRef(0);

    // Memoize star data and textures - this prevents recreation on re-renders
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

    // Handle loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, loadingDelay);

        return () => clearTimeout(timer);
    }, [loadingDelay]);

    // Mouse move handler - stable reference
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

    // Animation frame logic
    useFrame((_state, delta) => {
        if (!pointsRef.current || !linesRef.current) return;

        timeRef.current += delta;

        const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const linePositionsArray = linesRef.current.geometry.attributes.position.array as Float32Array;

        // Phase transitions
        if (phase === 'warp' && timeRef.current > warpDuration) {
            setPhase('slowing');
        }

        if (phase === 'slowing') {
            speedMultiplier.current *= slowdownRate;
            lineToCircleProgress.current = Math.min(lineToCircleProgress.current + delta * 1.5, 1);

            if (speedMultiplier.current < 0.02) {
                setPhase('stopped');
                setTimeout(() => {
                    setAnimationComplete(true);
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
                star.position.z += delta * starSpeed * star.speed * speed;

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

    return {
        pointsRef,
        linesRef,
        positions,
        colors,
        linePositions,
        starTexture,
        starCount,
        isLoaded,
        animationComplete,
    };
};