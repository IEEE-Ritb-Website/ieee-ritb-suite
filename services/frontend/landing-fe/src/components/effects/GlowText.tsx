import { useRef, useEffect, useState, useCallback } from 'react';
import { throttle } from '@/utils/throttle';
import './GlowText.css';

interface GlowTextProps {
    text: string;
    color?: string;
    glowRadius?: number; // pixels - how far the glow effect reaches
    className?: string;
}

/**
 * GlowText - Proximity-based text glow effect
 * 
 * Words glow when the cursor is near them.
 * Perfect for creating an interactive, premium text experience.
 */
export default function GlowText({
    text,
    color = '#4d7fff',
    glowRadius = 80,
    className = ''
}: GlowTextProps) {
    const containerRef = useRef<HTMLParagraphElement>(null);
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

    // Split text into words
    const words = text.split(/\s+/);

    // Track mouse position with throttling for performance
    useEffect(() => {
        const handleMouseMove = throttle((e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        }, 16); // ~60fps

        const handleMouseLeave = () => {
            setMousePos({ x: -1000, y: -1000 });
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Calculate glow intensity for each word based on proximity
    const getWordStyle = useCallback((index: number): React.CSSProperties => {
        const wordEl = wordsRef.current[index];
        if (!wordEl) return {};

        const rect = wordEl.getBoundingClientRect();
        const wordCenterX = rect.left + rect.width / 2;
        const wordCenterY = rect.top + rect.height / 2;

        // Calculate distance from cursor to word center
        const distance = Math.sqrt(
            Math.pow(mousePos.x - wordCenterX, 2) +
            Math.pow(mousePos.y - wordCenterY, 2)
        );

        // Calculate intensity (1 at cursor, 0 at glowRadius edge)
        const intensity = Math.max(0, 1 - distance / glowRadius);

        if (intensity <= 0) return {};

        // Apply glow effect
        return {
            color: color,
            textShadow: `
        0 0 ${10 * intensity}px ${color}cc,
        0 0 ${20 * intensity}px ${color}88,
        0 0 ${30 * intensity}px ${color}44
      `,
            transform: `scale(${1 + intensity * 0.05})`,
            transition: 'all 0.15s ease-out',
        };
    }, [mousePos, color, glowRadius]);

    // Force re-render on mouse move for glow updates
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        forceUpdate(n => n + 1);
    }, [mousePos]);

    return (
        <p ref={containerRef} className={`glow-text ${className}`}>
            {words.map((word, index) => (
                <span
                    key={index}
                    ref={el => { wordsRef.current[index] = el; }}
                    className="glow-word"
                    style={getWordStyle(index)}
                >
                    {word}
                    {index < words.length - 1 ? ' ' : ''}
                </span>
            ))}
        </p>
    );
}
