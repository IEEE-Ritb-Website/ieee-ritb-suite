import CircuitBoard from '../effects/CircuitBoard';
import GradientOrb from '../effects/GradientOrb';
import GradientMesh from '../effects/GradientMesh';
import QuantumParticles from '../effects/QuantumParticles';
import ParallaxLayer from '../effects/ParallaxLayer';
import FloatingShapes from '../effects/FloatingShapes';
import AnimatedCounter from '../ui/AnimatedCounter';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      {/* SVG Gradient Mesh - Replaces CSS gradients for 60-70% performance gain */}
      <GradientMesh variant="hero" opacity={1} />

      {/* Parallax Background Layers */}
      <ParallaxLayer speed={0.2} zIndex={-3}>
        <FloatingShapes count={6} />
      </ParallaxLayer>

      <ParallaxLayer speed={0.3} zIndex={-2}>
        <CircuitBoard />
      </ParallaxLayer>

      {/* Signature Effects - Tier 1-3 */}
      <div data-parallax="0.4" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <GradientOrb position="top-right" />
      </div>

      <div data-parallax="0.6" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <QuantumParticles count={5} />
      </div>

      <div className="hero-content">
        <div className="hero-text animate-slideUp">
          <span className="hero-overline" aria-label="Student Branch">
            STUDENT BRANCH
          </span>

          <h1 id="hero-heading" className="hero-title">
            <span className="hero-title-main">IEEE</span>
            <span className="hero-title-accent">RIT-BANGALORE</span>
          </h1>

          <p className="hero-subtitle">
            Advancing Technology for Humanity
            <br />
            <span className="hero-subtitle-accent">
              Empowering Innovation Through Technical Excellence
            </span>
          </p>

          <div className="hero-stats stagger-children">
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={18} duration={1500} />
              </div>
              <div className="stat-label">Technical Chapters</div>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={500} duration={2000} suffix="+" />
              </div>
              <div className="stat-label">Active Members</div>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <div className="stat-number">
                <AnimatedCounter end={100} duration={1800} suffix="+" />
              </div>
              <div className="stat-label">Events Annually</div>
            </div>
          </div>

          <div className="hero-cta">
            <a
              href="#about"
              className="btn-primary em-field"
              aria-label="Explore more about IEEE RIT-B"
            >
              Explore More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href="#chapters"
              className="btn-secondary"
              aria-label="View our technical chapters"
            >
              Our Chapters
            </a>
          </div>
        </div>

        <div className="hero-visual animate-fadeIn" data-parallax="0.3">
          <div className="visual-circle visual-circle-1" aria-hidden="true" data-parallax="0.2" />
          <div className="visual-circle visual-circle-2" aria-hidden="true" data-parallax="0.25" />
          <div className="visual-circle visual-circle-3" aria-hidden="true" data-parallax="0.3" />
          <div className="visual-core">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="visual-icon"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span className="scroll-text">Scroll to explore</span>
      </div>
    </section>
  );
}
