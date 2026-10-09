/**
 * Frontend data contracts for RIT Winter of Code.
 *
 * Field shapes follow the draft payloads shared for this project:
 * problem statements carry title/shortDesc/longDesc/stipendDetails/skills,
 * and reference an organization by id. The `id` field on
 * `ProblemStatement` is a frontend routing assumption — the backend
 * teammate should confirm the canonical identifier field.
 */

export interface Organization {
  id: string;
  name: string;
  imageUrl: string;
  tagline: string;
}

export interface StipendDetails {
  amount?: string;
  currency?: string;
  note?: string;
  [key: string]: unknown;
}

export interface ProblemStatement {
  /** Unique identifier (confirm canonical field with the backend teammate). */
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  stipendDetails: StipendDetails;
  skills: string[];
  /** References `Organization.id`. */
  organization: string;
}
