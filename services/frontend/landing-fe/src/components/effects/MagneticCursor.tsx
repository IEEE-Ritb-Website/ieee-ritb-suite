import { useEffect, useRef, useState } from 'react';
import './MagneticCursor.css';

export default function MagneticCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  
  // Refs for DOM elements
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  
  // Refs for animation state (mutable without re-renders)
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 }); // Ring position (smooth)
  const dotPosRef = useRef({ x: 0, y: 0 }); // Dot position (fast)
  
  // Configuration
  const LERP_FACTOR = 0.15; // Smoothness of the ring (lower = slower)
  
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Only enable on desktop (not touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      if (isHidden) {
        setIsHidden(false);
        // Instant teleport on first appearance
        posRef.current = { x: e.clientX, y: e.clientY };
        dotPosRef.current = { x: e.clientX, y: e.clientY };
      }

      // Check if hovering over clickable element
      let target = e.target as HTMLElement;
      
      // Handle text nodes
      if (target.nodeType === Node.TEXT_NODE && target.parentElement) {
        target = target.parentElement;
      }
      
      // Ensure target is an Element
      if (!(target instanceof Element)) return;

      // Use composedPath to handle shadow DOM if needed, or simple traversal
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.onclick !== null ||
        target.classList.contains('magnetic') ||
        window.getComputedStyle(target).cursor === 'pointer';

      // Only update state if changed to avoid re-renders
      setIsPointer(prev => {
        if (prev !== isClickable) return !!isClickable;
        return prev;
      });
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const animate = () => {
      // Smooth interpolation for the ring
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * LERP_FACTOR;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * LERP_FACTOR;
      
      // Dot follows instantly (or very fast)
      dotPosRef.current = mouseRef.current;

      if (cursorRing.current) {
        cursorRing.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      if (cursorDot.current) {
        cursorDot.current.style.transform = `translate3d(${dotPosRef.current.x}px, ${dotPosRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isHidden]);

  return (
    <div className={`magnetic-cursor ${isPointer ? 'pointer' : ''} ${isHidden ? 'hidden' : ''}`}>
      <div
        ref={cursorDot}
        className="cursor-dot"
        style={{
          // Initial position off-screen or handled by JS
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />
      <div
        ref={cursorRing}
        className="cursor-ring"
        style={{
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />
    </div>
  );
}
