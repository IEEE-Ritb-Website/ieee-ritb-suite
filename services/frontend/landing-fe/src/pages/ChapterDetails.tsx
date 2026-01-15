import { useParams, Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useChapter } from '../hooks/useEntityData';
import { useMotion } from '../hooks/useMotion';
import ChapterIcon from '../components/ui/ChapterIcon';
import GlowText from '../components/effects/GlowText';
import type { IChapterAcronyms } from '@astranova/catalogues';
import type { LayoutContext } from '../layouts/MainLayout';
import './ChapterDetails.css';

// Chapter colors from the main Chapters section
const chapterColors: Record<string, string> = {
    CS: '#4d7fff', RAS: '#D22B2B', CIS: '#FFEA00', SC: '#ADF802', WIE: '#d946ef',
    MTTS: '#f97316', PES: '#10b981', SPS: '#8b5cf6', ComSoc: '#f59e0b', APS: '#ef4444',
    EMBS: '#6366f1', IX: '#0FFF50', Web: '#D22B2B', CRTY: '#FFEA00', COVR: '#ADF802',
    DIGI: '#d946ef', Doc: '#f97316', PRSP: '#6366f1',
};

/**
 * ChapterDetails Page - Immersive Hero Showcase
 * 
 * A cinematic experience featuring:
 * - Parallax background orbs in chapter colors
 * - Pulsating glow rings around the central icon
 * - Glassmorphic floating stat cards
 * - Premium animations and transitions
 */
