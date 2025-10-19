import { useState } from 'react';
import ParallaxLayer from '../effects/ParallaxLayer';
import './Chapters.css';

const chapters = [
  { name: 'Computer Society', acronym: 'CS', color: '#4d7fff', icon: '💻', description: 'Software development, algorithms, and computing' },
  { name: 'Robotics & Automation', acronym: 'RAS', color: '#00b4ff', icon: '🤖', description: 'Robotics, automation, and intelligent systems' },
  { name: 'Power & Energy', acronym: 'PES', color: '#10b981', icon: '⚡', description: 'Sustainable energy and power systems' },
  { name: 'Signal Processing', acronym: 'SPS', color: '#8b5cf6', icon: '📡', description: 'Audio, image, and signal processing' },
  { name: 'Communications', acronym: 'ComSoc', color: '#f59e0b', icon: '📶', description: 'Telecommunications and networking' },
  { name: 'Aerospace & Electronics', acronym: 'AES', color: '#ef4444', icon: '✈️', description: 'Aerospace systems and avionics' },
  { name: 'Photonics Society', acronym: 'PhS', color: '#ec4899', icon: '💡', description: 'Optics, lasers, and photonics' },
  { name: 'Computational Intelligence', acronym: 'CIS', color: '#06b6d4', icon: '🧠', description: 'AI, machine learning, and neural networks' },
  { name: 'Engineering in Medicine', acronym: 'EMBS', color: '#84cc16', icon: '🏥', description: 'Biomedical engineering and healthcare tech' },
  { name: 'Electron Devices', acronym: 'EDS', color: '#6366f1', icon: '🔬', description: 'Semiconductor devices and materials' },
  { name: 'Microwave Theory', acronym: 'MTT', color: '#f97316', icon: '📻', description: 'RF, microwave, and antenna systems' },
  { name: 'Women in Engineering', acronym: 'WIE', color: '#d946ef', icon: '👩‍💻', description: 'Promoting women in STEM fields' },
];

export default function Chapters() {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  return (
    <section className="chapters" id="chapters" aria-labelledby="chapters-heading">
      {/* Parallax Background Elements */}
      <ParallaxLayer speed={0.35} zIndex={-2}>
        <div className="chapters-bg-shape chapters-bg-shape-1" />
      </ParallaxLayer>
      <ParallaxLayer speed={0.45} zIndex={-1}>
        <div className="chapters-bg-shape chapters-bg-shape-2" />
      </ParallaxLayer>

      <div className="chapters-container">
        <div className="chapters-header animate-slideUp">
          <span className="section-overline">Our Ecosystem</span>
          <h2 id="chapters-heading" className="section-heading">
            Explore Our
            <span className="section-heading-accent"> Technical Chapters</span>
          </h2>
          <p className="section-description">
            Join any of our 18 diverse technical societies and special interest groups.
            Each chapter organizes workshops, projects, and events tailored to specific domains.
          </p>
        </div>

        <div className="chapters-grid stagger-children">
          {chapters.map((chapter, index) => (
            <article
              key={index}
              className={`chapter-card ${activeChapter === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveChapter(index)}
              onMouseLeave={() => setActiveChapter(null)}
              onFocus={() => setActiveChapter(index)}
              onBlur={() => setActiveChapter(null)}
              tabIndex={0}
              role="button"
              aria-label={`${chapter.name} chapter`}
            >
              <div className="chapter-glow" style={{ background: `radial-gradient(circle at center, ${chapter.color}40, transparent)` }} />

              <div className="chapter-icon" aria-hidden="true">
                <span className="icon-emoji">{chapter.icon}</span>
              </div>

              <div className="chapter-header">
                <h3 className="chapter-name">{chapter.name}</h3>
                <span className="chapter-acronym" style={{ color: chapter.color }}>
                  {chapter.acronym}
                </span>
              </div>

              <p className="chapter-description">{chapter.description}</p>

              <div className="chapter-footer">
                <button className="chapter-link magnetic" aria-label={`Learn more about ${chapter.name}`}>
                  <span>Learn More</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                </button>
              </div>

              <div className="chapter-border" style={{ borderColor: chapter.color }} />
            </article>
          ))}
        </div>

        <div className="chapters-cta">
          <p className="cta-text">
            Interested in starting a new chapter or want to learn more?
          </p>
          <a href="#contact" className="btn-outline magnetic">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
