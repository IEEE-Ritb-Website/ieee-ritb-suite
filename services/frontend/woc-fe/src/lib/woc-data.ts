/**
 * Server-side data access for WOC pages.
 *
 * Keeps mock data isolated from production API logic: when the backend API
 * is configured and has data, data comes from `woc-api.ts`; otherwise pages
 * gracefully fall back to the real project listing from `mock-data.ts`.
 */

import {
  DEV_MOCK_ORGANIZATIONS,
  DEV_MOCK_PROBLEM_STATEMENTS,
} from "./mock-data";
import type { Organization, ProblemStatement } from "./woc-types";
import type { MyRegistration } from "./woc-api";
import {
  getMyRegistration,
  getProblemStatement,
  isWocApiConfigured,
  listOrganizations,
  listProblemStatements,
} from "./woc-api";

export type WocDataSource = "api" | "preview";

interface Snapshot<T> {
  data: T;
  source: WocDataSource;
  error?: string;
}

export async function getProjectsSnapshot(): Promise<
  Snapshot<ProblemStatement[]>
> {
  if (!isWocApiConfigured()) {
    return { data: DEV_MOCK_PROBLEM_STATEMENTS, source: "preview" };
  }
  try {
    const projects = await listProblemStatements();
    if (projects.length === 0) {
      return { data: DEV_MOCK_PROBLEM_STATEMENTS, source: "preview" };
    }
    return { data: projects, source: "api" };
  } catch (error) {
    return {
      data: DEV_MOCK_PROBLEM_STATEMENTS,
      source: "preview",
      error:
        error instanceof Error ? error.message : "Failed to load projects.",
    };
  }
}

export async function getProjectByIdSnapshot(
  id: string,
): Promise<Snapshot<ProblemStatement | null>> {
  if (!isWocApiConfigured()) {
    const fallback =
      DEV_MOCK_PROBLEM_STATEMENTS.find(
        (project) => project.id === id || ("slug" in project && (project as any).slug === id),
      ) ??
      DEV_MOCK_PROBLEM_STATEMENTS[0] ??
      null;
    return {
      data: fallback,
      source: "preview",
    };
  }
  try {
    const project = await getProblemStatement(id);
    if (!project) {
      const fallback =
        DEV_MOCK_PROBLEM_STATEMENTS.find(
          (p) => p.id === id || ("slug" in p && (p as any).slug === id),
        ) ??
        DEV_MOCK_PROBLEM_STATEMENTS[0] ??
        null;
      return { data: fallback, source: "preview" };
    }
    return { data: project, source: "api" };
  } catch (error) {
    const fallback =
      DEV_MOCK_PROBLEM_STATEMENTS.find(
        (p) => p.id === id || ("slug" in p && (p as any).slug === id),
      ) ??
      DEV_MOCK_PROBLEM_STATEMENTS[0] ??
      null;
    return {
      data: fallback,
      source: "preview",
      error:
        error instanceof Error ? error.message : "Failed to load project.",
    };
  }
}

export async function getOrganizationsSnapshot(): Promise<
  Snapshot<Organization[]>
> {
  if (!isWocApiConfigured()) {
    return { data: DEV_MOCK_ORGANIZATIONS, source: "preview" };
  }
  try {
    const orgs = await listOrganizations();
    if (orgs.length === 0) {
      return { data: DEV_MOCK_ORGANIZATIONS, source: "preview" };
    }
    return { data: orgs, source: "api" };
  } catch (error) {
    return {
      data: DEV_MOCK_ORGANIZATIONS,
      source: "preview",
      error:
        error instanceof Error
          ? error.message
          : "Failed to load organizations.",
    };
  }
}

export function buildOrganizationMap(
  organizations: Organization[],
): Map<string, Organization> {
  return new Map(organizations.map((org) => [org.id, org]));
}

export function countProjectsByOrganization(
  projects: ProblemStatement[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const project of projects) {
    counts.set(project.organization, (counts.get(project.organization) ?? 0) + 1);
  }
  return counts;
}

export type { MyRegistration };

export async function getMyRegistrationSnapshot(
  projectId: string,
  accessToken?: string,
): Promise<{ registration: MyRegistration }> {
  if (!isWocApiConfigured() || !accessToken) {
    return { registration: null };
  }
  try {
    return { registration: await getMyRegistration(projectId, accessToken) };
  } catch {
    return { registration: null };
  }
}
