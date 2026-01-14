import { useParams, Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useChapter } from '../hooks/useEntityData';
import { useMotion } from '../hooks/useMotion';
import ChapterIcon from '../components/ui/ChapterIcon';
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
 * ChapterDetails Page
 * 
 * Displays detailed information about a specific IEEE chapter.
 * Features: Hero with logo, overview grid, mission statement, and CTA.
 */
export default function ChapterDetails() {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { warpComplete } = useOutletContext<LayoutContext>();
    const { data: chapter, loading, error } = useChapter(chapterId);
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
                        ← Back to Chapters
                    </Link>
                </div>
            </div>
        );
    }

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
                {/* Hero Section */}
                <motion.section className="chapter-hero" variants={itemVariants}>
                    <div className="chapter-hero-glow" style={{ background: `radial-gradient(ellipse at center, ${color}30, transparent 70%)` }} />

                    <div className="chapter-hero-content">
                        <Link to="/#chapters" className="back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Chapters
                        </Link>

                        <div className="chapter-hero-icon" style={{ color }}>
                            <ChapterIcon acronym={chapter.acronym as IChapterAcronyms} size={80} />
                        </div>

                        <div className="chapter-hero-text">
                            <span className="chapter-type-badge" style={{ borderColor: color, color }}>
                                {chapter.type === 'tech' ? 'Technical Chapter' : 'Non-Technical Chapter'}
                            </span>
                            <h1 className="chapter-title">{chapter.name}</h1>
                            <span className="chapter-acronym-large" style={{ color }}>{chapter.acronym}</span>
                        </div>
                    </div>
                </motion.section>

                {/* Overview Grid */}
                <motion.section className="chapter-overview" variants={itemVariants}>
                    <div className="section-container">
                        <div className="bento-grid">
                            <div className="bento-card glass-panel">
                                <span className="bento-label">Domain</span>
                                <span className="bento-value">{chapter.type === 'tech' ? 'Technical Society' : 'Operations & Support'}</span>
                            </div>
                            <div className="bento-card glass-panel">
                                <span className="bento-label">Chapter Type</span>
                                <span className="bento-value">{chapter.type === 'tech' ? 'IEEE Technical Society' : 'IEEE Affinity Group'}</span>
                            </div>
                            <div className="bento-card glass-panel">
                                <span className="bento-label">Acronym</span>
                                <span className="bento-value" style={{ color }}>{chapter.acronym}</span>
                            </div>
                            <div className="bento-card glass-panel">
                                <span className="bento-label">Status</span>
                                <span className="bento-value bento-active">Active</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Mission Statement */}
                <motion.section className="chapter-mission" variants={itemVariants}>
                    <div className="section-container">
                        <div className="mission-content glass-panel">
                            <h2 className="mission-heading">About This Chapter</h2>
                            <p className="mission-text">{chapter.shortDescription}</p>
                        </div>
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section className="chapter-cta" variants={itemVariants}>
                    <div className="section-container">
                        <div className="cta-content">
                            <h3>Interested in joining {chapter.acronym}?</h3>
                            <p>Connect with us to learn more about our activities and how you can contribute.</p>
                            <div className="cta-buttons">
                                <Link to="/#contact" className="btn-primary em-field" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
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
