/**
 * Purpose: Custom cursor with smooth magnetic tracking effect.
 * Exports: default MagneticCursor (React component)
 * Side effects: Adds global mousemove listener; renders custom cursor elements.
 *
 * Features a dot (follows cursor instantly) and ring (follows with lerp delay).
 * Expands when hovering clickable elements. Disabled on touch devices and
 * when user prefers reduced motion.
 */

import { useEffect, useRef, useState } from 'react';
import { useMotion } from '@/hooks/useMotion';
import './MagneticCursor.css';

interface MagneticCursorProps {
  visible?: boolean;
}

export default function MagneticCursor({ visible = true }: MagneticCursorProps) {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const { shouldReduceMotion } = useMotion();

  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);

  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const dotPosRef = useRef({ x: 0, y: 0 });

  const LERP_FACTOR = 0.15;

  useEffect(() => {
    if (shouldReduceMotion) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      if (isHidden) {
        setIsHidden(false);
        posRef.current = { x: e.clientX, y: e.clientY };
        dotPosRef.current = { x: e.clientX, y: e.clientY };
      }

      let target = e.target as HTMLElement;
      if (target.nodeType === Node.TEXT_NODE && target.parentElement) {
        target = target.parentElement;
      }

      if (!(target instanceof Element)) return;

      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.onclick !== null ||
        target.classList.contains('magnetic') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsPointer(prev => {
        if (prev !== isClickable) return !!isClickable;
        return prev;
      });
    };

    const handleMouseLeave = () => setIsHidden(true);

    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * LERP_FACTOR;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * LERP_FACTOR;
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
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isHidden, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div className={`magnetic-cursor ${isPointer ? 'pointer' : ''} ${isHidden || !visible ? 'hidden' : ''}`}>
      <div ref={cursorDot} className="cursor-dot" style={{ transform: 'translate3d(-100px, -100px, 0)' }} />
      <div ref={cursorRing} className="cursor-ring" style={{ transform: 'translate3d(-100px, -100px, 0)' }} />
    </div>
  );
}