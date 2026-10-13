import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PreviewDataNotice from "@/components/PreviewDataNotice";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { getSessionUser } from "@/lib/auth-session";
import { createClient } from "@/lib/supabase/server";
import {
  buildOrganizationMap,
  getMyRegistrationSnapshot,
  getOrganizationsSnapshot,
  getProjectByIdSnapshot,
  type MyRegistration,
} from "@/lib/woc-data";

interface RegisterPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const { id } = await params;
  const snapshot = await getProjectByIdSnapshot(id);
  return {
    title: snapshot.data
      ? `Register · ${snapshot.data.title}`
      : "Register for a Problem Statement",
    description: "Review the project details and submit your registration.",
  };
}

function getStipendSummary(stipendDetails: Record<string, unknown>): string | null {
  const parts: string[] = [];
  if (
    typeof stipendDetails.amount === "string" ||
    typeof stipendDetails.amount === "number"
  ) {
    parts.push(String(stipendDetails.amount));
  }
  if (typeof stipendDetails.currency === "string") {
    parts.push(stipendDetails.currency);
  }
  return parts.length > 0 ? parts.join(" ") : null;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { id } = await params;

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(`/projects/${id}/register`)}`);
  }

  const [projectSnapshot, organizationsSnapshot] = await Promise.all([
    getProjectByIdSnapshot(id),
    getOrganizationsSnapshot(),
  ]);

  if (projectSnapshot.error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
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

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { registration: myRegistration }: { registration: MyRegistration } =
    await getMyRegistrationSnapshot(id, session?.access_token ?? undefined);

  const organizationsById = buildOrganizationMap(organizationsSnapshot.data);
  const organization = organizationsById.get(project.organization);
  const stipendSummary = getStipendSummary(
    project.stipendDetails as Record<string, unknown>,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <Link
        href={`/projects/${project.id}`}
        className="rounded-sm text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Back to problem statement
      </Link>

      <p className="mt-8 font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
        Registration
      </p>
      <h1 className="mt-4 font-mono text-4xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-5xl dark:text-zinc-50">
        Register for a Problem Statement
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Review the project details and submit your registration.
      </p>

      {projectSnapshot.source === "preview" && (
        <div className="mt-8">
          <PreviewDataNotice resource="entry" />
        </div>
      )}

      {myRegistration ? (
        <div
          role="status"
          className="mt-10 border border-blue-700/30 bg-blue-50 px-6 py-10 text-center dark:border-blue-400/30 dark:bg-blue-950"
        >
          <h2 className="font-mono text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            You&apos;ve already applied
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Your application for {project.title} is {myRegistration.status}.
            Watch your email for updates during the submission period
            (October 15 – October 31).
          </p>
          <Link
            href={`/projects/${project.id}`}
            className="mt-6 inline-block rounded-sm text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to problem statement
          </Link>
        </div>
      ) : (
      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <section
          aria-labelledby="register-summary-heading"
          className="h-fit border border-zinc-900/10 bg-white p-6 sm:p-8 lg:sticky lg:top-24 dark:border-zinc-100/10 dark:bg-zinc-950"
        >
          <h2
            id="register-summary-heading"
            className="font-mono text-xs font-medium tracking-[0.25em] text-zinc-500 uppercase dark:text-zinc-400"
          >
            Selected problem statement
          </h2>
          {organization && (
            <p className="mt-4 font-mono text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
              {organization.name}
            </p>
          )}
          <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {project.title}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {project.shortDesc}
          </p>
          {stipendSummary && (
            <p className="mt-3 font-mono text-xs font-medium text-blue-700 dark:text-blue-400">
              Stipend · {stipendSummary}
            </p>
          )}
          {project.skills.length > 0 && (
            <ul aria-label="Required skills" className="mt-4 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <li
                  key={skill}
                  className="border border-zinc-900/15 px-2.5 py-1 font-mono text-xs text-zinc-700 dark:border-zinc-100/15 dark:text-zinc-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/projects/${project.id}`}
            className="mt-6 inline-block rounded-sm text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View full details →
          </Link>
        </section>

        <section aria-labelledby="register-form-heading">
          <h2 id="register-form-heading" className="sr-only">
            Registration form
          </h2>
          <RegistrationForm
            projectId={project.id}
            suggestedSkills={project.skills}
            initialName={sessionUser.name ?? ""}
            initialEmail={sessionUser.email ?? ""}
          />
        </section>
      </div>
      )}
    </div>
  );
}
