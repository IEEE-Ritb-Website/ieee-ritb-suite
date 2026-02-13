import { Link, useOutletContext, useLoaderData } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMotion } from '../hooks/useMotion';
import ChapterIcon from '../components/ui/ChapterIcon';
import GlowText from '../components/effects/GlowText';
import type { IChapter, IChapterAcronyms } from '@astranova/catalogues';
import type { LayoutContext } from '../layouts/MainLayout';
import './ChapterDetails.css';

// ===== Recruitment Config =====
// Update these dates each semester. The button will auto-switch.
const RECRUITMENT_WINDOWS = [
    { start: new Date('2026-02-16'), end: new Date('2026-02-21') },
    { start: new Date('2026-03-06'), end: new Date('2026-03-10') },
    // Add more windows as needed, e.g.:
    // { start: new Date('2027-01-10'), end: new Date('2027-02-10') },
];
const RECRUITMENT_FORM_URL = '#'; // TODO: Replace with Google Form link

const now = new Date();
const isRecruitmentOpen = RECRUITMENT_WINDOWS.some(
    w => now >= w.start && now <= w.end
);

// Chapter colors from the main Chapters section
const chapterColors: Record<string, string> = {
    CS: '#4d7fff', RAS: '#D22B2B', CIS: '#FFEA00', SC: '#ADF802', WIE: '#d946ef',
    MTTS: '#f97316', PES: '#10b981', SPS: '#8b5cf6', ComSoc: '#f59e0b', APS: '#ef4444',
    EMBS: '#6366f1', IX: '#0FFF50', Web: '#D22B2B', CRTY: '#FFEA00', COVR: '#ADF802',
    DIGI: '#d946ef', PRSP: '#6366f1',
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
    // Data is pre-loaded by router loader - no loading states needed
    const chapter = useLoaderData() as IChapter;
    const { warpComplete } = useOutletContext<LayoutContext>();
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

    const color = chapterColors[chapter.acronym] || '#4d7fff';

    // Stat card data
    const statCards = [
        {
            label: 'Domain',
            value: chapter.type === 'tech' ? 'Tech' : 'Non-Tech',
        },
        {
            label: 'Acronym',
            value: chapter.acronym,
            isAccent: true,
        },
    ];

    return (
        <>
            <title>{chapter.name} | IEEE RITB</title>
            <meta name="description" content={chapter.shortDescription} />

            <motion.div
                className="chapter-details"
                variants={containerVariants}
                initial={warpComplete ? "visible" : "hidden"}
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
                                        className="data-orb"
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
                                                style={{ color }}
                                            >
                                                {card.value}
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

                            <h3 style={{ color }}>
                                {isRecruitmentOpen
                                    ? `Join ${chapter.acronym} — Applications Open!`
                                    : `Interested in joining ${chapter.acronym}?`}
                            </h3>
                            <p>
                                {isRecruitmentOpen
                                    ? 'Recruitment is currently open. Apply now to be part of this vibrant community.'
                                    : 'Connect with us to learn more about our activities and how you can contribute to this vibrant community.'}
                            </p>

                            <div className="cta-buttons">
                                {isRecruitmentOpen ? (
                                    <a
                                        href={RECRUITMENT_FORM_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                                    >
                                        <span>Apply Now</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                ) : (
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
                                )}
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
