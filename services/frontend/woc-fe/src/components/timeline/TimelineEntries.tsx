import Link from "next/link";
import type { TimelinePhase } from "@/lib/program";

export interface TimelineAction {
  href: string;
  label: string;
}

interface TimelineEntriesProps {
  phases: TimelinePhase[];
  layout: "preview" | "full";
  /** Optional per-phase links, keyed by phase id. Rendered in `full` layout. */
  actionLinks?: Record<string, TimelineAction>;
}

function PhaseIndex({ index }: { index: number }) {
  return (
    <p
      aria-hidden="true"
      className="font-mono text-sm text-blue-700 dark:text-blue-400"
    >
      {String(index + 1).padStart(2, "0")}
    </p>
  );
}

export default function TimelineEntries({
  phases,
  layout,
  actionLinks,
}: TimelineEntriesProps) {
  if (layout === "full") {
    return (
      <ol>
        {phases.map((phase, index) => {
          const action = actionLinks?.[phase.id];
          return (
            <li
              key={phase.id}
              className="border-t border-zinc-900/10 py-10 last:border-b md:py-12 dark:border-zinc-100/10"
            >
              <p className="font-mono text-xs font-medium tracking-[0.25em] text-blue-700 uppercase dark:text-blue-400">
                Phase {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl dark:text-zinc-50">
                {phase.name}
              </h2>
              <p className="mt-4 font-mono text-xl font-medium tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                {phase.startDate}
                <span aria-hidden="true" className="mx-3 text-zinc-400 dark:text-zinc-500">
                  —
                </span>
                <span className="sr-only">to</span>
                {phase.endDate}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 dark:text-zinc-400">
                {phase.description}
              </p>
              {action && (
                <Link
                  href={action.href}
                  className="mt-5 inline-block rounded text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {action.label} →
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol>
      {phases.map((phase, index) => (
        <li
          key={phase.id}
          className="grid gap-2 border-t border-zinc-900/10 py-8 last:border-b sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-8 dark:border-zinc-100/10"
        >
          <PhaseIndex index={index} />
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
              {phase.name}
            </h3>
            <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              {phase.description}
            </p>
          </div>
          <p className="font-mono text-sm font-medium whitespace-nowrap text-zinc-900 sm:text-right dark:text-zinc-100">
            {phase.dateRange}
          </p>
        </li>
      ))}
    </ol>
  );
}
