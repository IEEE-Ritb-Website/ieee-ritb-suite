/**
 * Purpose: /team route — Student Branch Officers showcase + Chapter directory.
 * Exports: default Team (React component)
 * Side effects: None
 *
 * Layout:
 *   1. Page hero
 *   2. Senior SB Officers (5 cards)
 *   3. Vice SB Officers (5 cards)
 *   4. Chapter cards grid → /team/:chapterId
 */

import { useLoaderData, useOutletContext, Link } from "react-router-dom";
import { m, type Variants } from "framer-motion";
import { useState } from "react";
import { useMotion } from "@/hooks/useMotion";
import type { LayoutContext } from "@/layouts/MainLayout";
import type { ITeamMember } from "@/types/team";
import {
  SB_SENIOR_POSITIONS,
  SB_VICE_POSITIONS,
  PROFILE_BASE_URL,
  sortMembersByPosition,
} from "@/data/teamData";
import { Chapters } from "@astranova/catalogues";
import ChapterIcon from "@/components/ui/ChapterIcon";
import type { IChapterAcronyms } from "@astranova/catalogues";
import SEO from "@/components/common/SEO";
import "./Team.css";

// ==================== SUB-COMPONENTS ====================

interface MemberAvatarProps {
  src: string;
  name: string;
  isSenior?: boolean;
}

