
import React, { useRef, useEffect } from 'react';
import './GenerativeConstellation.css';
import { getDeviceCapabilities, prefersReducedMotion } from '@/utils/deviceDetection';

interface Props {
  isLoading: boolean;
}

// Helper to convert hex/rgb to rgba
const toRgba = (cssVar: string, alpha: number = 1) => {
  if (!cssVar) return `rgba(255, 255, 255, ${alpha})`;
  if (cssVar.startsWith('#')) {
    const r = parseInt(cssVar.slice(1, 3), 16);
    const g = parseInt(cssVar.slice(3, 5), 16);
    const b = parseInt(cssVar.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (cssVar.startsWith('rgb')) {
    return cssVar.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
  return `rgba(255, 255, 255, ${alpha})`; // Fallback
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

  useEffect(() => {
    if (isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const computedStyle = getComputedStyle(canvas);
    colors.current.particle = computedStyle.getPropertyValue('--particle-color').trim();
    colors.current.line = computedStyle.getPropertyValue('--line-color').trim();

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
        let angle = Math.atan2(dy, dx);

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
        ctx.fillStyle = toRgba(colors.current.particle, 0.8);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < MAX_LINK_DISTANCE) {
            const opacity = 1 - dist / MAX_LINK_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = toRgba(colors.current.line, opacity * 0.5);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
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
