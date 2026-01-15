import { useState, useEffect, useRef } from 'react';
import './GlitchText.css';

/**
 * GlitchText Component
 * Creates matrix-style text scrambling and glitch effects
 * Features:
 * - Character cycling/scrambling
 * - Lock-in animation
 * - IEEE themed colors
 * - Customizable glitch intensity
 * - Can be used for loading text or hero reveals
 */

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchDuration?: number; // milliseconds
  lockInDelay?: number; // delay before locking in each character (ms)
  isActive?: boolean; // Control when to start glitching
  onComplete?: () => void;
  style?: 'loading' | 'hero'; // Different visual styles
}

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░!@#$%^&*';

const GlitchText = ({
  text,
  className = '',
  glitchDuration = 2000,
  lockInDelay = 100,
  isActive = true,
  onComplete,
  style = 'loading',
}: GlitchTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [lockedIndices, setLockedIndices] = useState<Set<number>>(new Set());
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      setLockedIndices(new Set(Array.from({ length: text.length }, (_, i) => i)));
      return;
    }

    hasCompletedRef.current = false;
    setLockedIndices(new Set());
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed >= glitchDuration) {
        // Animation complete - lock all characters
        setDisplayText(text);
        setLockedIndices(new Set(Array.from({ length: text.length }, (_, i) => i)));

        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete?.();
        }
        return;
      }

      const newText = text
        .split('')
        .map((char, index) => {
          // Lock in characters progressively
          const shouldBeLocked = elapsed > index * lockInDelay;

          if (shouldBeLocked || lockedIndices.has(index)) {
            if (!lockedIndices.has(index)) {
              setLockedIndices(prev => new Set([...prev, index]));
            }
            return char;
          }

          // Show space as is
          if (char === ' ') return ' ';

          // Glitch character
          const glitchChar =
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          return glitchChar;
        })
        .join('');

      setDisplayText(newText);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isActive, glitchDuration, lockInDelay, onComplete]);

  const containerClass = `glitch-text glitch-text--${style} ${className}`;

  return (
    <div className={containerClass}>
      {displayText.split('').map((char, index) => {
        const isLocked = lockedIndices.has(index);
        const charClass = `glitch-char ${isLocked ? 'glitch-char--locked' : 'glitch-char--glitching'}`;

        return (
          <span
            key={index}
            className={charClass}
            style={{ animationDelay: `${index * 20}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};

export default GlitchText;
