import { useEffect, useRef, useState } from 'react';
import ParallaxLayer from '../effects/ParallaxLayer';
import './About.css';

interface AnimatedNumberProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function AnimatedNumber({ end, duration = 2000, suffix = '' }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="animated-number">
      {count}{suffix}
    </div>
  );
}

export default function About() {
  return (
    <section className="section section-padding section-bg-base" id="about" aria-labelledby="about-heading">
      {/* Parallax Background Elements */}
      <ParallaxLayer speed={0.3} zIndex={-2}>
        <div className="about-bg-shape about-bg-shape-1" />
      </ParallaxLayer>
      <ParallaxLayer speed={0.4} zIndex={-1}>
        <div className="about-bg-shape about-bg-shape-2" />
      </ParallaxLayer>

      <div className="section-container">
        <div className="section-two-col">
          <div className="about-text animate-slideUp">
            <span className="section-overline">About IEEE RITB</span>
            <h2 id="about-heading" className="section-heading">
              Leading the Future of
              <span className="section-heading-accent"> Technology</span>
            </h2>
            <div className="about-description">
              <p>
                IEEE RIT-B is the premier student branch at RIT Bangalore, fostering innovation
                and technical excellence since our inception. We are part of the world's largest
                technical professional organization dedicated to advancing technology for humanity.
              </p>
              <p>
                Our diverse community of students, faculty, and industry professionals work
                together on cutting-edge projects, organize impactful events, and create
                opportunities for growth in emerging technologies.
              </p>
            </div>

            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div className="highlight-content">
                  <h3 className="highlight-title">Student-Led Innovation</h3>
                  <p className="highlight-text">
                    Empowering students to lead technical initiatives and create real-world impact
                  </p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div className="highlight-content">
                  <h3 className="highlight-title">Global Recognition</h3>
                  <p className="highlight-text">
                    Part of IEEE's worldwide network with access to exclusive resources
                  </p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                  </svg>
                </div>
                <div className="highlight-content">
                  <h3 className="highlight-title">Multidisciplinary Focus</h3>
                  <p className="highlight-text">
                    18 technical chapters covering AI, Robotics, IoT, and emerging fields
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-stats animate-slideInRight">
            <div className="stats-grid">
              <div className="stat-card holographic">
                <AnimatedNumber end={500} suffix="+" />
                <div className="stat-label">Active Members</div>
                <div className="stat-description">
                  Passionate students driving innovation
                </div>
              </div>

              <div className="stat-card holographic">
                <AnimatedNumber end={18} />
                <div className="stat-label">Technical Chapters</div>
                <div className="stat-description">
                  Diverse societies and special interest groups
                </div>
              </div>

              <div className="stat-card holographic">
                <AnimatedNumber end={100} suffix="+" />
                <div className="stat-label">Events Annually</div>
                <div className="stat-description">
                  Workshops, seminars, and competitions
                </div>
              </div>

              <div className="stat-card holographic">
                <AnimatedNumber end={50} suffix="+" />
                <div className="stat-label">Industry Partners</div>
                <div className="stat-description">
                  Collaborations with leading tech companies
                </div>
              </div>
            </div>

            <div className="stats-visual" aria-hidden="true">
              <div className="data-flow-container">
                <div className="data-particle" style={{ animationDelay: '0s' }} />
                <div className="data-particle" style={{ animationDelay: '0.5s' }} />
                <div className="data-particle" style={{ animationDelay: '1s' }} />
                <div className="data-particle" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