export default function ChapterDetails() {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { warpComplete } = useOutletContext<LayoutContext>();
    const { data: chapter, loading, error } = useChapter(chapterId);
    const { orchestrate, shouldReduceMotion } = useMotion();

    const containerVariants = orchestrate({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 }
        }
    });

    const itemVariants = orchestrate({
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
        }
    });

    const floatVariants = orchestrate({
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    });

    const color = chapter ? chapterColors[chapter.acronym] || '#4d7fff' : '#4d7fff';

    if (loading) {
        return (
            <div className="chapter-details-loading">
                <div className="loader-spinner" />
                <p>Loading chapter details...</p>
            </div>
        );
    }

    if (error || !chapter) {
        return (
            <div className="chapter-details-error">
                <Helmet>
                    <title>Chapter Not Found | IEEE RITB</title>
                </Helmet>
                <div className="error-content glass-panel">
                    <h1>Chapter Not Found</h1>
                    <p>{error || 'The requested chapter does not exist.'}</p>
                    <Link to="/#chapters" className="btn-primary">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Stat card data
    const statCards = [
        {
            label: 'Domain',
            value: chapter.type === 'tech' ? 'Technical Society' : 'Operations & Support',
        },
        {
            label: 'Acronym',
            value: chapter.acronym,
            isAccent: true,
        },
        {
            label: 'Status',
            value: 'Active',
            isStatus: true,
        },
    ];

    return (
        <>
            <Helmet>
                <title>{chapter.name} | IEEE RITB</title>
                <meta name="description" content={chapter.shortDescription} />
            </Helmet>

            <motion.div
                className="chapter-details"
                variants={containerVariants}
                initial="hidden"
                animate={warpComplete ? "visible" : "hidden"}
            >
                {/* Back Link */}
                <Link to="/#chapters" className="back-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>

                {/* ===== CINEMATIC HERO SECTION ===== */}
                <motion.section id="overview" className="chapter-hero" variants={itemVariants}>
                    {/* Parallax Background Orbs */}
                    <div className="chapter-orbs-container" aria-hidden="true">
                        <div
                            className="chapter-orb chapter-orb-1"
                            style={{ background: `radial-gradient(circle, ${color}40, transparent 70%)` }}
                        />
                        <div
                            className="chapter-orb chapter-orb-2"
                            style={{ background: `radial-gradient(circle, ${color}30, transparent 70%)` }}
                        />
                        <div
                            className="chapter-orb chapter-orb-3"
                            style={{ background: `radial-gradient(circle, ${color}25, transparent 70%)` }}
                        />
                    </div>

                    {/* Central Glow */}
                    <div
                        className="chapter-hero-glow"
                        style={{ background: `radial-gradient(ellipse at center, ${color}20, transparent 60%)` }}
                    />

                    {/* Hero Content */}
                    <div className="chapter-hero-content">
                        {/* Icon with Pulsating Glow Rings */}
                        <motion.div className="chapter-icon-container" variants={itemVariants}>
                            {/* Glow Rings */}
                            {!shouldReduceMotion && (
                                <>
                                    <div
                                        className="chapter-glow-ring chapter-glow-ring-1"
                                        style={{ borderColor: color }}
                                        aria-hidden="true"
                                    />
                                    <div
                                        className="chapter-glow-ring chapter-glow-ring-2"
                                        style={{ borderColor: color }}
                                        aria-hidden="true"
                                    />
                                    <div
                                        className="chapter-glow-ring chapter-glow-ring-3"
                                        style={{ borderColor: color }}
                                        aria-hidden="true"
                                    />
                                </>
                            )}

                            {/* Main Icon */}
                            <div
                                className="chapter-hero-icon"
                                style={{
                                    color,
                                    '--glow-color': `${color}50`,
                                } as React.CSSProperties}
                            >
                                <ChapterIcon acronym={chapter.acronym as IChapterAcronyms} size={80} />
                            </div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div className="chapter-hero-text" variants={itemVariants}>
                            <span
                                className="chapter-type-badge"
                                style={{ borderColor: `${color}60`, color }}
                            >
                                {chapter.type === 'tech' ? 'Technical Chapter' : 'Non-Technical Chapter'}
                            </span>

                            <h1 className="chapter-title">{chapter.name}</h1>

                            <span className="chapter-acronym-large" style={{ color }}>
                                {chapter.acronym}
                            </span>
                        </motion.div>
                    </div>
                </motion.section>

                {/* ===== DATA ORBS STATS ===== */}
                <motion.section className="chapter-overview" variants={itemVariants}>
                    <div className="chapter-section-container">
                        <div className="data-orbs-container">
                            {/* Data Orbs */}
                            <div className="data-orbs-grid">
                                {statCards.map((card, index) => (
                                    <motion.div
                                        key={card.label}
                                        className={`data-orb ${card.isStatus ? 'data-orb-status' : ''}`}
                                        custom={index}
                                        variants={floatVariants}
                                        style={{ '--orb-color': color } as React.CSSProperties}
                                    >
                                        {/* Rotating Ring */}
                                        <div className="orb-ring" aria-hidden="true" />
                                        <div className="orb-ring orb-ring-2" aria-hidden="true" />

                                        {/* Orb Content */}
                                        <div className="orb-inner">
                                            <span
                                                className={`orb-value ${card.isAccent ? 'orb-value-accent' : ''}`}
                                                style={card.isStatus ? undefined : { color }}
                                            >
                                                {card.isStatus ? (
                                                    <>
                                                        <span className="orb-status-dot" />
                                                        {card.value}
                                                    </>
                                                ) : (
                                                    card.value
                                                )}
                                            </span>
                                            <span className="orb-label">{card.label}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ===== MISSION SECTION ===== */}
                <motion.section id="about" className="chapter-mission" variants={itemVariants}>
                    <div className="chapter-section-container">
                        <div className="mission-content">
                            <h2 className="mission-heading" style={{ color }}>About This Chapter</h2>
                            <GlowText
                                text={chapter.shortDescription}
                                color={color}
                                glowRadius={100}
                                className="mission-text"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* ===== CTA SECTION ===== */}
                <motion.section
                    id="contact"
                    className="chapter-cta"
                    variants={itemVariants}
                    style={{ '--chapter-color': color } as React.CSSProperties}
                >
                    <div className="chapter-section-container">
                        <div className="cta-content">
                            {/* CTA Glow */}
                            <div
                                className="cta-glow"
                                style={{ background: color }}
                                aria-hidden="true"
                            />

                            <h3 style={{ color }}>Interested in joining {chapter.acronym}?</h3>
                            <p>Connect with us to learn more about our activities and how you can contribute to this vibrant community.</p>

                            <div className="cta-buttons">
                                <Link
                                    to="/#contact"
                                    className="btn-primary"
                                    style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                                >
                                    <span>Get in Touch</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                                <Link to="/" className="btn-secondary">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </>
    );
}
