/**
 * Professional SVG Icon Library for IEEE Chapters
 * Replaces emoji icons with scalable, themeable vector graphics
 */

import type { ReactElement } from 'react';

interface ChapterIconProps {
  acronym: string;
  size?: number;
  className?: string;
}

export default function ChapterIcon({ acronym, size = 32, className = '' }: ChapterIconProps) {
  const iconMap: Record<string, ReactElement> = {
    // Computer Society
    CS: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="m8 10 2 2 4-4" />
      </svg>
    ),

    // Robotics & Automation
    RAS: (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Antenna */}
            <circle cx="12" cy="2" r="1" />
            <path d="M12 3v2" />
            {/* Head */}
            <rect x="7" y="5" width="10" height="7" rx="2" />
            {/* Eyes */}
            <circle cx="10" cy="8.5" r="1" />
            <circle cx="14" cy="8.5" r="1" />
            {/* Body */}
            <rect x="8" y="12" width="8" height="6" rx="1" />
            {/* Arms */}
            <path d="M8 14H6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2" />
            <path d="M16 14h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2" />
            {/* Legs */}
            <path d="M10 18v3a1 1 0 0 1-1 1H8" />
            <path d="M14 18v3a1 1 0 0 0 1 1h1" />
        </svg>
    ),

    // Power & Energy
    PES: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),

    // Signal Processing
    SPS: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M2 20h20" />
        <path d="M6 16v4" />
        <path d="M10 10v10" />
        <path d="M14 6v14" />
        <path d="M18 12v8" />
        <path d="M2 6l4 4 4-4 4 4 4-4 4 4" />
      </svg>
    ),

    // Communications
    ComSoc: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" />
      </svg>
    ),

    // Antennas and Propagation
    APS: (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Outer wave ring */}
            <path d="M12 3a9 9 0 0 1 9 9" />
            <path d="M12 3a9 9 0 0 0-9 9" />
            {/* Middle wave ring */}
            <path d="M12 6a6 6 0 0 1 6 6" />
            <path d="M12 6a6 6 0 0 0-6 6" />
            {/* Inner wave ring */}
            <path d="M12 9a3 3 0 0 1 3 3" />
            <path d="M12 9a3 3 0 0 0-3 3" />
            {/* Center point */}
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            {/* Vertical line to base */}
            <path d="M12 13.5v5.5" />
            {/* Triangular base */}
            <path d="M9 21h6l-3-2z" />
        </svg>
    ),

    // Sensors Council
    SC: (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* chip body */}
            <rect x="6" y="6" width="12" height="12" rx="2" />
            {/* internal sensor element */}
            <circle cx="12" cy="11.5" r="2" />
            <path d="M12 14.5v2" />

            {/* left pins */}
            <path d="M2 8.5h4" />
            <path d="M2 11.5h4" />
            <path d="M2 14.5h4" />

            {/* right pins */}
            <path d="M22 8.5h-4" />
            <path d="M22 11.5h-4" />
            <path d="M22 14.5h-4" />

            {/* top pins */}
            <path d="M8.5 2v4" />
            <path d="M12 2v4" />
            <path d="M15.5 2v4" />

            {/* bottom pins */}
            <path d="M8.5 22v-4" />
            <path d="M12 22v-4" />
            <path d="M15.5 22v-4" />
        </svg>
    ),

    // Computational Intelligence
    CIS: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M9 12h.01" />
        <path d="M15 12h.01" />
        <path d="M10 16s.5 1 2 1 2-1 2-1" />
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="16" cy="8" r="1.5" />
      </svg>
    ),

    // Engineering in Medicine and Biology
    EMBS: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),

    // IEEEXtreme
    IX: (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* soft ring for emphasis (very subtle) */}
            <circle cx="12" cy="12" r="9" strokeOpacity="0.06" />
            <rect x="11" y="11" width="2" height="2" rx="0.4" fill="currentColor" />

            {/* main X — rounded ends, slightly thicker for presence */}
            <path d="M8.5 8.5 L15.5 15.5" />
            <path d="M15.5 8.5 L8.5 15.5" />
        </svg>
    ),

    // Microwave Theory
    MTTS: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M16.5 9.4 7.55 4.24" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
        <polyline points="7.5 19.79 7.5 14.6 3 12" />
        <polyline points="21 12 16.5 14.6 16.5 19.79" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),

    // Women in Engineering
    WIE: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  };

  return iconMap[acronym] || iconMap.CS; // Default to CS icon if not found
}