function MemberAvatar({ src, name, isSenior }: MemberAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`member-avatar-ring ${isSenior ? "member-avatar-ring-senior" : ""}`}
    >
      <div className="member-avatar">
        {!imgError ? (
          <img
            src={src}
            alt={name}
            className="member-avatar-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="member-avatar-initials" aria-label={name}>
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

interface MemberCardProps {
  member: ITeamMember;
  isSenior?: boolean;
  variants: Variants;
}

function MemberCard({ member, isSenior, variants }: MemberCardProps) {
  return (
    <m.a
      href={`${PROFILE_BASE_URL}/${member.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`member-card ${isSenior ? "member-card-senior" : "member-card-vice"}`}
      variants={variants}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`${member.name} — ${member.position}, view profile`}
    >
      {/* Solaris Holographic Overlays */}
      <div className="card-holographic-sheen" />
      <div className="card-corner corner-tl" />
      <div className="card-corner corner-tr" />
      <div className="card-corner corner-bl" />
      <div className="card-corner corner-br" />

      <MemberAvatar src={member.image} name={member.name} isSenior={isSenior} />

      <div className="member-info">
        <h3 className="member-name">{member.name}</h3>
        <span
          className={`member-position-badge ${isSenior ? "badge-senior" : "badge-vice"}`}
        >
          {member.position}
        </span>
      </div>

      {/* Custom Telemetry readout replacing raw department info */}
      <div className="card-telemetry">
        <span className="telemetry-code">
          {member.department} // {member.year}
        </span>
        <span className="telemetry-status">
          <span className="telemetry-dot" />
          {member.term}
        </span>
      </div>

      <span className="member-card-link-icon" aria-hidden="true">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </span>
    </m.a>
  );
}

// ==================== MAIN COMPONENT ====================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0 },
  },
};

const officersContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const chaptersContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.35 },
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
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Team() {
  const members = useLoaderData() as ITeamMember[];
  const { warpComplete } = useOutletContext<LayoutContext>();
  const { orchestrate } = useMotion();

  const safeContainer = orchestrate(containerVariants);
  const safeOfficers = orchestrate(officersContainerVariants);
  const safeChapters = orchestrate(chaptersContainerVariants);
  const safeItem = orchestrate(itemVariants);
  const safeCard = orchestrate(cardVariants);

  const animState = warpComplete ? "visible" : "hidden";

  const seniorOfficers = sortMembersByPosition(
    members.filter((m) => SB_SENIOR_POSITIONS.has(m.position)),
  );
  const viceOfficers = sortMembersByPosition(
    members.filter((m) => SB_VICE_POSITIONS.has(m.position)),
  );

  return (
    <>
      <SEO
        title="Meet the Team"
        description="Meet the Student Branch Officers and Chapter leads powering IEEE RIT Bangalore."
        url="https://ieee.ritb.in/team"
      />

      <div className="team-page">
        {/* ── Student Branch Officers ───────────────── */}
        <section className="team-section" aria-labelledby="sb-officers-heading">
          <div className="team-section-container">
            <m.div variants={safeOfficers} initial="hidden" animate={animState}>
              <m.div className="team-section-header" variants={safeItem}>
                <span className="section-overline">Student Branch</span>
                <h2 id="sb-officers-heading" className="team-section-title">
                  Branch Officers
                </h2>
                <p className="team-section-desc">
                  Leading the {new Date().getFullYear()}-
                  {String(new Date().getFullYear() + 1).slice(2)} term.
                </p>
              </m.div>

              {/* Senior Officers */}
              <div className="officers-group">
                <m.span className="officers-group-label" variants={safeItem}>
                  Senior Officers
                </m.span>
                <m.div
                  className="officers-grid officers-grid-senior"
                  variants={safeContainer}
                >
                  {seniorOfficers.map((member) => (
                    <MemberCard
                      key={member.username}
                      member={member}
                      isSenior
                      variants={safeCard}
                    />
                  ))}
                </m.div>
              </div>

              {/* Vice Officers */}
              <div className="officers-group">
                <m.span className="officers-group-label" variants={safeItem}>
                  Vice Officers
                </m.span>
                <m.div
                  className="officers-grid officers-grid-vice"
                  variants={safeContainer}
                >
                  {viceOfficers.map((member) => (
                    <MemberCard
                      key={member.username}
                      member={member}
                      variants={safeCard}
                    />
                  ))}
                </m.div>
              </div>
            </m.div>
          </div>
        </section>

        {/* ── Chapter Directory ─────────────────────── */}
        <section
          className="team-section team-section-chapters"
          aria-labelledby="chapters-directory-heading"
        >
          <div className="team-section-container">
            <m.div variants={safeChapters} initial="hidden" animate={animState}>
              <m.div className="team-section-header" variants={safeItem}>
                <span className="section-overline">Our Ecosystem</span>
                <h2
                  id="chapters-directory-heading"
                  className="team-section-title"
                >
                  Explore Chapters
                </h2>
                <p className="team-section-desc">
                  Select a chapter to meet its officers and execom members.
                </p>
              </m.div>

              <m.div
                className="chapter-directory-grid"
                variants={safeContainer}
              >
                {Chapters.map((chapter) => (
                  <m.div key={chapter.acronym} variants={safeCard}>
                    <Link
                      to={`/team/${chapter.acronym.toLowerCase()}`}
                      className="chapter-dir-card"
                      style={
                        {
                          "--chapter-color": chapter.color,
                        } as React.CSSProperties
                      }
                      aria-label={`${chapter.name} team`}
                    >
                      <div className="chapter-dir-glow" aria-hidden="true" />
                      <div
                        className="chapter-dir-icon"
                        style={{ color: chapter.color }}
                      >
                        <ChapterIcon
                          acronym={chapter.acronym as IChapterAcronyms}
                          size={44}
                        />
                      </div>
                      <div className="chapter-dir-info">
                        <span className="chapter-dir-name">{chapter.name}</span>
                        <span
                          className="chapter-dir-acronym"
                          style={{ color: chapter.color }}
                        >
                          {chapter.acronym}
                        </span>
                      </div>
                      <svg
                        className="chapter-dir-arrow"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                      <div
                        className="chapter-dir-border"
                        style={{ borderColor: chapter.color }}
                      />
                    </Link>
                  </m.div>
                ))}
              </m.div>
            </m.div>
          </div>
        </section>
      </div>
    </>
  );
}
