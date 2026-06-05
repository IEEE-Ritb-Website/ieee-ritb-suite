/**
 * Purpose: Type definitions for the Teams feature.
 * Exports: ITeamMember
 * Side effects: None
 *
 * These interfaces are shared between the /team and /team/:chapterId pages.
 * The API shape is defined here — the head engineer will match this exactly.
 *
 * Profile URL pattern: https://profile.ritb.in/<username>
 */

export interface ITeamMember {
    /** Username from the user collection. Used to build profile.ritb.in/<username> */
    username: string;

    /** Display name */
    name: string;

    /** Cloudinary image URL from the profile collection */
    image: string;

    /**
     * Human-readable position title.
     * SB Officers: "Chair" | "Technical Head" | "Treasurer" | "Secretary" | "Convenor"
     *              | "Vice Chair" | "Vice Technical Head" | "Vice Treasurer"
     *              | "Vice Secretary" | "Vice Convenor"
     * Chapter members: any of the above (variable per chapter) | "Execom"
     */
    position: string;

    chapter: {
        /** Chapter acronym e.g. "SB", "CS", "RAS" */
        acronym: string;
        /** Full chapter name e.g. "Student Branch", "Computer Society" */
        name: string;
    };

    /** Academic department e.g. "AIML", "ISE", "CSE" */
    department: string;

    /** Academic year e.g. "1st", "2nd", "3rd", "4th" */
    year: string;

    /** Active term e.g. "2026-27" */
    term: string;
}
