import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import HighlightsSection from "@/components/home/HighlightsSection";
import IntroductionSection from "@/components/home/IntroductionSection";
import TimelineSection from "@/components/home/TimelineSection";
import OrganizationCard from "@/components/organizations/OrganizationCard";
import PreviewDataNotice from "@/components/PreviewDataNotice";
import ProjectCard from "@/components/projects/ProjectCard";
import {
  buildOrganizationMap,
  countProjectsByOrganization,
  getOrganizationsSnapshot,
  getProjectsSnapshot,
} from "@/lib/woc-data";

export const metadata: Metadata = {
  title: "RIT Winter of Code",
  description:
    "RIT Winter of Code is a winter-long open-source program where students build real solutions for participating organizations.",
};

export default async function Home() {
  const [projectsSnapshot, organizationsSnapshot] = await Promise.all([
    getProjectsSnapshot(),
    getOrganizationsSnapshot(),
  ]);
  const organizationsById = buildOrganizationMap(organizationsSnapshot.data);
  const projectCounts = countProjectsByOrganization(projectsSnapshot.data);
  const previewProjects = projectsSnapshot.data.slice(0, 3);
  const previewOrganizations = organizationsSnapshot.data.slice(0, 3);
  const showingPreview =
    projectsSnapshot.source === "preview" ||
    organizationsSnapshot.source === "preview";

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Hero />
      </div>

      <IntroductionSection />

      <HighlightsSection />

      <TimelineSection />

      <section
        aria-labelledby="home-projects-heading"
        className="border-t border-zinc-900/10 dark:border-zinc-100/10"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-24">
          <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
            Problem statements
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2
              id="home-projects-heading"
              className="max-w-xl text-3xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-4xl dark:text-zinc-50"
            >
              Explore Problem Statements
            </h2>
            <Link
              href="/projects"
              className="rounded text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all problem statements →
            </Link>
          </div>
          {showingPreview && (
            <div className="mt-8">
              <PreviewDataNotice resource="data" />
            </div>
          )}
          {previewProjects.length === 0 ? (
            <p className="mt-8 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              No problem statements have been published yet. Check back during
              the submission period (October 15 – October 31).
            </p>
          ) : (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {previewProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  organizationName={organizationsById.get(project.organization)?.name}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        aria-labelledby="home-orgs-heading"
        className="border-t border-zinc-900/10 dark:border-zinc-100/10"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-24">
          <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
            Organizations
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2
              id="home-orgs-heading"
              className="max-w-xl text-3xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-4xl dark:text-zinc-50"
            >
              Participating Organizations
            </h2>
            <Link
              href="/organizations"
              className="rounded text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all organizations →
            </Link>
          </div>
          {previewOrganizations.length === 0 ? (
            <p className="mt-8 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Participating organizations will be announced soon.
            </p>
          ) : (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {previewOrganizations.map((organization) => (
                <OrganizationCard
                  key={organization.id}
                  organization={organization}
                  projectCount={projectCounts.get(organization.id) ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
