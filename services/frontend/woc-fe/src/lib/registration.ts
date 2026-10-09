/**
 * Registration service for RIT Winter of Code problem statements.
 *
 * Keeps the registration form schema, frontend validation, and submission
 * logic in one isolated place so the UI never talks to an API directly.
 *
 * BACKEND STATUS: no official registration data model or endpoint exists
 * yet — woc-service only exposes scaffold routes (ping/sample/cron).
 * `submitRegistration()` therefore throws `RegistrationNotConfiguredError`
 * and the form shows a clearly-labeled "not connected" notice. No success
 * is ever displayed until a real backend confirms it.
 *
 * When the backend teammate publishes the contract, connect it here only:
 * 1. Confirm endpoint path, HTTP method, request body, and response shape.
 * 2. Confirm how identity is presented (e.g. `Authorization: Bearer
 *    <supabase-access-token>` — do NOT assume the session alone suffices).
 * 3. Send `{...data}` with `fetch`, map responses to `RegistrationResult`:
 *    - 2xx → `{ status: "success" }`
 *    - 409 (or contract equivalent) → `{ status: "duplicate" }`
 *    - 401 → refresh/re-resolve the session; still failing →
 *      `{ status: "session-expired" }`
 *    - network failure → `{ status: "network-error" }`
 *    - other non-2xx → `{ status: "server-error" }`
 * 4. Guard the UI against double submission (the form already disables
 *    its submit button while a request is in flight).
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
  void data;
  throw new RegistrationNotConfiguredError();
}
