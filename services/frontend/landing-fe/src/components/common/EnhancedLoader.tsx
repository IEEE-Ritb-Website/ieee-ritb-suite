import { useState, useEffect } from 'react';
import GlitchText from '../effects/GlitchText';
import TerminalText from '../effects/TerminalText';
import OrbitalParticles from '../effects/OrbitalParticles';
import { useMotion } from '@/hooks/useMotion';

/**
 * EnhancedLoader Component
 * Complete loading experience that feels like initializing a spacecraft
 * Features:
 * - Real progress tracking with percentage
 * - Stage-based loading messages
 * - Orbital particle system
 * - Glitch text effect
 * - Terminal-style system messages
 * - IEEE logo wireframe (CSS-based for performance)
 * - Scanline overlay
 * - Animated grid background
 * - Electromagnetic pulses
 */

interface LoadingMessage {
  text: string;
  delay?: number;
  type?: 'system' | 'success' | 'info' | 'gpu';
}

interface LoadingStage {
  name: string;
  progress: [number, number]; // [start, end] percentage
  duration: number; // milliseconds
  messages: LoadingMessage[];
}

const LOADING_STAGES: LoadingStage[] = [
  {
    name: 'Initializing quantum field...',
    progress: [0, 20],
    duration: 800,
    messages: [
      { text: 'SYSTEM: Booting IEEE Portal...', delay: 0, type: 'system' },
      { text: 'GPU: WebGL 2.0 detected ✓', delay: 200, type: 'gpu' },
    ],
  },
  {
    name: 'Loading star catalog...',
    progress: [20, 45],
    duration: 1000,
    messages: [
      { text: 'STARS: Generating entities...', delay: 0, type: 'system' },
      { text: 'Adaptive quality: Optimizing for device...', delay: 300, type: 'info' },
    ],
  },
  {
    name: 'Rendering nebula clouds...',
    progress: [45, 65],
    duration: 800,
    messages: [
      { text: 'SHADER: Compiling programs...', delay: 0, type: 'system' },
      { text: 'SHADER: Compilation complete ✓', delay: 400, type: 'success' },
    ],
  },
  {
    name: 'Calculating trajectories...',
    progress: [65, 85],
    duration: 700,
    messages: [
      { text: 'PHYSICS: Initializing particle systems...', delay: 0, type: 'system' },
      { text: 'COLLISION: Detection enabled ✓', delay: 300, type: 'success' },
    ],
  },
  {
    name: 'Finalizing scene...',
    progress: [85, 100],
    duration: 600,
    messages: [
      { text: 'RENDER: Final optimizations...', delay: 0, type: 'system' },
      { text: 'STATUS: Ready ✓', delay: 300, type: 'success' },
    ],
  },
];

interface EnhancedLoaderProps {
  isLoading: boolean;
  onLoaded: () => void;
}

