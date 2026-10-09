/**
 * API integration layer for RIT Winter of Code.
 *
 * This is the single place where the frontend talks to the backend over
 * HTTP. Presentation components must import data through `woc-data.ts`,
 * never through `fetch` directly.
 *
 * NOTE: no backend endpoints exist yet — woc-service currently only exposes
 * scaffold routes (ping/sample/cron). The paths in `WOC_ENDPOINTS` are
 * PROVISIONAL and must be confirmed with the backend teammate before use.
 * All functions throw `WocApiNotConfiguredError` when
 * `NEXT_PUBLIC_WOC_API_BASE_URL` is unset.
 */

import type { Organization, ProblemStatement } from "./woc-types";

export const WOC_API_BASE_URL = (
  process.env.NEXT_PUBLIC_WOC_API_BASE_URL ?? ""
).trim();

/** PROVISIONAL route paths — confirm with the backend teammate. */
export const WOC_ENDPOINTS = {
  problemStatements: "/problem-statements",
  problemStatementById: (id: string) => `/problem-statements/${id}`,
  organizations: "/organizations",
} as const;

export function isWocApiConfigured(): boolean {
  return WOC_API_BASE_URL.length > 0;
}

export class WocApiNotConfiguredError extends Error {
  constructor() {
    super(
      "WOC API is not configured. Set NEXT_PUBLIC_WOC_API_BASE_URL (see .env.example).",
    );
    this.name = "WocApiNotConfiguredError";
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  if (!isWocApiConfigured()) throw new WocApiNotConfiguredError();
  const response = await fetch(`${WOC_API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      `WOC API request failed: ${response.status} ${response.statusText} (${path})`,
    );
  }
  return (await response.json()) as T;
}

export function listProblemStatements(): Promise<ProblemStatement[]> {
  return fetchJson<ProblemStatement[]>(WOC_ENDPOINTS.problemStatements);
}

export function getProblemStatement(
  id: string,
): Promise<ProblemStatement | null> {
  return fetchJson<ProblemStatement | null>(
    WOC_ENDPOINTS.problemStatementById(id),
  );
}

export function listOrganizations(): Promise<Organization[]> {
  return fetchJson<Organization[]>(WOC_ENDPOINTS.organizations);
}
