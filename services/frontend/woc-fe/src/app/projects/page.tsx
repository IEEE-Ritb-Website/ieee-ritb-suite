import type { Metadata } from "next";
import PreviewDataNotice from "@/components/PreviewDataNotice";
import ProjectCard from "@/components/projects/ProjectCard";
import { buildOrganizationMap, getOrganizationsSnapshot, getProjectsSnapshot } from "@/lib/woc-data";

export const metadata: Metadata = {
  title: "Problem statements",
  description:
    "Browse the problem statements published for RIT Winter of Code.",
};

export default async function ProjectsPage() {
  const [snapshot, organizationsSnapshot] = await Promise.all([
    getProjectsSnapshot(),
    getOrganizationsSnapshot(),
  ]);
  const organizationsById = buildOrganizationMap(organizationsSnapshot.data);

  if (snapshot.error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <PageHeading />
        <div
          role="alert"
          className="mt-8 border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          Couldn&apos;t load problem statements: {snapshot.error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <PageHeading count={snapshot.data.length} />
      {snapshot.source === "preview" && (
        <div className="mt-8">
          <PreviewDataNotice resource="data" />
        </div>
      )}
      {snapshot.data.length === 0 ? (
        <p className="mt-8 border border-zinc-900/10 px-4 py-10 text-center text-base leading-7 text-zinc-600 dark:border-zinc-100/10 dark:text-zinc-400">
          No problem statements have been published yet. Check back during the
          submission period (October 15 – October 31).
        </p>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {snapshot.data.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              organizationName={organizationsById.get(project.organization)?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PageHeading({ count }: { count?: number }) {
  return (
    <div>
      <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
        Problem statements
      </p>
      <h1 className="mt-4 font-mono text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        Explore projects
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {typeof count === "number" && count > 0
          ? `${count} problem statement${count === 1 ? "" : "s"} open for browsing.`
          : "Browse the problem statements published by participating organizations."}
      </p>
    </div>
  );
}
