import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLoaderData } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useMotion } from '../hooks/useMotion';
import type { IEventDetails } from '../data/mockData';
import type { LayoutContext } from '../layouts/MainLayout';
import './EventDetails.css';

/**
 * Countdown Hook - Calculates time until event
 */
function useCountdown(targetDate: string) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            // Parse date - for "TBA" or invalid dates, show placeholder
            const target = new Date(targetDate);
            const now = new Date();

            if (isNaN(target.getTime()) || target <= now) {
                return { days: 0, hours: 0, mins: 0, secs: 0 };
            }

            const diff = target.getTime() - now.getTime();
            return {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                mins: Math.floor((diff / 1000 / 60) % 60),
                secs: Math.floor((diff / 1000) % 60),
            };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
}

/**
 * EventDetails Page - Cinematic Poster Reveal + Split Showcase
 */
export default function EventDetails() {
    // Data is pre-loaded by router loader - no loading states needed
    const event = useLoaderData() as IEventDetails;
    const { warpComplete } = useOutletContext<LayoutContext>();
    const { orchestrate, shouldReduceMotion } = useMotion();

    // Countdown timer
    const countdown = useCountdown(event.date);
    const hasCountdown = countdown.days > 0 || countdown.hours > 0 || countdown.mins > 0;

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

    return (
        <>
            <Helmet>
                <title>{event.title} | IEEE RITB</title>
                <meta name="description" content={event.description} />
            </Helmet>

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
                                className="event-badge event-date-badge"
                                custom={1}
                                variants={pillVariants}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {event.date}
                            </motion.span>

                            {event.time && (
                                <motion.span
                                    className="event-badge event-time-badge"
                                    custom={2}
                                    variants={pillVariants}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
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
                                <div className="meta-pill">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="meta-label">Venue</span>
                                    <span className="meta-value">{event.venue}</span>
                                </div>
                            )}

                            <div className="meta-pill">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span className="meta-label">Date</span>
                                <span className="meta-value">{event.date}</span>
                            </div>

                            {event.time && (
                                <div className="meta-pill">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span className="meta-label">Time</span>
                                    <span className="meta-value">{event.time}</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Large About Card with Pullquote */}
                        <motion.div className="about-showcase" variants={itemVariants}>
                            <div className="about-accent" aria-hidden="true">"</div>
                            <p className="about-text">
                                {event.longDescription || event.description}
                            </p>
                        </motion.div>

                        {/* Horizontal Timeline Schedule */}
                        {event.schedule && event.schedule.length > 0 && (
                            <motion.div id="timeline" className="schedule-timeline" variants={itemVariants}>
                                <h3 className="timeline-heading">Event Timeline</h3>
                                <div className="timeline-track">
                                    {event.schedule.map((item, index) => (
                                        <div key={index} className="timeline-node">
                                            <div className="node-marker">
                                                <span className="node-dot" />
                                                {index < event.schedule!.length - 1 && (
                                                    <span className="node-line" />
                                                )}
                                            </div>
                                            <div className="node-content">
                                                <span className="node-time">{item.time}</span>
                                                <span className="node-activity">{item.activity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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

                {/* ===== COUNTDOWN URGENCY CTA ===== */}
                <motion.section id="register" className="event-registration countdown-cta" variants={itemVariants}>
                    <div className="countdown-card">
                        {/* Countdown Timer */}
                        {hasCountdown ? (
                            <div className="countdown-section">
                                <span className="countdown-label">Event starts in</span>
                                <div className="countdown-digits">
                                    <div className="countdown-unit">
                                        <span className="countdown-number">{String(countdown.days).padStart(2, '0')}</span>
                                        <span className="countdown-text">Days</span>
                                    </div>
                                    <span className="countdown-separator">:</span>
                                    <div className="countdown-unit">
                                        <span className="countdown-number">{String(countdown.hours).padStart(2, '0')}</span>
                                        <span className="countdown-text">Hours</span>
                                    </div>
                                    <span className="countdown-separator">:</span>
                                    <div className="countdown-unit">
                                        <span className="countdown-number">{String(countdown.mins).padStart(2, '0')}</span>
                                        <span className="countdown-text">Mins</span>
                                    </div>
                                    {!shouldReduceMotion && (
                                        <>
                                            <span className="countdown-separator">:</span>
                                            <div className="countdown-unit">
                                                <span className="countdown-number countdown-secs">{String(countdown.secs).padStart(2, '0')}</span>
                                                <span className="countdown-text">Secs</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="countdown-section">
                                <span className="countdown-label">Don't miss out!</span>
                                <p className="countdown-tagline">Secure your spot for this experience</p>
                            </div>
                        )}

                        {/* Urgency Indicator */}
                        <div className="urgency-indicator">
                            <span className="urgency-dot" />
                            <span className="urgency-text">Spots filling fast</span>
                        </div>

                        {/* CTA Button */}
                        <div className="countdown-actions">
                            <a href={event.registrationLink || '#'} className="btn-register pulse-glow">
                                <span>Register Now</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </>
    );
}
