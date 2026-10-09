import Link from "next/link";

export default function Hero() {
  return (
    <section
      aria-labelledby="woc-hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-1/4 -right-32 h-[28rem] w-[28rem] rounded-full bg-blue-600/15 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -right-16 bottom-0 h-[18rem] w-[18rem] rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/[0.07]" />
      </div>

      <div className="relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-16 md:min-h-[calc(100svh-4rem)] md:py-20">
        <p className="woc-rise font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
          IEEE RIT-B
        </p>
        <h1
          id="woc-hero-heading"
          className="woc-rise mt-6 font-mono text-[clamp(3.25rem,9vw,7.5rem)] leading-[0.95] font-semibold tracking-tight text-zinc-900 text-balance dark:text-zinc-50"
        >
          <span className="block">RIT Winter</span>
          <span className="block">of Code</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          RIT Winter of Code is a winter-long open-source program where
          students team up with participating organizations to design, build,
          and ship real software — from proposal to working code.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center bg-blue-700 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Explore Problem Statements
          </Link>
          <Link
            href="/#timeline"
            className="inline-flex items-center justify-center border border-zinc-900/20 px-8 py-3.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-100/20 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
          >
            View Timeline
          </Link>
        </div>
      </div>
    </section>
  );
}
