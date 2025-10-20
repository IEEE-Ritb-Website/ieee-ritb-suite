
import React, { useRef, useEffect } from 'react';
import './GenerativeConstellation.css';
import { getDeviceCapabilities, prefersReducedMotion } from '@/utils/deviceDetection';

interface Props {
  isLoading: boolean;
}

// Cached rgba conversion results (PERFORMANCE FIX)
const rgbaCache = new Map<string, { r: number; g: number; b: number }>();

// Optimized: Parse CSS color once, cache RGB values
const parseColor = (cssVar: string): { r: number; g: number; b: number } => {
  if (rgbaCache.has(cssVar)) {
    return rgbaCache.get(cssVar)!;
  }

  let r = 255, g = 255, b = 255;

  if (cssVar.startsWith('#')) {
    r = parseInt(cssVar.slice(1, 3), 16);
    g = parseInt(cssVar.slice(3, 5), 16);
    b = parseInt(cssVar.slice(5, 7), 16);
  } else if (cssVar.startsWith('rgb')) {
    const match = cssVar.match(/\d+/g);
    if (match) {
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    }
  }

  const result = { r, g, b };
  rgbaCache.set(cssVar, result);
  return result;
};

const getOptimalParticleCount = (): number => {
  const capabilities = getDeviceCapabilities();
  if (capabilities.isMobile) return capabilities.isLowEndDevice ? 25 : 40;
  if (capabilities.isTablet) return capabilities.isLowEndDevice ? 50 : 75;
  if (capabilities.isLowEndDevice) return 80;
  return capabilities.hardwareConcurrency >= 8 ? 150 : 100;
};

const GenerativeConstellation: React.FC<Props> = ({ isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const mouse = useRef({ x: -1000, y: -1000, down: false });
  const colors = useRef({ particle: '', line: '' });
  const parsedColors = useRef<{ particle: { r: number; g: number; b: number }; line: { r: number; g: number; b: number } } | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const computedStyle = getComputedStyle(canvas);
    colors.current.particle = computedStyle.getPropertyValue('--particle-color').trim();
    colors.current.line = computedStyle.getPropertyValue('--line-color').trim();

    // Parse colors once and cache (PERFORMANCE FIX)
    parsedColors.current = {
      particle: parseColor(colors.current.particle),
      line: parseColor(colors.current.line),
    };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const PARTICLE_COUNT = getOptimalParticleCount();
    const MAX_LINK_DISTANCE = Math.min(rect.width, rect.height) / 5;
    const INTERACTION_RADIUS = MAX_LINK_DISTANCE * 1.2;
    const DAMPING = 0.95;
    const reducedMotion = prefersReducedMotion();

    let particles: {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      originalVx: number; originalVy: number;
    }[] = [];

    const init = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const vx = Math.random() * 0.4 - 0.2;
        const vy = Math.random() * 0.4 - 0.2;
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: vx, vy: vy,
          originalVx: vx, originalVy: vy,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.hypot(dx, dy);
        let force = 0;
        const angle = Math.atan2(dy, dx);

        if (dist < INTERACTION_RADIUS) {
          if (mouse.current.down) { force = -0.05 * (1 - dist / INTERACTION_RADIUS); }
          else { force = 0.5 * (1 - dist / INTERACTION_RADIUS); }
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.vx += (p.originalVx - p.vx) * 0.01;
        p.vy += (p.originalVy - p.vy) * 0.01;

        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = rect.width;
          if (p.x > rect.width) p.x = 0;
          if (p.y < 0) p.y = rect.height;
          if (p.y > rect.height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Use cached parsed colors (PERFORMANCE FIX)
        if (parsedColors.current) {
          const { r, g, b } = parsedColors.current.particle;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
        }
        ctx.fill();
      });

      // Optimized: Use spatial grid for line connections (reduce from O(n²))
      if (parsedColors.current) {
        const gridSize = MAX_LINK_DISTANCE;
        const grid = new Map<string, typeof particles>();

        // Populate grid
        particles.forEach(p => {
          const gridX = Math.floor(p.x / gridSize);
          const gridY = Math.floor(p.y / gridSize);
          const key = `${gridX},${gridY}`;
          if (!grid.has(key)) grid.set(key, []);
          grid.get(key)!.push(p);
        });

        // Check only nearby particles
        particles.forEach(p => {
          const gridX = Math.floor(p.x / gridSize);
          const gridY = Math.floor(p.y / gridSize);

          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const key = `${gridX + dx},${gridY + dy}`;
              const neighbors = grid.get(key) || [];

              neighbors.forEach(q => {
                if (p === q || !parsedColors.current) return;
                const dist = Math.hypot(p.x - q.x, p.y - q.y);
                if (dist < MAX_LINK_DISTANCE) {
                  const opacity = 1 - dist / MAX_LINK_DISTANCE;
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(q.x, q.y);
                  const { r, g, b } = parsedColors.current.line;
                  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`;
                  ctx.lineWidth = 0.8;
                  ctx.stroke();
                }
              });
            }
          }
        });
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const handleMouseDown = () => { mouse.current.down = true; };
    const handleMouseUp = () => { mouse.current.down = false; };
    const handleMouseLeave = () => { 
        mouse.current.x = -1000;
        mouse.current.y = -1000;
        mouse.current.down = false; 
    };

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      init();
    };

    init();
    animate();

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLoading]);

  return <canvas ref={canvasRef} className="generative-constellation" aria-hidden="true" />;
};

export default GenerativeConstellation;
