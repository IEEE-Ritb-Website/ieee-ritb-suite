import './Hero.css';
import HeroStarfield from '../effects/HeroStarfield';
import { useEffect, useRef, useState } from 'react';

interface Props {
  isLoading: boolean;
}

interface AnimatedNumberProps {
  end: number;
  duration?: number;
  delay?: number;
}

function AnimatedNumber({ end, duration = 2000, delay = 0 }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Start animation immediately on mount (Hero is always visible)
    if (hasStartedRef.current) return;
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
  }, [end, duration, delay]);

  return (
    <span className="stat-number">
      {count}
    </span>
  );
}

const StatItem = ({ value, label, delay }: { value: number; label: string; delay: number }) => {
  return (
    <div className="stat-item" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-value">
        <AnimatedNumber end={value} duration={2500} delay={delay} />
        <span className="stat-plus">+</span>
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default function Hero({ isLoading }: Props) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      {/* Background layer - 3D starfield with built-in nebula effects */}
      <HeroStarfield isLoading={isLoading} />

      <div className="hero-content">
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
            <StatItem value={18} label="Chapters" delay={2000} />
            <div className="stat-divider" aria-hidden="true"></div>
            <StatItem value={1200} label="Members" delay={2200} />
            <div className="stat-divider" aria-hidden="true"></div>
            <StatItem value={50} label="Events/Year" delay={2400} />
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