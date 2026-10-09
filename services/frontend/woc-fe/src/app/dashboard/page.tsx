import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/auth-config";
import { getSessionUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your RIT Winter of Code dashboard.",
};

const PARTICIPATION_SECTIONS = [
  {
    title: "My proposals",
    description:
      "Proposals you submit during the submission period will appear here.",
  },
  {
    title: "My projects",
    description:
      "Accepted projects and their progress will be tracked here.",
  },
  {
    title: "Profile",
    description:
      "Your linked GitHub profile and contact details will live here.",
  },
];

export default async function DashboardPage() {
  const sessionUser = await getSessionUser();

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
          Dashboard
        </p>
        <h1 className="mt-4 font-mono text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Sign in required
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          The dashboard is protected. GitHub sign-in via Supabase is not
          configured yet, so there is no session to display — and no demo
          session is faked in its place.
        </p>
        <Link
          href="/auth/sign-in"
          className="mt-8 inline-flex items-center justify-center bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Go to sign in
        </Link>

        <section aria-labelledby="dashboard-preview-heading" className="mt-16">
          <h2
            id="dashboard-preview-heading"
            className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            What the dashboard will show
          </h2>
          <ParticipationGrid />
        </section>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
          Dashboard
        </p>
        <h1 className="mt-4 font-mono text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Sign in required
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          You need to sign in with GitHub to view your dashboard.
        </p>
        <Link
          href="/auth/sign-in"
          className="mt-8 inline-flex items-center justify-center bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Sign in with GitHub
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
        Dashboard
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-5">
        {sessionUser.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sessionUser.avatarUrl}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 border border-zinc-900/10 object-cover dark:border-zinc-100/10"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center bg-zinc-900 font-mono text-xl font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {(sessionUser.name ?? "•").trim().charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="font-mono text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            {sessionUser.name ?? "Your dashboard"}
          </h1>
          {sessionUser.email && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {sessionUser.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/projects"
          className="inline-flex items-center justify-center bg-blue-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Explore problem statements
        </Link>
      </div>

      <section aria-labelledby="participation-heading" className="mt-14">
        <h2
          id="participation-heading"
          className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Your participation
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Proposals and project status will load here once the backend API
          contract is agreed — nothing is shown until real data exists.
        </p>
        <div className="mt-6">
          <ParticipationGrid />
        </div>
      </section>
    </div>
  );
}

function ParticipationGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PARTICIPATION_SECTIONS.map((section: { title: string; description: string }) => (
        <div
          key={section.title}
          aria-disabled="true"
          className="border border-dashed border-zinc-900/20 p-6 opacity-70 dark:border-zinc-100/20"
        >
          <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {section.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {section.description}
          </p>
          <p className="mt-3 font-mono text-xs text-zinc-500 dark:text-zinc-500">
            Available after backend integration
          </p>
        </div>
      ))}
    </div>
  );
}
