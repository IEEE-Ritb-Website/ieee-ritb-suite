import Link from "next/link";

const PROGRAM_FACTS = [
  {
    label: "Submission",
    date: "Oct 15 – Oct 31",
    description: "Browse published problem statements and submit your proposal.",
  },
  {
    label: "Coding",
    date: "Nov 01 – Dec 31",
    description: "Build your accepted proposal in the open and ship it.",
  },
  {
    label: "Participation",
    date: "Proposals → Dashboard",
    description:
      "Sign in with GitHub to submit proposals and track your progress.",
  },
];

export default function IntroductionSection() {
  return (
    <section
      aria-labelledby="intro-heading"
      className="grid md:grid-cols-2"
    >
      <div className="flex flex-col justify-center bg-blue-700 px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
        <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-100 uppercase">
          Program introduction
        </p>
        <h2
          id="intro-heading"
          className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
        >
          What is RIT Winter of Code?
        </h2>
        <p className="mt-6 max-w-md text-base leading-7 text-blue-50">
          A winter-long program by IEEE RIT-B that connects students with
          participating organizations. Contributors take on real problem
          statements — proposing solutions in October, then building them
          through November and December.
        </p>
        <div className="mt-8">
          <Link
            href="/timeline"
            className="inline-flex items-center justify-center bg-white px-8 py-3 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Learn More
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center bg-zinc-900 px-6 py-14 sm:px-10 lg:px-14 lg:py-20 dark:bg-zinc-900">
        <dl className="divide-y divide-zinc-100/10">
          {PROGRAM_FACTS.map((fact) => (
            <div key={fact.label} className="py-6 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <dt className="font-mono text-xs font-medium tracking-[0.25em] text-zinc-400 uppercase">
                  {fact.label}
                </dt>
                <dd className="font-mono text-sm font-medium text-white">
                  {fact.date}
                </dd>
              </div>
              <dd className="mt-2 max-w-md text-base leading-7 text-zinc-300">
                {fact.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
