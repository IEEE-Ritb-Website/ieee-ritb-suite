/**
 * Server-side data access for WOC pages.
 *
 * Keeps mock data isolated from production API logic: when the backend API
 * is configured, data comes from `woc-api.ts`; otherwise pages explicitly
 * opt in to clearly-labeled development preview data. Components receive
 * plain data plus a `source` flag so they can render the preview notice.
 */

import {
  DEV_MOCK_ORGANIZATIONS,
  DEV_MOCK_PROBLEM_STATEMENTS,
} from "./mock-data";
import type { Organization, ProblemStatement } from "./woc-types";
import {
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
    return { data: await listProblemStatements(), source: "api" };
  } catch (error) {
    return {
      data: [],
      source: "api",
      error:
        error instanceof Error ? error.message : "Failed to load projects.",
    };
  }
}

export async function getProjectByIdSnapshot(
  id: string,
): Promise<Snapshot<ProblemStatement | null>> {
  if (!isWocApiConfigured()) {
    return {
      data:
        DEV_MOCK_PROBLEM_STATEMENTS.find((project) => project.id === id) ??
        null,
      source: "preview",
    };
  }
  try {
    return { data: await getProblemStatement(id), source: "api" };
  } catch (error) {
    return {
      data: null,
      source: "api",
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
    return { data: await listOrganizations(), source: "api" };
  } catch (error) {
    return {
      data: [],
      source: "api",
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
