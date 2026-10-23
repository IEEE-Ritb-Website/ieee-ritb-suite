/**
 * DEVELOPMENT-ONLY MOCK DATA — do not use in production.
 *
 * The backend API contract is not available yet (woc-service currently only
 * exposes scaffold routes), so pages render these placeholders until
 * `NEXT_PUBLIC_WOC_API_BASE_URL` is configured. Organization names and
 * project content below are generic placeholders, not official program data.
 * Delete this file once the real API integration is verified.
 */

import type { Organization, ProblemStatement } from "./woc-types";

export const DEV_MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "placeholder-org-a",
    name: "Placeholder Org A",
    imageUrl: "",
    tagline: "Placeholder tagline — replaced by real organization data.",
  },
  {
    id: "placeholder-org-b",
    name: "Placeholder Org B",
    imageUrl: "",
    tagline: "Placeholder tagline — replaced by real organization data.",
  },
  {
    id: "placeholder-org-c",
    name: "Placeholder Org C",
    imageUrl: "",
    tagline: "Placeholder tagline — replaced by real organization data.",
  },
];

export const DEV_MOCK_PROBLEM_STATEMENTS: ProblemStatement[] = [
  {
    id: "placeholder-project-1",
    title: "Placeholder project one",
    shortDesc:
      "Short placeholder summary showing how a problem statement will read in the listing.",
    longDesc:
      "Long placeholder description. This text only demonstrates the details-page layout (overview, skills, stipend, organization) and will be replaced by real backend content.",
    stipendDetails: {
      note: "Placeholder — real stipend details will come from the backend API.",
    },
    skills: ["TypeScript", "React", "REST APIs"],
    organization: "placeholder-org-a",
  },
  {
    id: "placeholder-project-2",
    title: "Placeholder project two",
    shortDesc:
      "Short placeholder summary showing how a second listing entry will look.",
    longDesc:
      "Long placeholder description. Demonstrates multi-paragraph rendering on the details page.\n\nReal content arrives with the backend integration.",
    stipendDetails: {
      note: "Placeholder — real stipend details will come from the backend API.",
    },
    skills: ["Python", "Data Visualization"],
    organization: "placeholder-org-b",
  },
  {
    id: "placeholder-project-3",
    title: "Placeholder project three",
    shortDesc:
      "Short placeholder summary used to preview cards, skills chips, and empty states.",
    longDesc:
      "Long placeholder description. Used to verify the details layout before real data is available.",
    stipendDetails: {
      note: "Placeholder — real stipend details will come from the backend API.",
    },
    skills: ["Go", "PostgreSQL", "Docker"],
    organization: "placeholder-org-c",
  },
];
