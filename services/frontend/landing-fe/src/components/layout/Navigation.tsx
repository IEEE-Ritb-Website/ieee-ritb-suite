import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import './Navigation.css';

export default function Navigation({ showNavigation }: { showNavigation: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Framer Motion Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.3], rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const menu = document.querySelector('.nav-menu');
    if (!menu) return;

    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isMenuOpen]);

  if (!showNavigation) return null;

  return (
    <>
      <div
        className={`nav-backdrop ${isMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <nav
        className={`nav ${isScrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-container">
          <a href="#" className="nav-logo" aria-label="IEEE RITB Home">
            <span className="nav-logo-text">IEEE</span>
            <span className="nav-logo-accent">RITB</span>
          </a>

          <button
            className="nav-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span className={`nav-toggle-icon ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`} role="list">
            {['about', 'features', 'events', 'chapters', 'contact'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  className={`nav-link ${activeSection === item ? 'active' : ''}`}
                  onClick={closeMenu}
                  aria-current={activeSection === item ? 'page' : undefined}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Scroll Progress Bar (1B) */}
        <motion.div 
          className="nav-progress-bar"
          style={{ scaleX }}
        />
      </nav>
    </>
  );
}