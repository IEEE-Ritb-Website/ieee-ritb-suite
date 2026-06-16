"use client";

import { useMemo, useState } from "react";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { StatBox, SectionBlock, SkillTag } from "@/components/ui";
import { OrganizationStructure } from "@astranova/catalogues";
import { ContributionGraph } from "@/components/ui/ContributionGraph";
import { IconCloud } from "@/components/ui/IconCloud";
import { SKILL_TO_SLUG } from "@/lib/skill-slugs";
import {
  ChevronDown,
  ExternalLink,
  Github,
  Globe,
  Brain,
  Terminal,
  ShieldAlert,
  FileText,
  Cpu,
  Smartphone,
  Gamepad2,
  Wrench,
  Lightbulb,
  Link2,
  type LucideIcon,
  MoveRight,
} from "lucide-react";

type ProjectTypeMeta = {
  Icon: LucideIcon;
  label: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
};

const PROJECT_TYPE_META: Record<string, ProjectTypeMeta> = {
  website: {
    Icon: Globe,
    label: "Website / Web App",
    bgColor: "rgba(0,207,255,0.06)",
    iconColor: "#00cfff",
    borderColor: "rgba(0,207,255,0.25)",
  },
  aiml: {
    Icon: Brain,
    label: "AI / ML Project",
    bgColor: "rgba(255,79,216,0.06)",
    iconColor: "#ff4fd8",
    borderColor: "rgba(255,79,216,0.25)",
  },
  cli: {
    Icon: Terminal,
    label: "CLI / Tooling",
    bgColor: "rgba(0,255,157,0.05)",
    iconColor: "#00ff9d",
    borderColor: "rgba(0,255,157,0.2)",
  },
  cybersecurity: {
    Icon: ShieldAlert,
    label: "Cybersecurity",
    bgColor: "rgba(255,183,0,0.06)",
    iconColor: "#ffb700",
    borderColor: "rgba(255,183,0,0.25)",
  },
  research: {
    Icon: FileText,
    label: "Research Paper",
    bgColor: "rgba(200,255,232,0.04)",
    iconColor: "rgba(200,255,232,0.6)",
    borderColor: "rgba(200,255,232,0.15)",
  },
  embedded: {
    Icon: Cpu,
    label: "Embedded / Hardware",
    bgColor: "rgba(255,79,216,0.05)",
    iconColor: "#ff4fd8",
    borderColor: "rgba(255,79,216,0.2)",
  },
  mobile: {
    Icon: Smartphone,
    label: "Mobile App",
    bgColor: "rgba(0,207,255,0.05)",
    iconColor: "#00cfff",
    borderColor: "rgba(0,207,255,0.2)",
  },
  game: {
    Icon: Gamepad2,
    label: "Game",
    bgColor: "rgba(255,183,0,0.06)",
    iconColor: "#ffb700",
    borderColor: "rgba(255,183,0,0.22)",
  },
  devtool: {
    Icon: Wrench,
    label: "Dev Tool / Library",
    bgColor: "rgba(0,255,157,0.06)",
    iconColor: "#00ff9d",
    borderColor: "rgba(0,255,157,0.22)",
  },
  other: {
    Icon: Lightbulb,
    label: "Other",
    bgColor: "rgba(200,255,232,0.03)",
    iconColor: "rgba(200,255,232,0.45)",
    borderColor: "rgba(200,255,232,0.12)",
  },
};

interface ProfileViewProps {
  data: {
    name?: string;
    stats?: Record<string, string>;
    current_status?: string | null;
    bio?: string | null;
    skills?: string[];
    batch_of?: string;
    department?: string;
    term: string;
    achievements?: Array<{
      title: string;
      badge_type:
      | "hackathon"
      | "gsoc"
      | "open_source"
      | "certification"
      | "award";
      date?: string;
      description?: string;
      link?: string;
    }>;
    projects?: Array<{
      type?: string;
      title: string;
      short_description?: string;
      long_description?: string;
      primary_link?: string;
      extra_link?: string;
      tags?: string[];
      // legacy
      description?: string;
      link?: string;
    }>;
    timeline?: Array<{
      year: string;
      position: string;
      chapter: string;
      description?: string;
    }>;
    github_username?: string;
    leetcode_username?: string;
  };
}

