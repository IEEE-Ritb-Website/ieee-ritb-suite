import { useParams, Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useEvent } from '../hooks/useEntityData';
import { useMotion } from '../hooks/useMotion';
import type { LayoutContext } from '../layouts/MainLayout';
import './EventDetails.css';

/**
 * EventDetails Page
 * 
 * Displays detailed information about a specific event.
 * Features: Hero header, poster, details panel, and registration CTA.
 */
export default function EventDetails() {
    const { eventId } = useParams<{ eventId: string }>();
    const { warpComplete } = useOutletContext<LayoutContext>();
    const { data: event, loading, error } = useEvent(eventId);
    const { orchestrate } = useMotion();

    const containerVariants = orchestrate({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    });

    const itemVariants = orchestrate({
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    });

    if (loading) {
        return (
            <div className="event-details-loading">
                <div className="loader-spinner" />
                <p>Loading event details...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="event-details-error">
                <Helmet>
                    <title>Event Not Found | IEEE RITB</title>
                </Helmet>
                <div className="error-content glass-panel">
                    <h1>Event Not Found</h1>
                    <p>{error || 'The requested event does not exist.'}</p>
                    <Link to="/#events" className="btn-primary">
                        ← Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{event.title} | IEEE RITB</title>
                <meta name="description" content={event.description} />
            </Helmet>

            <motion.div
                className="event-details"
                variants={containerVariants}
                initial="hidden"
                animate={warpComplete ? "visible" : "hidden"}
            >
                {/* Hero Header */}
                <motion.section className="event-hero" variants={itemVariants}>
                    <div className="event-hero-bg">
                        <img src={event.image} alt="" className="event-hero-image" />
                        <div className="event-hero-overlay" />
                    </div>

                    <div className="event-hero-content">
                        <Link to="/#events" className="back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Events
                        </Link>

                        <div className="event-badges">
                            <span className="event-category-badge">{event.category}</span>
                            <span className="event-date-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {event.date}
                            </span>
                            {event.time && (
                                <span className="event-time-badge">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {event.time}
                                </span>
                            )}
                        </div>

                        <h1 className="event-title">{event.title}</h1>
                        <p className="event-description">{event.description}</p>
                    </div>
                </motion.section>

                {/* Main Content */}
                <div className="event-content-grid">
                    {/* Poster / Media */}
                    <motion.section className="event-poster" variants={itemVariants}>
                        <div className="poster-frame glass-panel">
                            <img src={event.image} alt={event.title} className="poster-image" />
                        </div>
                    </motion.section>

                    {/* Details Panel */}
                    <motion.section className="event-info" variants={itemVariants}>
                        {/* About */}
                        <div className="info-card glass-panel">
                            <h2 className="info-heading">About This Event</h2>
                            <p className="info-text">{event.longDescription || event.description}</p>
                        </div>

                        {/* Schedule */}
                        {event.schedule && event.schedule.length > 0 && (
                            <div className="info-card glass-panel">
                                <h2 className="info-heading">Schedule</h2>
                                <table className="schedule-table">
                                    <tbody>
                                        {event.schedule.map((item, index) => (
                                            <tr key={index}>
                                                <td className="schedule-time">{item.time}</td>
                                                <td className="schedule-activity">{item.activity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Venue */}
                        {event.venue && (
                            <div className="info-card glass-panel">
                                <h2 className="info-heading">Venue</h2>
                                <div className="venue-info">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{event.venue}</span>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <div className="event-tags">
                                {event.tags.map((tag, index) => (
                                    <span key={index} className="event-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </motion.section>
                </div>

                {/* Registration CTA */}
                <motion.section className="event-registration" variants={itemVariants}>
                    <div className="registration-card glass-panel">
                        <div className="registration-content">
                            <h2>Ready to Join?</h2>
                            <p>Don't miss out on this exciting event. Register now to secure your spot!</p>
                        </div>
                        <div className="registration-actions">
                            <a href={event.registrationLink || '#'} className="btn-primary em-field">
                                <span>Register Now</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                            <Link to="/" className="btn-secondary">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </>
    );
}
