import { useState, useEffect, useRef } from 'react';

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

  const getStyleClasses = () => {
    const baseClasses = 'font-mono tracking-wide';

    if (style === 'loading') {
      return `${baseClasses} text-2xl md:text-3xl font-bold text-[#4d7fff] drop-shadow-[0_0_10px_rgba(77,127,255,0.5)]`;
    } else {
      return `${baseClasses} text-5xl md:text-7xl lg:text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(77,127,255,0.8)]`;
    }
  };

  return (
    <div
      className={`${getStyleClasses()} ${className}`}
      style={{
        textShadow:
          style === 'hero'
            ? '0 0 20px rgba(77, 127, 255, 0.8), 0 0 40px rgba(147, 197, 253, 0.6)'
            : '0 0 10px rgba(77, 127, 255, 0.5)',
      }}
    >
      {displayText.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block ${lockedIndices.has(index) ? 'animate-pulse-once' : 'animate-glitch'
            }`}
          style={{
            animationDelay: `${index * 20}ms`,
            color: lockedIndices.has(index) ? undefined : '#00b4ff',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}

      <style>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
        }

        @keyframes pulse-once {
          0% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-glitch {
          animation: glitch 0.3s infinite;
        }

        .animate-pulse-once {
          animation: pulse-once 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GlitchText;