function ProjectDetailModal({
  project,
  onClose,
}: {
  project: NonNullable<ProfileViewProps["data"]["projects"]>[0];
  onClose: () => void;
}) {
  const meta =
    PROJECT_TYPE_META[project.type || "other"] || PROJECT_TYPE_META["other"];
  const primaryLink = project.primary_link || project.link;
  const extraLink = project.extra_link;
  const longDesc = project.long_description || project.description;
  const { Icon, bgColor, iconColor, borderColor, label } = meta;

  const isGithub = (url: string) => url.includes("github.com");

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#0d0d1a]/90 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl bg-[#0d0d1a] border border-[rgba(0,255,157,0.35)] rounded-[4px] shadow-[0_0_60px_rgba(0,255,157,0.12)] my-8 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
        <div
          className="flex justify-between items-start px-5 py-4 border-b border-[rgba(0,255,157,0.2)] relative z-10"
          style={{ background: bgColor, borderColor }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[4px] border"
              style={{ borderColor, background: "rgba(13,13,26,0.5)" }}
            >
              <Icon size={18} style={{ color: iconColor }} />
            </div>
            <div>
              <div className="text-xs tracking-widest text-[rgba(200,255,232,0.4)] uppercase mb-0.5">
                {label}
              </div>
              <h3
                className="font-vt text-xl tracking-wider leading-tight"
                style={{ color: iconColor }}
              >
                {project.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[rgba(200,255,232,0.4)] hover:text-[#ff4fd8] transition-colors font-bold uppercase text-xs mt-1"
          >
            ✕
          </button>
        </div>

        <div className="p-6 relative z-10 space-y-5">
          {longDesc && (
            <div>
              <div className="text-xs uppercase tracking-widest text-[rgba(200,255,232,0.35)] mb-2">
                About
              </div>
              <p className="text-sm text-[rgba(200,255,232,0.7)] leading-[1.8] whitespace-pre-wrap">
                {longDesc}
              </p>
            </div>
          )}

          {/* Links */}
          {(primaryLink || extraLink) && (
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-[rgba(200,255,232,0.35)] mb-2">
                Links
              </div>
              {primaryLink && (
                <a
                  href={primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 w-fit px-4 py-2 border border-[rgba(0,255,157,0.3)] rounded text-xs text-[#00ff9d] hover:bg-[rgba(0,255,157,0.08)] hover:border-[#00ff9d] transition-all group"
                >
                  {isGithub(primaryLink) ? (
                    <Github size={13} />
                  ) : (
                    <ExternalLink size={13} />
                  )}
                  <span className="tracking-wider">
                    {isGithub(primaryLink) ? "View on GitHub" : "View Resource"}
                  </span>
                </a>
              )}
              {extraLink && (
                <a
                  href={extraLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 w-fit px-4 py-2 border border-[rgba(0,207,255,0.3)] rounded text-xs text-[#00cfff] hover:bg-[rgba(0,207,255,0.08)] hover:border-[#00cfff] transition-all"
                >
                  {isGithub(extraLink) ? (
                    <Github size={13} />
                  ) : (
                    <Link2 size={13} />
                  )}
                  <span className="tracking-wider">
                    {isGithub(extraLink) ? "View on GitHub" : "Extra Link"}
                  </span>
                </a>
              )}
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-widest text-[rgba(200,255,232,0.35)] mb-2">
                Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-[2px] border border-[rgba(0,255,157,0.2)] text-[#00ff9d] opacity-60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type AchievementItem = NonNullable<ProfileViewProps["data"]["achievements"]>[0];

const BADGE_STYLES: Record<string, { border: string; bg: string }> = {
  hackathon: {
    border: "border-[#ffb700] text-[#ffb700]",
    bg: "bg-[rgba(255,183,0,0.08)]",
  },
  gsoc: {
    border: "border-[#00ff9d] text-[#00ff9d]",
    bg: "bg-[rgba(0,255,157,0.08)]",
  },
  open_source: {
    border: "border-[#ff4fd8] text-[#ff4fd8]",
    bg: "bg-[rgba(255,79,216,0.08)]",
  },
  certification: {
    border: "border-[#00cfff] text-[#00cfff]",
    bg: "bg-[rgba(0,207,255,0.08)]",
  },
  award: {
    border: "border-[#a78bfa] text-[#a78bfa]",
    bg: "bg-[rgba(167,139,250,0.08)]",
  },
  internship: {
    border: "border-[#f97316] text-[#f97316]",
    bg: "bg-[rgba(249,115,22,0.08)]",
  },
  other: {
    border: "border-[rgba(200,255,232,0.3)] text-[rgba(200,255,232,0.5)]",
    bg: "bg-[rgba(200,255,232,0.03)]",
  },
};

const BADGE_TYPE_LABEL: Record<string, string> = {
  hackathon: "Hackathon",
  gsoc: "GSoC",
  open_source: "Open Source",
  certification: "Certification",
  award: "Award",
  internship: "Internship",
  other: "Other",
};

function AchievementsAccordion({
  achievements,
}: {
  achievements: AchievementItem[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-[rgba(0,255,157,0.08)]">
      {achievements.map((ach, idx) => {
        const isOpen = openIdx === idx;
        const style = BADGE_STYLES[ach.badge_type] || BADGE_STYLES.hackathon;
        const typeLabel = BADGE_TYPE_LABEL[ach.badge_type] || ach.badge_type;
        const hasExtra = !!(ach.description || ach.link);

        return (
          <div key={idx}>
            <button
              onClick={() =>
                hasExtra ? setOpenIdx(isOpen ? null : idx) : undefined
              }
              className={`w-full flex items-center justify-between gap-3 py-2.5 text-left transition-colors ${hasExtra ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded-[2px] border uppercase tracking-widest ${style.border} ${style.bg}`}
                >
                  {typeLabel}
                </span>
                <span className="text-sm text-[#c8ffe8] font-medium truncate">
                  {ach.title}
                </span>
                {ach.date && (
                  <span className="text-xs text-[rgba(200,255,232,0.35)] flex-shrink-0">
                    · {ach.date}
                  </span>
                )}
              </div>
              {hasExtra && (
                <ChevronDown
                  size={14}
                  className={`flex-shrink-0 text-[rgba(200,255,232,0.3)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {/* Expandable content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 opacity-100 pb-3" : "max-h-0 opacity-0"}`}
            >
              <div
                className={`rounded-[3px] border ${style.border} ${style.bg} px-4 py-3 space-y-2.5`}
              >
                {ach.description && (
                  <p className="text-xs text-[rgba(200,255,232,0.6)] leading-[1.7]">
                    {ach.description}
                  </p>
                )}
                {ach.link && (
                  <a
                    href={ach.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider border px-3 py-1 rounded transition-opacity hover:opacity-80 ${style.border}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={10} />
                    View Certificate / Link
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const ProfileView = ({ data }: ProfileViewProps) => {
  const skills = useMemo(() => data.skills || [], [data.skills]);
  const [selectedProject, setSelectedProject] = useState<
    NonNullable<ProfileViewProps["data"]["projects"]>[0] | null
  >(null);

  const { cloudSlugs, fallbackSkills } = useMemo(() => {
    const cloudSlugs: string[] = [];
    const fallbackSkills: string[] = [];
    const seenSlugs = new Set<string>();

    for (const skill of skills) {
      const slug = SKILL_TO_SLUG[skill];
      if (slug && !seenSlugs.has(slug)) {
        cloudSlugs.push(slug);
        seenSlugs.add(slug);
      } else if (!slug) {
        fallbackSkills.push(skill);
      }
    }
    return { cloudSlugs, fallbackSkills };
  }, [skills]);

  const validAchievements = (data.achievements || []).filter((a) =>
    a.title?.trim(),
  );
  const validProjects = (data.projects || []).filter((p) => p.title?.trim());
  const validTimeline = (data.timeline || []).filter(
    (t) => t.year?.trim() && t.position?.trim(),
  );

  const groupedTimeline = useMemo(() => {
    const groups: { year: string; items: typeof validTimeline }[] = [];
    for (const entry of validTimeline) {
      let group = groups.find((g) => g.year === entry.year);
      if (!group) {
        group = { year: entry.year, items: [] };
        groups.push(group);
      }
      group.items.push(entry);
    }
    return groups;
  }, [validTimeline]);

  const getChapterName = (acronym: string) => {
    const match = OrganizationStructure.find((c) => c.acronym === acronym);
    return match?.name || acronym;
  };

  const formatPosition = (pos: string) => {
    return pos
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Performance Stats */}
      {data.stats && Object.keys(data.stats).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(data.stats).map(([key, val]) => (
            <StatBox key={key} num={val} label={key} />
          ))}
        </div>
      )}

      {/* System Identification */}
      <SectionBlock title="SYSTEM IDENTIFICATION">
        <div className="font-vt text-3xl text-[#00ff9d] leading-tight mb-2 uppercase">
          {data.name}
        </div>
        {(data.batch_of || data.department) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#00ff9d] uppercase font-vt tracking-wider mt-1 mb-2">
            {data.batch_of && (
              <span className="border border-[rgba(0,255,157,0.3)] bg-[rgba(0,255,157,0.06)] px-2 py-0.5 rounded-[2px]">
                TERM ACTIVE: {data.term}
              </span>
            )}
          </div>
        )}
        <div className="text-[12px] text-[rgba(200,255,232,0.45)] leading-[1.7] mt-2.5">
          <MarkdownRenderer content={data.bio} />
        </div>
      </SectionBlock>

      {/* Skill Stack */}
      <SectionBlock title="SKILL STACK">
        {skills.length === 0 ? (
          <div className="text-xs opacity-40 italic uppercase tracking-wider">
            {"// no skill telemetry logged"}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cloudSlugs.length > 0 && <IconCloud iconSlugs={cloudSlugs} />}
            {fallbackSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {fallbackSkills.map((skill, idx) => {
                  const colors: ("blue" | "green" | "amber" | "pink")[] = [
                    "blue",
                    "green",
                    "amber",
                    "pink",
                  ];
                  return (
                    <SkillTag
                      key={skill}
                      label={skill}
                      color={colors[idx % colors.length]}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </SectionBlock>

      {/* Contribution Graph */}
      {(data.github_username || data.leetcode_username) && (
        <SectionBlock title="CONTRIBUTION LOG">
          <ContributionGraph
            github={data.github_username}
            leetcode={data.leetcode_username}
          />
        </SectionBlock>
      )}

      {/* Honors & Achievements — Accordion */}
      <SectionBlock title="HONORS & ACHIEVEMENTS">
        {validAchievements.length > 0 ? (
          <AchievementsAccordion achievements={validAchievements} />
        ) : (
          <div className="text-xs opacity-40 italic uppercase tracking-wider">
            {"// no validated honors recorded"}
          </div>
        )}
      </SectionBlock>

      {/* Active Projects */}
      <SectionBlock title="ACTIVE PROJECTS">
        {validProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {validProjects.map((project, idx) => {
              const meta =
                PROJECT_TYPE_META[project.type || "other"] ||
                PROJECT_TYPE_META["other"];
              const { Icon, bgColor, iconColor, borderColor, label } = meta;
              const primaryLink = project.primary_link || project.link;
              const isGithub =
                primaryLink && primaryLink.includes("github.com");

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer relative rounded-[4px] p-4 transition-all relative overflow-hidden hover:brightness-110"
                  style={{
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  {primaryLink && (
                    <a
                      href={primaryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 absolute top-2 right-2 transition-colors mt-0.5 rounded-full border-[.1px] border-[rgba(200,255,232,0.3)] p-1 opacity-0 group-hover:opacity-100 p-2"
                      style={{ color: iconColor, opacity: 0.5 }}
                      title={isGithub ? "View on GitHub" : "Open Link"}
                    >
                      {isGithub ? (
                        <Github size={12} />
                      ) : (
                        <ExternalLink size={12} />
                      )}
                    </a>
                  )}
                  <div className="">
                    <div className="mb-4">
                      <Icon size={24} style={{ color: iconColor }} />
                    </div>
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Lucide icon in a small rounded box */}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#00ff9d] truncate">
                          {project.title}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: iconColor, opacity: 0.6 }}
                        >
                          {label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {(project.short_description || project.description) && (
                    <p className="text-sm text-[rgba(200,255,232,0.55)] leading-[1.6] line-clamp-2 mb-2">
                      {project.short_description || project.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs opacity-40"
                            style={{ color: iconColor }}
                          >
                            #{tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs opacity-25 text-[rgba(200,255,232,0.4)]">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="text-xs flex gap-2 items-center text-[rgba(200,255,232,0.45)] group-hover:text-[rgba(200,255,232,0.5)] transition-colors ml-auto">
                      view details <MoveRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs opacity-40 italic uppercase tracking-wider">
            {"// no active project telemetry logged"}
          </div>
        )}
      </SectionBlock>

      {/* Timeline */}
      <SectionBlock title="TIMELINE">
        {groupedTimeline.length > 0 ? (
          groupedTimeline.map((group, idx) => {
            return (
              <div
                key={idx}
                className="grid grid-cols-[70px_1fr] font-['Share_Tech_Mono',_monospace] gap-3 mb-3 text-xs"
              >
                <div className="text-[#00ff9d] pt-0.5 tracking-[0.05em] text-xs">
                  {group.year}
                </div>
                <div className="border-l border-[rgba(0,255,157,0.25)] pl-3 pb-2 space-y-4">
                  {group.items.map((entry, itemIdx) => {
                    const isVolunteer = entry.position === "volunteer";
                    const title = isVolunteer
                      ? "Volunteer"
                      : getChapterName(entry.chapter || "");
                    const subtitle =
                      entry.description ||
                      (isVolunteer ? "" : formatPosition(entry.position));
                    const badge = isVolunteer
                      ? undefined
                      : formatPosition(entry.position);
                    const badgeColor = "amber";
                    const badgeStyles = {
                      amber:
                        "border-[rgba(255,183,0,0.35)] text-[#ffb700] bg-[rgba(255,183,0,0.06)]",
                      blue: "border-[rgba(0,207,255,0.35)] text-[#00cfff] bg-[rgba(0,207,255,0.06)]",
                    };

                    return (
                      <div key={itemIdx} className="space-y-1">
                        <div className="text-[#c8ffe8] text-[12px] flex items-center flex-wrap gap-2">
                          {title}
                          {badge && (
                            <span
                              className={`text-xs px-1.5 py-[1px] rounded-[2px] border ${badgeStyles[badgeColor]}`}
                            >
                              {badge}
                            </span>
                          )}
                        </div>
                        {subtitle && (
                          <div className="text-[rgba(200,255,232,0.45)] text-xs leading-relaxed">
                            {subtitle}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm opacity-40 italic uppercase tracking-wider">
            {"// no timeline data recorded"}
          </div>
        )}
      </SectionBlock>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};
