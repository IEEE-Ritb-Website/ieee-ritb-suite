import Link from "next/link";
import type { ProblemStatement, StipendDetails } from "@/lib/woc-types";

interface ProjectCardProps {
  project: ProblemStatement;
  organizationName?: string;
}

const MAX_VISIBLE_SKILLS = 4;

function getStipendSummary(stipendDetails: StipendDetails): string | null {
  const parts: string[] = [];
  if (
    typeof stipendDetails.amount === "string" ||
    typeof stipendDetails.amount === "number"
  ) {
    parts.push(String(stipendDetails.amount));
  }
  if (typeof stipendDetails.currency === "string") {
    parts.push(stipendDetails.currency);
  }
  return parts.length > 0 ? parts.join(" ") : null;
}

export default function ProjectCard({
  project,
  organizationName,
}: ProjectCardProps) {
  const visibleSkills = project.skills.slice(0, MAX_VISIBLE_SKILLS);
  const hiddenSkillCount = project.skills.length - visibleSkills.length;
  const stipendSummary = getStipendSummary(project.stipendDetails);

  return (
    <article className="flex flex-col border border-zinc-900/10 bg-white p-6 transition-colors hover:border-blue-700/50 dark:border-zinc-100/10 dark:bg-zinc-950 dark:hover:border-blue-400/50">
      {organizationName && (
        <p className="font-mono text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
          {organizationName}
        </p>
      )}
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        <Link
          href={`/projects/${project.id}`}
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {project.shortDesc}
      </p>
      {stipendSummary && (
        <p className="mt-3 font-mono text-xs font-medium text-blue-700 dark:text-blue-400">
          Stipend · {stipendSummary}
        </p>
      )}
      {project.skills.length > 0 && (
        <ul aria-label="Required skills" className="mt-4 flex flex-wrap gap-2">
          {visibleSkills.map((skill) => (
            <li
              key={skill}
              className="border border-zinc-900/15 px-2.5 py-1 font-mono text-xs text-zinc-700 dark:border-zinc-100/15 dark:text-zinc-300"
            >
              {skill}
            </li>
          ))}
          {hiddenSkillCount > 0 && (
            <li className="px-2 py-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              +{hiddenSkillCount} more
            </li>
          )}
        </ul>
      )}
      <Link
        href={`/projects/${project.id}`}
        aria-label={`View details for ${project.title}`}
        className="mt-5 rounded-sm text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        View details →
      </Link>
    </article>
  );
}
