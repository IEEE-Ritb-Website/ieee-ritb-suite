const PILLARS = [
  {
    word: "Build.",
    description:
      "Take on real problem statements published by participating organizations and turn proposals into working software.",
  },
  {
    word: "Contribute.",
    description:
      "Work the open-source way — in the open, with review and iteration, alongside the people who maintain the work.",
  },
  {
    word: "Learn.",
    description:
      "Practice the full arc of collaborative development, from reading a problem statement to shipping a solution.",
  },
];

export default function HighlightsSection() {
  return (
    <section
      aria-labelledby="highlights-heading"
      className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28"
    >
      <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
        Program highlights
      </p>
      <h2
        id="highlights-heading"
        className="mt-4 font-mono text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl dark:text-zinc-50"
      >
        Build. Contribute. Learn.
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Winter of Code is built around open-source contribution and
        collaborative development — small proposals, steady building, and
        shared review.
      </p>
      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {PILLARS.map((pillar, index) => (
          <article
            key={pillar.word}
            className="border-t-2 border-zinc-900 pt-6 dark:border-zinc-100"
          >
            <p
              aria-hidden="true"
              className="font-mono text-xs text-zinc-400 dark:text-zinc-500"
            >
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {pillar.word}
            </h3>
            <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              {pillar.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
