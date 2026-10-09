/**
 * Registration service for RIT Winter of Code problem statements.
 *
 * Keeps the registration form schema, frontend validation, and submission
 * logic in one isolated place so the UI never talks to an API directly.
 *
 * BACKEND CONTRACT (woc-service, `POST /api/projects/:id/register`):
 * - Request body: `{ participant: { name, email, institution?, year? },
 *   proposal: { statement, githubUrl? } }`
 * - 2xx → `{ status: "success" }`
 * - 409 → `{ status: "duplicate" }` (same email already registered)
 * - 401 → `{ status: "session-expired" }`
 * - network failure → `{ status: "network-error" }`
 * - other non-2xx → `{ status: "server-error" }`
 *
 * Requires `NEXT_PUBLIC_WOC_API_BASE_URL` (same variable as `woc-api.ts`).
 * Without it, `submitRegistration()` throws `RegistrationNotConfiguredError`
 * and the form shows its "not connected" notice — no success is ever
 * displayed until the real backend confirms it.
 */

export interface RegistrationFormData {
  problemStatementId: string;
  fullName: string;
  email: string;
  githubProfileUrl: string;
  college: string;
  academicYear: string;
  interest: string;
  skills: string[];
  additionalInfo: string;
}

export type RegistrationField =
  | "fullName"
  | "email"
  | "githubProfileUrl"
  | "college"
  | "academicYear"
  | "interest";

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export const ACADEMIC_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
  "Postgraduate",
  "Other",
] as const;

export const MIN_INTEREST_LENGTH = 20;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GITHUB_USERNAME_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidGitHubProfileUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  if (url.hostname.toLowerCase() !== "github.com") return false;
  const segments = url.pathname.split("/").filter(Boolean);
  return segments.length === 1 && GITHUB_USERNAME_PATTERN.test(segments[0]);
}

export function validateRegistrationForm(
  data: Omit<
    RegistrationFormData,
    "problemStatementId" | "skills" | "additionalInfo"
  >,
): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (data.fullName.trim().length === 0) {
    errors.fullName = "Enter your full name.";
  }
  if (data.email.trim().length === 0) {
    errors.email = "Enter your email address.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Enter a valid email address (e.g. name@college.edu).";
  }
  if (data.githubProfileUrl.trim().length === 0) {
    errors.githubProfileUrl = "Enter your GitHub profile URL.";
  } else if (!isValidGitHubProfileUrl(data.githubProfileUrl)) {
    errors.githubProfileUrl =
      "Enter a valid GitHub profile URL (e.g. https://github.com/octocat).";
  }
  if (data.college.trim().length === 0) {
    errors.college = "Enter your college or institution.";
  }
  if (data.academicYear.trim().length === 0) {
    errors.academicYear = "Select your current academic year.";
  }
  if (data.interest.trim().length === 0) {
    errors.interest = "Tell us why you are interested in this project.";
  } else if (data.interest.trim().length < MIN_INTEREST_LENGTH) {
    errors.interest = `Use at least ${MIN_INTEREST_LENGTH} characters so reviewers understand your motivation.`;
  }
  return errors;
}

export type RegistrationStatus =
  | "success"
  | "duplicate"
  | "session-expired"
  | "network-error"
  | "server-error";

export interface RegistrationResult {
  status: RegistrationStatus;
  message?: string;
}

export class RegistrationNotConfiguredError extends Error {
  constructor() {
    super(
      "Registration submission is not connected yet — no registration endpoint has been published by the backend.",
    );
    this.name = "RegistrationNotConfiguredError";
  }
}

export async function submitRegistration(
  data: RegistrationFormData,
): Promise<RegistrationResult> {
  const { WOC_API_BASE_URL, WOC_ENDPOINTS, WocApiNotConfiguredError } =
    await import("./woc-api");
  if (WOC_API_BASE_URL.length === 0) throw new WocApiNotConfiguredError();

  const statementParts = [data.interest];
  if (data.skills.length > 0) {
    statementParts.push(`Skills: ${data.skills.join(", ")}`);
  }
  if (data.additionalInfo) {
    statementParts.push(`Additional info: ${data.additionalInfo}`);
  }
  const yearMatch = /^(\d)/.exec(data.academicYear.trim());

  let response: Response;
  try {
    response = await fetch(
      `${WOC_API_BASE_URL}${WOC_ENDPOINTS.registerForProblemStatement(data.problemStatementId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant: {
            name: data.fullName,
            email: data.email,
            institution: data.college || undefined,
            year: yearMatch ? parseInt(yearMatch[1], 10) : undefined,
          },
          proposal: {
            statement: statementParts.join("\n\n"),
            githubUrl: data.githubProfileUrl || undefined,
          },
        }),
      },
    );
  } catch {
    return { status: "network-error" };
  }
  if (response.ok) return { status: "success" };
  if (response.status === 409) return { status: "duplicate" };
  if (response.status === 401) return { status: "session-expired" };
  const body = (await response.json().catch(() => undefined)) as
    | { error?: { message?: string } }
    | undefined;
  return { status: "server-error", ...(body?.error?.message ? { message: body.error.message } : {}) };
}
