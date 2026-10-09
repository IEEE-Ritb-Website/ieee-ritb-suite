/**
 * Backend API adapter for RIT Winter of Code.
 *
 * Talks to woc-service (see `services/backend/woc-service`). The service
 * wraps payloads in `{ success, data }` envelopes and stores Mongo
 * documents (`_id`, skill objects, `organizationId`) — this module unwraps
 * envelopes and maps documents onto the frontend contracts in
 * `woc-types.ts`, so components never deal with backend shapes directly.
 *
 * Set `NEXT_PUBLIC_WOC_API_BASE_URL` to the service origin
 * (e.g. `http://localhost:3004`) to use live data. When unset, all
 * functions throw `WocApiNotConfiguredError` and pages fall back to
 * clearly-labeled preview data via `woc-data.ts`.
 */

import type { Organization, ProblemStatement, StipendDetails } from "./woc-types";

export const WOC_API_BASE_URL = (
  process.env.NEXT_PUBLIC_WOC_API_BASE_URL ?? ""
).trim();

/** Backend routes on woc-service. */
export const WOC_ENDPOINTS = {
  problemStatements: "/api/projects?status=published&limit=100",
  problemStatementById: (id: string) => `/api/projects/${encodeURIComponent(id)}`,
  organizations: "/api/organizations?limit=100",
  registerForProblemStatement: (id: string) =>
    `/api/projects/${encodeURIComponent(id)}/register`,
} as const;

export function isWocApiConfigured(): boolean {
  return WOC_API_BASE_URL.length > 0;
}

export class WocApiNotConfiguredError extends Error {
  constructor() {
    super(
      "WOC API is not configured. Set NEXT_PUBLIC_WOC_API_BASE_URL (e.g. http://localhost:3004).",
    );
    this.name = "WocApiNotConfiguredError";
  }
}

type ApiOrganization = {
  _id?: unknown;
  name: string;
  imageUrl?: string;
  tagline?: string;
};

type ApiProblemStatement = {
  _id?: unknown;
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  stipendDetails?: {
    type?: string;
    amount?: number;
    minAmount?: number;
    maxAmount?: number;
    currency?: string;
    notes?: string;
  };
  skills?: ({ name: string } | string)[];
  organizationId?: string;
};

function formatStipendAmount(raw: NonNullable<ApiProblemStatement["stipendDetails"]>): string | undefined {
  const currency = raw.currency ?? "INR";
  if (typeof raw.amount === "number") return `${currency} ${raw.amount}`;
  if (typeof raw.minAmount === "number") {
    return `${currency} ${raw.minAmount}${typeof raw.maxAmount === "number" ? ` – ${raw.maxAmount}` : "+"}`;
  }
  if (raw.type && raw.type !== "unpaid") return raw.type;
  return undefined;
}

function mapOrganization(raw: ApiOrganization): Organization {
  return {
    id: String(raw._id ?? ""),
    name: raw.name,
    imageUrl: raw.imageUrl ?? "",
    tagline: raw.tagline ?? "",
  };
}

function mapProblemStatement(raw: ApiProblemStatement): ProblemStatement {
  const stipendDetails: StipendDetails = {};
  if (raw.stipendDetails) {
    const amount = formatStipendAmount(raw.stipendDetails);
    if (amount !== undefined) stipendDetails.amount = amount;
    if (raw.stipendDetails.currency) stipendDetails.currency = raw.stipendDetails.currency;
    if (raw.stipendDetails.notes) stipendDetails.note = raw.stipendDetails.notes;
  }
  return {
    id: String(raw._id ?? ""),
    title: raw.title,
    shortDesc: raw.shortDesc,
    longDesc: raw.longDesc,
    stipendDetails,
    skills: (raw.skills ?? []).map((skill) =>
      typeof skill === "string" ? skill : (skill?.name ?? ""),
    ).filter((skill) => skill.length > 0),
    organization: raw.organizationId ?? "",
  };
}

async function fetchApi<T>(path: string): Promise<T> {
  if (!isWocApiConfigured()) throw new WocApiNotConfiguredError();
  let response: Response;
  try {
    response = await fetch(`${WOC_API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not reach the Winter of Code service (is woc-service running?).",
    );
  }
  const body = (await response.json().catch(() => undefined)) as
    | { data?: T; error?: { message?: string } }
    | undefined;
  if (!response.ok) {
    const error = new Error(
      body?.error?.message ?? `WOC API request failed (${response.status}).`,
    );
    (error as { status?: number }).status = response.status;
    throw error;
  }
  return (body as { data: T }).data;
}

export async function listProblemStatements(): Promise<ProblemStatement[]> {
  const data = await fetchApi<{ projects: ApiProblemStatement[] }>(
    WOC_ENDPOINTS.problemStatements,
  );
  return data.projects.map(mapProblemStatement);
}

export async function getProblemStatement(
  id: string,
): Promise<ProblemStatement | null> {
  try {
    return mapProblemStatement(
      await fetchApi<ApiProblemStatement>(WOC_ENDPOINTS.problemStatementById(id)),
    );
  } catch (error) {
    if ((error as { status?: number })?.status === 404) return null;
    throw error;
  }
}

export async function listOrganizations(): Promise<Organization[]> {
  const data = await fetchApi<{ organizations: ApiOrganization[] }>(
    WOC_ENDPOINTS.organizations,
  );
  return data.organizations.map(mapOrganization);
}
