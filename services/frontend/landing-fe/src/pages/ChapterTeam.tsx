/**
 * Purpose: /team/:chapterId route — Chapter officers + Execom members.
 * Exports: default ChapterTeam (React component)
 * Side effects: None
 *
 * Layout:
 *   1. Chapter hero (icon, name, back link)
 *   2. Officers section (position holders, variable per chapter)
 *   3. Visual divider
 *   4. Execom members grid
 */

import { useLoaderData, useOutletContext, Link } from 'react-router-dom';
import { m, type Variants } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useMotion } from '@/hooks/useMotion';
import type { LayoutContext } from '@/layouts/MainLayout';
import type { ITeamMember } from '@/types/team';
import { CHAPTER_POSITION_ORDER, PROFILE_BASE_URL } from '@/data/teamData';
import type { IChapter, IChapterAcronyms } from '@astranova/catalogues';
import ChapterIcon from '@/components/ui/ChapterIcon';
import SEO from '@/components/common/SEO';
import './ChapterTeam.css';

// ── Chapter color map (kept in sync with ChapterDetails.tsx) ──────
const CHAPTER_COLORS: Record<string, string> = {
    CS: '#4d7fff', RAS: '#D22B2B', CIS: '#FFEA00', SC: '#ADF802', WIE: '#d946ef',
    MTTS: '#f97316', PES: '#10b981', SPS: '#8b5cf6', ComSoc: '#f59e0b', APS: '#ef4444',
    EMBS: '#6366f1', IX: '#0FFF50', Web: '#D22B2B', CRTY: '#FFEA00', COVR: '#ADF802',
    DIGI: '#d946ef', PRSP: '#6366f1', TEMS: '#00ccff',
};

// ==================== SUB-COMPONENTS ====================

interface AvatarProps {
    src: string;
    name: string;
    size?: 'sm' | 'md';
    accentColor?: string;
}

function Avatar({ src, name, size = 'md', accentColor }: AvatarProps) {
    const [imgError, setImgError] = useState(false);
    const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div
            className={`ct-avatar-ring ct-avatar-ring-${size}`}
            style={accentColor ? { background: `linear-gradient(135deg, ${accentColor}80, ${accentColor}30)` } : undefined}
        >
            <div className="ct-avatar">
                {!imgError ? (
                    <img
                        src={src}
                        alt={name}
                        className="ct-avatar-img"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <span
                        className="ct-avatar-initials"
                        style={accentColor ? { color: accentColor } : undefined}
                    >
                        {initials}
                    </span>
                )}
            </div>
        </div>
    );
}

interface OfficerCardProps {
    member: ITeamMember;
    accentColor: string;
    variants: Variants;
}

