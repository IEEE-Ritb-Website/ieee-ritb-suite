import type { Metadata } from "next";
import OrganizationCard from "@/components/organizations/OrganizationCard";
import PreviewDataNotice from "@/components/PreviewDataNotice";
import {
  countProjectsByOrganization,
  getOrganizationsSnapshot,
  getProjectsSnapshot,
} from "@/lib/woc-data";

export const metadata: Metadata = {
  title: "Organizations",
  description:
    "Organizations participating in RIT Winter of Code with their problem statements.",
};

export default async function OrganizationsPage() {
  const [organizationsSnapshot, projectsSnapshot] = await Promise.all([
    getOrganizationsSnapshot(),
    getProjectsSnapshot(),
  ]);
  const projectCounts = countProjectsByOrganization(projectsSnapshot.data);

  if (organizationsSnapshot.error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <PageHeading />
        <div
          role="alert"
          className="mt-8 border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          Couldn&apos;t load organizations: {organizationsSnapshot.error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <PageHeading />
      {organizationsSnapshot.source === "preview" && (
        <div className="mt-8">
          <PreviewDataNotice resource="data" />
        </div>
      )}
      {organizationsSnapshot.data.length === 0 ? (
        <p className="mt-8 border border-zinc-900/10 px-4 py-10 text-center text-base leading-7 text-zinc-600 dark:border-zinc-100/10 dark:text-zinc-400">
          Participating organizations will be announced soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizationsSnapshot.data.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
              projectCount={projectCounts.get(organization.id) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PageHeading() {
  return (
    <div>
      <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
        Organizations
      </p>
      <h1 className="mt-4 font-mono text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        Participating organizations
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Each organization publishes the problem statements you can work on
        during the program.
      </p>
    </div>
  );
}
