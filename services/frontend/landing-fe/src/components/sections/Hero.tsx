import './Hero.css';
import GenerativeConstellation from '../effects/GenerativeConstellation';
import { useCountUp } from '@/hooks/useCountUp';
import InteractivePulse from '../effects/InteractivePulse';
import GradientOrb from '../effects/GradientOrb';

interface Props {
  isLoading: boolean;
}

const StatItem = ({ value, label, delay }: { value: number; label: string; delay: number }) => {
  const count = useCountUp({ end: value, duration: 2500, delay });
  return (
    <div className="stat-item" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-value">
        <span className="stat-number">{count}</span>
        <span className="stat-plus">+</span>
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default function Hero({ isLoading }: Props) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <GradientOrb />
      <GenerativeConstellation isLoading={isLoading} />

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
            <span className="hero-title-line">
              <span className="hero-title-main">Innovate. Collaborate.</span>
            </span>
            <span className="hero-title-line">
              <span className="hero-title-accent">Inspire.</span>
            </span>
          </h1>

          <p className="hero-subtitle" data-animate="slideUp">
            Welcome to the hub of innovation at Rochester Institute of Technology.
            We are a community of thinkers, builders, and leaders shaping the future of technology.
          </p>

          <p className="hero-subtitle-accent" data-animate="slideUp">
            Powered by students, driven by passion.
          </p>

          <div className="hero-stats" data-animate="fadeIn">
            <StatItem value={18} label="Chapters" delay={200} />
            <div className="stat-divider" aria-hidden="true"></div>
            <StatItem value={1200} label="Members" delay={400} />
            <div className="stat-divider" aria-hidden="true"></div>
            <StatItem value={50} label="Events/Year" delay={600} />
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

        <div className="hero-visual" data-animate="fadeIn">
          <div className="hero-visual-wrapper">
            <InteractivePulse />
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <a href="#about" aria-label="Scroll to next section">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span className="scroll-text">Scroll</span>
        </a>
      </div>
    </section>
  );
}