function OfficerCard({ member, accentColor, variants }: OfficerCardProps) {
    return (
        <m.a
            href={`${PROFILE_BASE_URL}/${member.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ct-officer-card"
            style={{ '--accent': accentColor } as React.CSSProperties}
            variants={variants}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`${member.name} — ${member.position}, view profile`}
        >
            <Avatar src={member.image} name={member.name} accentColor={accentColor} />
            <div className="ct-officer-info">
                <h3 className="ct-officer-name">{member.name}</h3>
                <span className="ct-officer-position" style={{ color: accentColor }}>
                    {member.position}
                </span>
                <span className="ct-officer-meta">{member.department} · {member.year} Year</span>
            </div>
            <svg
                className="ct-card-link-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
            >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
        </m.a>
    );
}

interface ExecomCardProps {
    member: ITeamMember;
    accentColor: string;
    variants: Variants;
}

function ExecomCard({ member, accentColor, variants }: ExecomCardProps) {
    return (
        <m.a
            href={`${PROFILE_BASE_URL}/${member.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ct-execom-card"
            style={{ '--accent': accentColor } as React.CSSProperties}
            variants={variants}
            whileHover={{ y: -4, scale: 1.03 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`${member.name} — Execom, view profile`}
        >
            <Avatar src={member.image} name={member.name} size="sm" accentColor={accentColor} />
            <div className="ct-execom-info">
                <span className="ct-execom-name">{member.name}</span>
                <span className="ct-execom-meta">{member.department} · {member.year} Year</span>
            </div>
        </m.a>
    );
}

// ==================== MAIN COMPONENT ====================

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.05 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function ChapterTeam() {
    const { chapter, members } = useLoaderData() as { chapter: IChapter; members: ITeamMember[] };
    const { warpComplete } = useOutletContext<LayoutContext>();
    const { orchestrate, shouldReduceMotion } = useMotion();

    const safeContainer = orchestrate(containerVariants);
    const safeItem = orchestrate(itemVariants);
    const safeCard = orchestrate(cardVariants);

    const accentColor = CHAPTER_COLORS[chapter.acronym] ?? '#4d7fff';

    const { officers, execoms } = useMemo(() => {
        const positionIndex = (pos: string) => {
            const idx = CHAPTER_POSITION_ORDER.indexOf(pos);
            return idx === -1 ? CHAPTER_POSITION_ORDER.length : idx;
        };

        const officerList = members
            .filter((m) => m.position !== 'Execom')
            .sort((a, b) => positionIndex(a.position) - positionIndex(b.position));

        const execomList = members.filter((m) => m.position === 'Execom');

        return { officers: officerList, execoms: execomList };
    }, [members]);

    return (
        <>
            <SEO
                title={`${chapter.name} Team`}
                description={`Meet the officers and execom members of the ${chapter.name} at IEEE RIT Bangalore.`}
                url={`https://ieee.ritb.in/team/${chapter.acronym.toLowerCase()}`}
            />

            <m.div
                className="ct-page"
                variants={safeContainer}
                initial={warpComplete ? 'visible' : 'hidden'}
                animate={warpComplete ? 'visible' : 'hidden'}
            >
                {/* Background accent orb */}
                <div
                    className="ct-bg-orb"
                    style={{ background: `radial-gradient(circle, ${accentColor}20, transparent 65%)` }}
                    aria-hidden="true"
                />

                {/* ── Back Link ─────────────────────────────── */}
                <Link to="/team" className="ct-back-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Team
                </Link>

                {/* ── Chapter Hero ──────────────────────────── */}
                <m.section className="ct-hero" aria-labelledby="ct-chapter-name" variants={itemVariants}>
                    {/* Pulsating glow rings */}
                    {!shouldReduceMotion && (
                        <div className="ct-hero-rings" aria-hidden="true">
                            <div className="ct-ring ct-ring-1" style={{ borderColor: `${accentColor}50` }} />
                            <div className="ct-ring ct-ring-2" style={{ borderColor: `${accentColor}35` }} />
                            <div className="ct-ring ct-ring-3" style={{ borderColor: `${accentColor}20` }} />
                        </div>
                    )}

                    {/* Icon */}
                    <div
                        className="ct-hero-icon"
                        style={{ color: accentColor, '--glow': `${accentColor}50` } as React.CSSProperties}
                    >
                        <ChapterIcon acronym={chapter.acronym as IChapterAcronyms} size={72} />
                    </div>

                    {/* Text */}
                    <div className="ct-hero-text">
                        <span
                            className="ct-chapter-type-badge"
                            style={{ borderColor: `${accentColor}60`, color: accentColor }}
                        >
                            {chapter.type === 'tech' ? 'Technical Chapter' : 'Non-Technical Chapter'}
                        </span>
                        <h1 id="ct-chapter-name" className="ct-hero-title">{chapter.name}</h1>
                        <p className="ct-hero-desc">{chapter.shortDescription}</p>
                    </div>
                </m.section>

                {/* ── Officers ──────────────────────────────── */}
                {officers.length > 0 && (
                    <section className="ct-section" aria-labelledby="ct-officers-heading">
                        <div className="ct-section-container">
                            <m.div
                                variants={safeContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-60px' }}
                            >
                                <m.div className="ct-section-header" variants={safeItem}>
                                    <span className="section-overline">Leadership</span>
                                    <h2 id="ct-officers-heading" className="ct-section-title">
                                        Chapter Officers
                                    </h2>
                                </m.div>

                                <m.div className="ct-officers-grid" variants={safeContainer}>
                                    {officers.map((member) => (
                                        <OfficerCard
                                            key={member.username}
                                            member={member}
                                            accentColor={accentColor}
                                            variants={safeCard}
                                        />
                                    ))}
                                </m.div>
                            </m.div>
                        </div>
                    </section>
                )}

                {/* ── Execom Divider ────────────────────────── */}
                {execoms.length > 0 && (
                    <>
                        <div className="ct-divider" role="separator" aria-label="Execom Members section">
                            <div className="ct-divider-line" />
                            <div
                                className="ct-divider-label"
                                style={{ borderColor: `${accentColor}40`, color: accentColor }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Execom Members
                                <span
                                    className="ct-divider-count"
                                    style={{ background: `${accentColor}20`, color: accentColor }}
                                >
                                    {execoms.length}
                                </span>
                            </div>
                            <div className="ct-divider-line" />
                        </div>

                        {/* ── Execom Grid ───────────────────────────── */}
                        <section className="ct-section ct-execom-section" aria-labelledby="ct-execom-heading">
                            <div className="ct-section-container">
                                <m.div
                                    variants={safeContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-60px' }}
                                >
                                    <h2 id="ct-execom-heading" className="sr-only">Execom Members</h2>
                                    <m.div className="ct-execom-grid" variants={safeContainer}>
                                        {execoms.map((member) => (
                                            <ExecomCard
                                                key={member.username}
                                                member={member}
                                                accentColor={accentColor}
                                                variants={safeCard}
                                            />
                                        ))}
                                    </m.div>
                                </m.div>
                            </div>
                        </section>
                    </>
                )}

                {/* Empty state */}
                {officers.length === 0 && execoms.length === 0 && (
                    <m.div className="ct-empty-state" variants={itemVariants}>
                        <p>No members found for this chapter yet.</p>
                        <Link to="/team" className="btn-secondary">← Back to Team</Link>
                    </m.div>
                )}

                <div className="ct-footer-spacer" />
            </m.div>
        </>
    );
}
