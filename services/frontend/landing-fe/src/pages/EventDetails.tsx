import { useState } from 'react';
import { Link, useOutletContext, useLoaderData } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotion } from '../hooks/useMotion';
import type { IEventDetails } from '../data/mockData';
import type { LayoutContext } from '../layouts/MainLayout';
import './EventDetails.css';

/**
 * EventDetails Page - Cinematic Poster Reveal + Split Showcase
 * Adapted for past events with day-tabbed schedule grid.
 */
export default function EventDetails() {
    // Data is pre-loaded by router loader - no loading states needed
    const event = useLoaderData() as IEventDetails;
    const { warpComplete } = useOutletContext<LayoutContext>();
    const { orchestrate } = useMotion();

    // Day tab state for schedule
    const [activeDay, setActiveDay] = useState(0);

    const containerVariants = orchestrate({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.15 }
        }
    });

    const itemVariants = orchestrate({
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
        }
    });

    const pillVariants = orchestrate({
        hidden: { opacity: 0, y: 15, scale: 0.9 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    });

    const cardVariants = orchestrate({
        hidden: { opacity: 0, y: 12, scale: 0.97 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    });

    const currentSchedule = event.schedule?.[activeDay];

    return (
        <>
            <title>{event.title} | IEEE RITB</title>
            <meta name="description" content={event.description} />

            <motion.div
                className="event-details"
                variants={containerVariants}
                initial={warpComplete ? "visible" : "hidden"}
                animate={warpComplete ? "visible" : "hidden"}
            >
                {/* Back Link - Fixed Position */}
                <Link to="/#events" className="back-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>

                {/* ===== CINEMATIC HERO ===== */}
                <motion.section id="overview" className="event-hero" variants={itemVariants}>
                    {/* Full-bleed Background */}
                    <div className="event-hero-bg">
                        <img
                            src={event.image}
                            alt=""
                            className="event-hero-image"
                            loading="eager"
                        />
                        <div className="event-hero-overlay" />
                    </div>

                    {/* Hero Content */}
                    <div className="event-hero-content">
                        {/* Floating Info Pills */}
                        <motion.div className="event-badges" variants={itemVariants}>
                            <motion.span
                                className="event-badge event-category-badge"
                                custom={0}
                                variants={pillVariants}
                            >
                                {event.category}
                            </motion.span>

                            <motion.span
                                className="event-badge event-past-badge"
                                custom={1}
                                variants={pillVariants}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Past Event
                            </motion.span>

                            {event.time && (
                                <motion.span
                                    className="event-badge event-date-badge"
                                    custom={2}
                                    variants={pillVariants}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    {event.time}
                                </motion.span>
                            )}
                        </motion.div>

                        {/* Event Title */}
                        <motion.h1 className="event-title" variants={itemVariants}>
                            {event.title}
                        </motion.h1>

                        {/* Short Tagline */}
                        <motion.p className="event-tagline" variants={itemVariants}>
                            {event.description}
                        </motion.p>
                    </div>
                </motion.section>

                {/* ===== SPLIT SHOWCASE CONTENT ===== */}
                <motion.section id="about" className="event-showcase" variants={itemVariants}>
                    <div className="showcase-container">

                        {/* Metadata Pills Row */}
                        <motion.div className="meta-pills-row" variants={itemVariants}>
                            {event.venue && (
                                <a href="https://maps.app.goo.gl/pBmSqVvwk5fZBmbz6" target="_blank" rel="noopener noreferrer" className="meta-pill meta-pill-link">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="meta-label">Venue</span>
                                    <span className="meta-value">{event.venue}</span>
                                </a>
                            )}

                            <div className="meta-pill">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span className="meta-label">Date</span>
                                <span className="meta-value">{event.time || event.date}</span>
                            </div>
                        </motion.div>

                        {/* Large About Card with Pullquote */}
                        <motion.div className="about-showcase" variants={itemVariants}>
                            <div className="about-accent" aria-hidden="true">"</div>
                            <p className="about-text">
                                {event.longDescription || event.description}
                            </p>
                        </motion.div>

                        {/* ===== DAY-TABBED SCHEDULE GRID ===== */}
                        {event.schedule && event.schedule.length > 0 && (
                            <motion.div id="timeline" className="schedule-section" variants={itemVariants}>
                                <h3 className="schedule-heading">Event Timeline</h3>

                                {/* Day Tabs */}
                                <div className="schedule-tabs">
                                    {event.schedule.map((day, index) => (
                                        <button
                                            key={index}
                                            className={`schedule-tab ${activeDay === index ? 'active' : ''}`}
                                            onClick={() => setActiveDay(index)}
                                        >
                                            <span className="tab-label">{day.label}</span>
                                            <span className="tab-date">{day.day}</span>
                                            {day.totalEvents > 0 && (
                                                <span className="schedule-tab-count">{day.totalEvents}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Schedule Grid */}
                                <AnimatePresence mode="wait">
                                    {currentSchedule && (
                                        <motion.div
                                            key={activeDay}
                                            className="schedule-grid"
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            {currentSchedule.events.map((evt, index) => (
                                                <motion.div
                                                    key={`${activeDay}-${index}`}
                                                    className="schedule-card"
                                                    custom={index}
                                                    variants={cardVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                >
                                                    <span className="schedule-card-index">{String(index + 1).padStart(2, '0')}</span>
                                                    <div className="schedule-card-content">
                                                        <span className="schedule-card-name">{evt.name}</span>
                                                        <div className="schedule-card-meta">
                                                            <span className="schedule-card-time">
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <circle cx="12" cy="12" r="10" />
                                                                    <polyline points="12 6 12 12 16 14" />
                                                                </svg>
                                                                {evt.time}
                                                            </span>
                                                            {evt.track && (
                                                                <span className={`schedule-card-track track-${evt.track.toLowerCase()}`}>
                                                                    {evt.track}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Floating Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <motion.div className="tags-float" variants={itemVariants}>
                                {event.tags.map((tag, index) => (
                                    <span key={index} className="tag-chip">{tag}</span>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </motion.section>

                {/* ===== PAST EVENT RECAP CTA ===== */}
                <motion.section className="event-recap-cta" variants={itemVariants}>
                    <div className="recap-card">
                        <div className="recap-content">
                            <span className="recap-overline">Event Concluded</span>
                            <p className="recap-text">
                                This event has concluded. Stay tuned for future events from IEEE RITB.
                            </p>
                        </div>
                        <Link to="/#events" className="recap-link">
                            <span>View All Events</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </motion.section>
            </motion.div>
        </>
    );
}
