import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28">
      <p className="font-mono text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">
        Not found
      </p>
      <h1 className="mt-4 font-mono text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Problem statement not found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
        This problem statement doesn&apos;t exist or hasn&apos;t been published
        yet.
      </p>
      <Link
        href="/projects"
        className="mt-8 inline-flex items-center justify-center bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Back to all projects
      </Link>
    </div>
  );
}