export const EnhancedLoader = ({ isLoading, onLoaded }: EnhancedLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [allMessages, setAllMessages] = useState<LoadingMessage[]>([]);
  const { shouldReduceMotion } = useMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setProgress(100);
      setIsComplete(true);
      return;
    }

    let totalElapsed = 0;
    let stageIndex = 0;

    const advanceStage = () => {
      if (stageIndex >= LOADING_STAGES.length) {
        setIsComplete(true);
        return;
      }

      const stage = LOADING_STAGES[stageIndex];
      const [startProgress, endProgress] = stage.progress;
      const progressRange = endProgress - startProgress;

      setCurrentStage(stageIndex);

      // Add stage messages to terminal
      const stageMessages = stage.messages.map(msg => ({
        ...msg,
        delay: totalElapsed + (msg.delay || 0),
      }));

      setAllMessages(prev => [...prev, ...stageMessages]);

      // Animate progress for this stage
      const stageStartTime = Date.now();
      const progressInterval = setInterval(() => {
        const stageElapsed = Date.now() - stageStartTime;
        const stageProgress = Math.min(stageElapsed / stage.duration, 1);

        setProgress(startProgress + progressRange * stageProgress);

        if (stageElapsed >= stage.duration) {
          clearInterval(progressInterval);
          stageIndex++;
          totalElapsed += stage.duration;
          advanceStage();
        }
      }, 16); // ~60fps

      return () => clearInterval(progressInterval);
    };

    advanceStage();
  }, []);

  useEffect(() => {
    if (isComplete) {
      // Delay hiding the loader to allow for outro animations
      const timer = setTimeout(() => {
        onLoaded();
      }, 800); // Match this with outro animation duration

      return () => clearTimeout(timer);
    }
  }, [isComplete, onLoaded]);

  return (
    <div
      className={`fixed inset-0 w-full h-screen flex items-center justify-center z-50 bg-black overflow-hidden transition-opacity duration-800 ease-in-out ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-background" />
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanlines" />
      </div>

      {/* EM Pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="em-pulse-ring" />
        <div className="em-pulse-ring" style={{ animationDelay: '1s' }} />
        <div className="em-pulse-ring" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-8 max-w-2xl w-full">
        {/* IEEE Logo Wireframe (CSS-based) */}
        <div className="relative">
          {/* Orbital Particles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <OrbitalParticles
              ringCount={2}
              particlesPerRing={6}
              radius={60}
              isComplete={isComplete}
            />
          </div>

          {/* Logo */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="ieee-logo-wireframe">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(77, 127, 255, 0.6))',
                }}
              >
                {/* IEEELetterS as geometric shapes */}
                <rect x="10" y="30" width="8" height="40" className="logo-part" style={{ animationDelay: '0s' }} />
                <rect x="25" y="30" width="8" height="40" className="logo-part" style={{ animationDelay: '0.1s' }} />
                <rect x="40" y="30" width="8" height="40" className="logo-part" style={{ animationDelay: '0.2s' }} />
                <rect x="55" y="30" width="25" height="8" className="logo-part" style={{ animationDelay: '0.3s' }} />
                <rect x="55" y="46" width="25" height="8" className="logo-part" style={{ animationDelay: '0.4s' }} />
                <rect x="55" y="62" width="25" height="8" className="logo-part" style={{ animationDelay: '0.5s' }} />

                {/* Border outline */}
                <rect
                  x="2" y="2" width="96" height="96"
                  fill="none"
                  stroke="#4d7fff"
                  strokeWidth="1"
                  className="logo-border"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Glitch Title */}
        <div className="text-center">
          <GlitchText
            text="IEEE RIT-B"
            glitchDuration={2000}
            lockInDelay={100}
            isActive={!isComplete}
            style="loading"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md">
          {/* Stage label */}
          <div className="text-[#6b8cff] text-sm mb-2 font-mono text-center">
            {LOADING_STAGES[currentStage]?.name || 'Complete'}
          </div>

          {/* Progress bar container */}
          <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden border border-[#4d7fff]/30">
            {/* Background glow */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4d7fff]/20 to-transparent animate-shimmer"
            />

            {/* Progress fill */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4d7fff] to-[#00b4ff] transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(77, 127, 255, 0.8), 0 0 20px rgba(77, 127, 255, 0.4)',
              }}
            >
              {/* Animated shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-slide" />
            </div>
          </div>

          {/* Percentage */}
          <div className="text-[#4d7fff] text-xl font-mono font-bold text-center mt-2">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Terminal Messages */}
        <div className="w-full max-w-md bg-black/50 border border-[#4d7fff]/30 rounded-lg p-4 backdrop-blur-sm">
          <TerminalText
            messages={allMessages}
            typingSpeed={50}
            isActive={true}
          />
        </div>

        {/* Loading indicator text */}
        {!isComplete && (
          <div className="text-[#6b8cff]/60 text-xs font-mono animate-pulse">
            Please wait while we prepare your experience...
          </div>
        )}
      </div>

      <style>{`
        /* Grid Background */
        .grid-background {
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(77, 127, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(77, 127, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-scroll 20s linear infinite;
        }

        @keyframes grid-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        /* Scanlines */
        .scanlines {
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(77, 127, 255, 0.03) 1px,
            transparent 2px
          );
          animation: scanline-move 8s linear infinite;
        }

        @keyframes scanline-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(100px); }
        }

        /* EM Pulse Rings */
        .em-pulse-ring {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 2px solid rgba(77, 127, 255, 0.5);
          border-radius: 50%;
          animation: em-pulse 3s ease-out infinite;
        }

        @keyframes em-pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* IEEE Logo Animations */
        .logo-part {
          fill: none;
          stroke: #4d7fff;
          stroke-width: 2;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-in 1s ease-out forwards;
        }

        .logo-border {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw-in 1.5s ease-out forwards;
          animation-delay: 0.6s;
        }

        @keyframes draw-in {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Progress bar animations */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-slide {
          animation: slide 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
