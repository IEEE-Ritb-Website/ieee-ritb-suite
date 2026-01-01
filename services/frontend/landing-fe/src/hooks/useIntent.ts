import { useState, useEffect, useRef } from 'react';

interface MouseState {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  speed: number;
}

/**
 * useIntent Hook
 * Tracks mouse velocity and provides "intent" detection logic.
 */
export function useIntent() {
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0, vx: 0, vy: 0, speed: 0 });
  const lastMouse = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastMouse.current.time;
      
      if (dt > 0) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        
        // Calculate velocity (pixels per millisecond)
        const vx = dx / dt;
        const vy = dy / dt;
        const speed = Math.sqrt(vx * vx + vy * vy);

        setMouse({
          x: e.clientX,
          y: e.clientY,
          vx,
          vy,
          speed
        });

        lastMouse.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /**
   * Returns true if the mouse is moving toward a target rectangle 
   * with high speed.
   */
  const isMovingToward = (rect: DOMRect, threshold = 0.5) => {
    if (mouse.speed < threshold) return false;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Vector from mouse to center of target
    const targetDx = centerX - mouse.x;
    const targetDy = centerY - mouse.y;

    // Normalize target vector
    const mag = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
    if (mag === 0) return false;
    
    const dirToTargetX = targetDx / mag;
    const dirToTargetY = targetDy / mag;

    // Normalize velocity vector
    const vMag = mouse.speed;
    const dirVX = mouse.vx / vMag;
    const dirVY = mouse.vy / vMag;

    // Dot product to see if velocity vector aligns with direction to target
    const dot = dirVX * dirToTargetX + dirVY * dirToTargetY;

    // If dot product > 0.8, user is moving within a ~36 degree cone toward the target
    // and distance must be reasonable (e.g., within 300px)
    return dot > 0.8 && mag < 400;
  };

  return { mouse, isMovingToward };
}
