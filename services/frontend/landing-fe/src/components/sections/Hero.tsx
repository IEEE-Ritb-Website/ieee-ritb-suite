/**
 * Purpose: Hero section of the landing page with animated stats and CTA buttons.
 * Exports: default Hero (React component)
 * Side effects: None
 *
 * Contains AnimatedNumber (eased counter animation) and StatItem sub-components.
 * Waits for warp animation to complete before revealing content.
 */

import './Hero.css';
import { useEffect, useRef, useState } from 'react';
import { Chapters } from '@astranova/catalogues';
import { motion, type Variants } from 'framer-motion';
import { useMotion } from '@/hooks/useMotion';
import { useOutletContext } from 'react-router-dom';
import type { LayoutContext } from '@/layouts/MainLayout';

interface AnimatedNumberProps {
  end: number;
  duration?: number;
  delay?: number;
  shouldStart?: boolean;
}

function AnimatedNumber({ end, duration = 2000, delay = 0, shouldStart = true }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);
  const { shouldReduceMotion } = useMotion();

  useEffect(() => {
    if (!shouldStart || hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (shouldReduceMotion) {
      setCount(end);
      return;
    }

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
      if (progress < 1) requestAnimationFrame(updateCount);
      else setCount(end);
    };
    requestAnimationFrame(updateCount);
  }, [end, duration, delay, shouldStart, shouldReduceMotion]);

  return <span className="stat-number">{count}</span>;
}

const StatItem = ({ value, label, delay, shouldStart, isRough }: { value: number; label: string; delay: number; shouldStart: boolean, isRough?: boolean }) => {
  return (
    <div className="stat-item">
      <div className="stat-value">
        <AnimatedNumber end={value} duration={2500} delay={delay} shouldStart={shouldStart} />
        {isRough && <span className="stat-plus">+</span>}
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.15,
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

const HeroStats = [
  {
    label: "Chapters",
    stat: Chapters.length,
  },
  {
    label: "Members",
    stat: 300,
    isRough: true,
  },
  {
    label: "Events Last Year",
    stat: 100,
    isRough: true,
  }
]

export default function Hero() {
  // Get warpComplete from layout context (starfield is in MainLayout)
  const { warpComplete } = useOutletContext<LayoutContext>();
  const { orchestrate, shouldReduceMotion } = useMotion();

  const safeContainerVariants = orchestrate(containerVariants);
  const safeItemVariants = orchestrate(itemVariants);

  // Content visible when warp is complete or reduced motion is on
  const contentVisible = warpComplete || shouldReduceMotion;

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      {/* Starfield is now rendered in MainLayout for persistence */}

      <motion.div
        className="hero-content"
        variants={safeContainerVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate={contentVisible ? "visible" : "hidden"}
        style={{ pointerEvents: contentVisible ? 'auto' : 'none' }}
      >
        <div className="hero-text">
          <motion.div className="hero-overline" variants={safeItemVariants}>
            <svg className="overline-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            IEEE STUDENT BRANCH
          </motion.div>

          <motion.h1 className="hero-title" id="hero-title" variants={safeItemVariants}>
            <span className="hero-title-accent">IEEE RIT-B</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={safeItemVariants}>
            Welcome to the hub of innovation at Ramaiah Institute of Technology.
            We are a community of thinkers, builders, and leaders shaping the future of technology.
          </motion.p>

          <motion.p className="hero-subtitle-accent" variants={safeItemVariants}>
            Powered by students, driven by passion.
          </motion.p>

          <motion.div className="hero-stats" variants={safeItemVariants}>
            {
              HeroStats.map((item, idx) => (
                <>
                  <StatItem value={item.stat} label={item.label} isRough={item.isRough} delay={400} shouldStart={contentVisible} />
                  {idx < HeroStats.length -1 &&
                    <div className="stat-divider" aria-hidden="true" />
                  }
                </>
              ))
            }
          </motion.div>

          <motion.div className="hero-cta" variants={safeItemVariants}>
            <a href="#chapters" className="btn-primary em-field">
              <span>Explore Chapters</span>
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4 10h12m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#about" className="btn-secondary">Learn More</a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
