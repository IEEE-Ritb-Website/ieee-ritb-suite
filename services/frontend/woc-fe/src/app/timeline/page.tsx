import type { Metadata } from "next";
import Link from "next/link";
import TimelineEntries from "@/components/timeline/TimelineEntries";
import { TIMELINE_PHASES } from "@/lib/program";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Key dates for RIT Winter of Code: submission period (October 15 – October 31) and coding period (November 1 – December 31).",
};

const PHASE_ACTIONS: Record<string, { href: string; label: string }> = {
  submission: {
    href: "/projects",
    label: "Browse problem statements",
  },
  coding: {
    href: "/auth/sign-in",
    label: "Sign in to track progress",
  },
};

export default function TimelinePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
        Timeline
      </p>
      <h1 className="mt-4 font-mono text-[clamp(2.75rem,7vw,5rem)] leading-[0.95] font-semibold tracking-tight text-balance text-zinc-900 dark:text-zinc-50">
        Program timeline
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        RIT Winter of Code runs in two phases. Proposals are submitted first,
        then accepted contributors spend the rest of the winter building.
      </p>

      <div className="mt-12 md:mt-16">
        <TimelineEntries
          phases={TIMELINE_PHASES}
          layout="full"
          actionLinks={PHASE_ACTIONS}
        />
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/projects"
          className="inline-flex items-center justify-center bg-blue-700 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Explore Problem Statements
        </Link>
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center justify-center border border-zinc-900/20 px-8 py-3.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-100/20 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
        >
          Sign in with GitHub
        </Link>
      </div>
    </div>
  );
}
