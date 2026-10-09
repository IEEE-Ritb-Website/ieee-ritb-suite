import Link from "next/link";
import TimelineEntries from "@/components/timeline/TimelineEntries";
import { TIMELINE_PHASES } from "@/lib/program";

export default function TimelineSection() {
  return (
    <section
      id="timeline"
      aria-labelledby="timeline-heading"
      className="scroll-mt-20 border-t border-zinc-900/10 dark:border-zinc-100/10"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
          Timeline
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h2
            id="timeline-heading"
            className="max-w-xl text-3xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-4xl dark:text-zinc-50"
          >
            Two phases, one winter
          </h2>
          <Link
            href="/timeline"
            className="inline-flex items-center justify-center border border-zinc-900/20 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-100/20 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
          >
            View complete timeline
          </Link>
        </div>

        <div className="mt-12">
          <TimelineEntries phases={TIMELINE_PHASES} layout="preview" />
        </div>
      </div>
    </section>
  );
}
