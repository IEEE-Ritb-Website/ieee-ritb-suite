import './Hero.css';
import HeroStarfield from '../effects/HeroStarfield';
import type { AnimationPhase } from '../effects/HeroStarfield';
import { useEffect, useRef, useState } from 'react';
import { Chapters } from '@astranova/catalogues';

interface Props {
  isLoading: boolean;
  onWarpComplete?: () => void;
}

interface AnimatedNumberProps {
  end: number;
  duration?: number;
  delay?: number;
  shouldStart?: boolean;
}

function AnimatedNumber({ end, duration = 2000, delay = 0, shouldStart = true }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Only start animation when shouldStart is true
    if (!shouldStart || hasStartedRef.current) return;
    hasStartedRef.current = true;

    console.log(`[AnimatedNumber] Starting animation for ${end} with delay ${delay}ms`);

    const startTime = Date.now() + delay;

    const updateCount = () => {
      const now = Date.now();

      if (now < startTime) {
        requestAnimationFrame(updateCount);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
        console.log(`[AnimatedNumber] Animation complete for ${end}`);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration, delay, shouldStart]);

  return (
    <span className="stat-number">
      {count}
    </span>
  );
}

const StatItem = ({ value, label, delay, shouldStart }: { value: number; label: string; delay: number; shouldStart: boolean }) => {
  return (
    <div className="stat-item" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-value">
        <AnimatedNumber end={value} duration={2500} delay={delay} shouldStart={shouldStart} />
        <span className="stat-plus">+</span>
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default function Hero({ isLoading, onWarpComplete }: Props) {
  const [warpPhase, setWarpPhase] = useState<AnimationPhase>('warp');
  const [contentVisible, setContentVisible] = useState(false);

  // Control content visibility based on warp phase
  useEffect(() => {
    if (warpPhase === 'slowing') {
      // Start fading in during slowing phase
      const timer = setTimeout(() => {
        setContentVisible(true);
        console.log('[Hero] Content fade-in started');

        // Notify parent that warp is complete (navigation can appear)
        if (onWarpComplete) {
          onWarpComplete();
        }
      }, 300); // Small delay for better feel
      return () => clearTimeout(timer);
    }
  }, [warpPhase, onWarpComplete]);

  const handlePhaseChange = (phase: AnimationPhase) => {
    console.log('[Hero] Warp phase changed to:', phase);
    setWarpPhase(phase);
  };

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      {/* Background layer - 3D starfield with built-in nebula effects */}
      <HeroStarfield isLoading={isLoading} onPhaseChange={handlePhaseChange} />

      <div
        className="hero-content"
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: contentVisible ? 'auto' : 'none'
        }}
      >
        <div className="hero-text">
          <div className="hero-overline" data-animate="fadeIn">
            <svg
              className="overline-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            IEEE RIT Branch
          </div>

          <h1 className="hero-title" id="hero-title" data-animate="slideUp">
            <span className="hero-title-accent">IEEE-RITB</span>
          </h1>

          <p className="hero-subtitle" data-animate="slideUp">
            Welcome to the hub of innovation at Ramaiah Institute of Technology.
            We are a community of thinkers, builders, and leaders shaping the future of technology.
          </p>

          <p className="hero-subtitle-accent" data-animate="slideUp">
            Powered by students, driven by passion.
          </p>

          <div className="hero-stats" data-animate="fadeIn">
            <StatItem value={Chapters.length} label="Chapters" delay={400} shouldStart={contentVisible} />
            <div className="stat-divider" aria-hidden="true"></div>
            <StatItem value={500} label="Members" delay={600} shouldStart={contentVisible} />
            <div className="stat-divider" aria-hidden="true"></div>
            <StatItem value={50} label="Events This Year" delay={800} shouldStart={contentVisible} />
          </div>

          <div className="hero-cta" data-animate="fadeIn">
            <a href="#chapters" className="btn-primary em-field">
              <span>Explore Chapters</span>
              <svg
                className="btn-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 10h12m-6-6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#about" className="btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}