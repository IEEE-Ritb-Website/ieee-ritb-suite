/**
 * Purpose: About section with animated statistics and organization highlights.
 * Exports: default About (React component)
 * Side effects: Uses IntersectionObserver for scroll-triggered number animations.
 *
 * Features StatCard (holographic hover effect) and AnimatedNumber sub-components.
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import ParallaxLayer from '../effects/ParallaxLayer';
import './About.css';
import { Chapters, ChapterType } from '@astranova/catalogues';
import { motion, type Variants } from 'framer-motion';
import { useMotion } from '@/hooks/useMotion';

// --- Types ---

interface StatItemData {
  end: number;
  suffix: string;
  label: string;
  desc: string;
}

// --- Sub-components ---

function StatCard({ s, safeItemRightVariants }: { s: StatItemData, safeItemRightVariants: Variants }) {
  const { shouldReduceMotion } = useMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="stat-card holographic"
      variants={safeItemRightVariants}
      onMouseMove={handleMouseMove}
      whileHover={shouldReduceMotion ? {} : { y: 0, scale: 1.02 }}
    >
      <AnimatedNumber end={s.end} suffix={s.suffix} />
      <div className="stat-label">{s.label}</div>
      <div className="stat-description">{s.desc}</div>
    </motion.div>
  );
}

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
      { threshold: 0.2 }
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

// 1A - Unified Staggered Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const itemRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function About() {
  const { orchestrate, shouldReduceMotion } = useMotion();
  const safeContainerVariants = useMemo(() => orchestrate(containerVariants), [orchestrate]);
  const safeItemVariants = useMemo(() => orchestrate(itemVariants), [orchestrate]);
  const safeItemRightVariants = useMemo(() => orchestrate(itemRightVariants), [orchestrate]);

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
        <motion.div
          className="about-layout"
          variants={safeContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* ===== INTRO BLOCK ===== */}
          <div className="about-intro">
            <motion.span className="section-overline" variants={safeItemVariants}>About IEEE RITB</motion.span>
            <motion.h2 id="about-heading" className="section-heading" variants={safeItemVariants}>
              Leading the Future of
              <span className="section-heading-accent"> Technology</span>
            </motion.h2>
            <motion.div className="about-description" variants={safeItemVariants}>
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
            </motion.div>
          </div>

          {/* ===== FULL-WIDTH STATS ROW ===== */}
          <motion.div className="about-stats" variants={safeContainerVariants}>
            <div className="stats-grid">
              {[
                { end: 300, suffix: '+', label: 'Active Members', desc: 'Passionate students driving innovation' },
                { end: 12, suffix: '', label: 'Technical Chapters', desc: 'Diverse societies and special interest groups' },
                { end: 100, suffix: '+', label: 'Events Annually', desc: 'Workshops, seminars, and competitions' },
                { end: 10, suffix: '+', label: 'Industry Partners', desc: 'Collaborations with leading tech companies' }
              ].map((s, i) => (
                <StatCard key={i} s={s} safeItemRightVariants={safeItemRightVariants} />
              ))}
            </div>

            <motion.div className="stats-visual" aria-hidden="true" variants={safeItemRightVariants}>
              <div className="data-flow-container">
                <div className="data-particle" style={{ animationDelay: '0s' }} />
                <div className="data-particle" style={{ animationDelay: '0.5s' }} />
                <div className="data-particle" style={{ animationDelay: '1s' }} />
                <div className="data-particle" style={{ animationDelay: '1.5s' }} />
              </div>
            </motion.div>
          </motion.div>

          {/* ===== HIGHLIGHTS ===== */}
          <motion.div className="about-highlights" variants={safeContainerVariants}>
            {[
              {
                title: 'Student-Led Innovation',
                text: 'Empowering students to lead technical initiatives and create real-world impact',
                icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
              },
              {
                title: 'Global Recognition',
                text: 'Part of IEEE\'s worldwide network with access to exclusive resources',
                icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>
              },
              {
                title: 'Multidisciplinary Focus',
                text: `${Chapters.filter(c => c.type === ChapterType.TECH).length} technical chapters covering AI, Robotics, IoT, and emerging fields`,
                icon: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>
              }
            ].map((h, i) => (
              <motion.div
                key={i}
                className="highlight-item"
                variants={safeItemVariants}
                whileHover={shouldReduceMotion ? {} : { x: 4 }}
              >
                <div className="highlight-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {h.icon}
                  </svg>
                </div>
                <div className="highlight-content">
                  <h3 className="highlight-title">{h.title}</h3>
                  <p className="highlight-text">{h.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}