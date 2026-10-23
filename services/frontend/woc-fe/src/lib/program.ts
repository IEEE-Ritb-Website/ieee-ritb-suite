/**
 * Program-level constants for RIT Winter of Code.
 * Dates below are the published program dates — keep in sync with announcements.
 */

export interface TimelinePhase {
  id: string;
  name: string;
  /** First day of the phase, as displayed across the site. */
  startDate: string;
  /** Last day of the phase, as displayed across the site. */
  endDate: string;
  /** Combined range label derived from `startDate` and `endDate`. */
  dateRange: string;
  description: string;
}

export const SITE_NAME = "RIT Winter of Code";
export const SITE_SHORT_NAME = "RIT WOC";

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: "submission",
    name: "Submission Period",
    startDate: "October 15",
    endDate: "October 31",
    dateRange: "October 15 – October 31",
    description:
      "Browse the published problem statements and submit your project proposals.",
  },
  {
    id: "coding",
    name: "Coding Period",
    startDate: "November 1",
    endDate: "December 31",
    dateRange: "November 1 – December 31",
    description:
      "Work on your accepted proposal, build in the open, and ship your solution.",
  },
];
