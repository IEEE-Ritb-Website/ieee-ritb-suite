/**
 * Purpose: Events section with expandable chronosphere carousel.
 * Exports: default Events (React component)
 * Side effects: None
 *
 * Features DecoderText effect on active event titles.
 * Uses Framer Motion LayoutGroup for smooth slice expansion.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useInView } from 'framer-motion';
import ParallaxLayer from '../effects/ParallaxLayer';
import './Events.css';

// --- Types ---
interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  category: string;
  link: string;
}

// --- Dummy Data ---
const EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'RIT Techfest',
    date: '28th – 29th March 2025',
    description: 'The flagship technical event by IEEE chapters celebrating innovation, collaboration, and creativity among students, educators, and professionals.',
    image: 'https://res.cloudinary.com/ddrv7lqrg/image/upload/v1770888778/techfest_eomnmb.png',
    category: 'Flagship Event',
    link: '#'
  },
  {
    id: 'e2',
    title: 'CIS Industry Conclave',
    date: '5th – 6th December 2025',
    description: 'A two-day initiative bridging the gap between academia and industry through talks, workshops, and mentoring across Software, Hardware, and General tracks.',
    image: 'https://res.cloudinary.com/ddrv7lqrg/image/upload/v1770888778/industry_conclave_lzozpd.png',
    category: 'Conclave',
    link: '#'
  }
];

// --- Components ---

/**
 * Decodes text from random characters to the final string.
 */
const DecoderText = ({ text, active }: { text: string; active: boolean }) => {
  const [display, setDisplay] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  useEffect(() => {
    if (!active) {
      setDisplay(text); // Reset immediately if not active
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(() =>
        text
          .split('')
          .map((_, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2; // Speed control
    }, 30);

    return () => clearInterval(interval);
  }, [text, active]);

  return <>{display}</>;
};

export default function Events() {
  const [activeId, setActiveId] = useState<string>(EVENTS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Auto-rotate if user hasn't interacted? 
  // Maybe too distracting for this design. keeping it manual for now.

  return (
    <section className="section section-padding section-bg-base" id="events" aria-labelledby="events-heading">
      {/* Background Ambience */}
      <ParallaxLayer speed={0.2} zIndex={0}>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </ParallaxLayer>
      <ParallaxLayer speed={0.3} zIndex={0}>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px]" />
      </ParallaxLayer>

      <div className="section-container" ref={containerRef}>
        <motion.div
          className="section-header mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-overline">Highlights</span>
          <h2 id="events-heading" className="section-heading">
            Past
            <span className="section-heading-accent"> Events</span>
          </h2>
          <p className="section-description">
            A look back at our events
          </p>
        </motion.div>

        <LayoutGroup>
          <motion.div
            className="chronosphere-container"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {EVENTS.map((event) => {
              const isActive = activeId === event.id;

              return (
                <motion.div
                  layout
                  key={event.id}
                  className={`chrono-slice magnetic ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveId(event.id)}
                  initial={false}
                  animate={{
                    flexGrow: isActive ? 3 : 1, // Expand active
                    flexBasis: isActive ? '400px' : '100px'
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  {/* Background Image */}
                  <div className="slice-bg">
                    <img src={event.image} alt="" className="slice-bg-img" loading="lazy" />
                    <div className="slice-overlay" />
                  </div>

                  {/* Inactive Vertical Label */}
                  <AnimatePresence>
                    {!isActive && (
                      <motion.div
                        className="slice-vertical-label"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {event.date} • {event.category}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active Content */}
                  <div className="slice-content">
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <span className="event-date-badge">
                            {event.date}
                          </span>

                          <h3 className="event-title">
                            <DecoderText text={event.title} active={isActive} />
                          </h3>

                          <motion.p
                            className="event-desc"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                          >
                            {event.description}
                          </motion.p>

                          <div className="event-actions">
                            <Link
                              to={`/events/${event.id}`}
                              className="event-link"
                            >
                              <span>View Details</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
