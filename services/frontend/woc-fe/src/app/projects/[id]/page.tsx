import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrganizationCard from "@/components/organizations/OrganizationCard";
import PreviewDataNotice from "@/components/PreviewDataNotice";
import {
  buildOrganizationMap,
  getOrganizationsSnapshot,
  getProjectByIdSnapshot,
  getProjectsSnapshot,
} from "@/lib/woc-data";

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const snapshot = await getProjectsSnapshot();
  return snapshot.data.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: ProjectDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const snapshot = await getProjectByIdSnapshot(id);
  return {
    title: snapshot.data ? snapshot.data.title : "Problem statement",
    description: snapshot.data?.shortDesc,
  };
}

function formatStipendValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return JSON.stringify(value);
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { id } = await params;
  const [projectSnapshot, organizationsSnapshot] = await Promise.all([
    getProjectByIdSnapshot(id),
    getOrganizationsSnapshot(),
  ]);

  if (projectSnapshot.error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <div
          role="alert"
          className="border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          Couldn&apos;t load this problem statement: {projectSnapshot.error}
        </div>
        <Link
          href="/projects"
          className="mt-6 inline-block rounded-sm text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400"
        >
          ← Back to all projects
        </Link>
      </div>
    );
  }

  const project = projectSnapshot.data;
  if (!project) notFound();

  const organizationsById = buildOrganizationMap(organizationsSnapshot.data);
  const organization = organizationsById.get(project.organization);
  const stipendEntries = Object.entries(project.stipendDetails);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 md:py-24">
      <Link
        href="/projects"
        className="rounded-sm text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Back to all projects
      </Link>

      {projectSnapshot.source === "preview" && (
        <div className="mt-6">
          <PreviewDataNotice resource="entry" />
        </div>
      )}

      {organization && (
        <p className="mt-8 font-mono text-xs font-medium tracking-[0.25em] text-zinc-500 uppercase dark:text-zinc-400">
          {organization.name}
        </p>
      )}
      <h1 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-4xl md:text-5xl dark:text-zinc-50">
        {project.title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {project.shortDesc}
      </p>

      <section aria-labelledby="overview-heading" className="mt-12 border-t border-zinc-900/10 pt-8 dark:border-zinc-100/10">
        <h2
          id="overview-heading"
          className="font-mono text-xs font-medium tracking-[0.25em] text-blue-700 uppercase dark:text-blue-400"
        >
          Overview
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {project.longDesc}
        </p>
      </section>

      {project.skills.length > 0 && (
        <section aria-labelledby="skills-heading" className="mt-10 border-t border-zinc-900/10 pt-8 dark:border-zinc-100/10">
          <h2
            id="skills-heading"
            className="font-mono text-xs font-medium tracking-[0.25em] text-blue-700 uppercase dark:text-blue-400"
          >
            Skills
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <li
                key={skill}
                className="border border-zinc-900/15 px-3 py-1.5 font-mono text-xs text-zinc-700 dark:border-zinc-100/15 dark:text-zinc-300"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="stipend-heading" className="mt-10 border-t border-zinc-900/10 pt-8 dark:border-zinc-100/10">
        <h2
          id="stipend-heading"
          className="font-mono text-xs font-medium tracking-[0.25em] text-blue-700 uppercase dark:text-blue-400"
        >
          Stipend details
        </h2>
        {stipendEntries.length === 0 ? (
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Stipend details have not been published for this problem statement
            yet.
          </p>
        ) : (
          <dl className="mt-4 border border-zinc-900/10 dark:border-zinc-100/10">
            {stipendEntries.map(([key, value]) => (
              <div
                key={key}
                className="grid gap-1 border-b border-zinc-900/10 px-4 py-3 last:border-b-0 sm:grid-cols-[180px_1fr] dark:border-zinc-100/10"
              >
                <dt className="font-mono text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  {key}
                </dt>
                <dd className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {formatStipendValue(value)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {organization && (
        <section aria-labelledby="org-heading" className="mt-10 border-t border-zinc-900/10 pt-8 dark:border-zinc-100/10">
          <h2
            id="org-heading"
            className="font-mono text-xs font-medium tracking-[0.25em] text-blue-700 uppercase dark:text-blue-400"
          >
            Organization
          </h2>
          <div className="mt-4">
            <OrganizationCard organization={organization} />
          </div>
        </section>
      )}

      <div className="mt-12 border border-zinc-900/10 bg-white px-6 py-10 text-center sm:px-12 dark:border-zinc-100/10 dark:bg-zinc-950">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
          Interested in this problem statement?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Sign in with GitHub to get started. Proposals are accepted during the
          submission period (October 15 – October 31).
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/projects/${project.id}/register`}
            className="inline-flex items-center justify-center bg-blue-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Register for This Project
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center justify-center border border-zinc-900/20 px-8 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-100/20 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
          >
            Sign in with GitHub
          </Link>
        </div>
      </div>
    </div>
  );
}
