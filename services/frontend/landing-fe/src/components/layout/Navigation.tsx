/**
 * Purpose: Main navigation bar with scroll progress indicator.
 * Exports: default Navigation (React component)
 * Side effects: Observes sections for active state; listens for scroll/resize.
 *
 * Dynamically adjusts nav items based on current route (home vs detail pages).
 * Uses IntersectionObserver to highlight the currently visible section.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import './Navigation.css';

// Navigation item type
interface NavItem {
  label: string;
  href: string;
  isBack?: boolean;
  isAnchor?: boolean;
}

// Get navigation items based on current route
function getNavItems(pathname: string): NavItem[] {
  // Chapter details page
  if (pathname.startsWith('/chapters/')) {
    return [
      { label: 'Overview', href: '#overview', isAnchor: true },
      { label: 'About', href: '#about', isAnchor: true },
      { label: 'Contact', href: '#contact', isAnchor: true },
    ];
  }

  // Event details page
  if (pathname.startsWith('/events/')) {
    return [
      { label: 'Overview', href: '#overview', isAnchor: true },
      { label: 'About', href: '#about', isAnchor: true },
      { label: 'Timeline', href: '#timeline', isAnchor: true },
      { label: 'Register', href: '#register', isAnchor: true },
    ];
  }

  // Homepage (default)
  return [
    { label: 'About', href: '#about', isAnchor: true },
    { label: 'Features', href: '#features', isAnchor: true },
    { label: 'Events', href: '#events', isAnchor: true },
    { label: 'Chapters', href: '#chapters', isAnchor: true },
    { label: 'Contact', href: '#contact', isAnchor: true },
  ];
}

export default function Navigation({ showNavigation }: { showNavigation: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  // Get navigation items based on current route
  const navItems = useMemo(() => getNavItems(location.pathname), [location.pathname]);

  // Framer Motion Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 50,
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

  // Reset active section when route changes
  useEffect(() => {
    setActiveSection('');
  }, [location.pathname]);

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
  }, [location.pathname]);

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
          <Link to="/" className="nav-logo" aria-label="IEEE RITB Home">
            <span className="nav-logo-text">IEEE</span>
            <span className="nav-logo-accent">RITB</span>
          </Link>

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
            {navItems.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;

              return (
                <li key={item.href}>
                  {item.isBack ? (
                    <Link
                      to={item.href}
                      className="nav-link nav-link-back"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      onClick={closeMenu}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="nav-progress-bar"
          style={{ scaleX }}
        />
      </nav>
    </>
  );
}
