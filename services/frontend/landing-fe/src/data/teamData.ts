/**
 * Purpose: Data access layer for the Teams feature.
 * Exports: fetchSBOfficers, fetchChapterTeam
 * Side effects: Makes HTTP requests (currently returns mock data)
 *
 * TODO: When the profile-fe API is ready, swap the mock returns for the
 * commented-out fetch calls. The function signatures and return types stay identical.
 *
 * API endpoints (profile-fe):
 *   GET /api/team/sb                  → ITeamMember[]  (SB officers, current term)
 *   GET /api/team/:chapterAcronym     → ITeamMember[]  (officers + execoms, current term)
 */

import type { ITeamMember } from "@/types/team";
import { IEEE_POSITIONS } from "@astranova/catalogues";
import { CONFIG } from "@/configs";
import { RootServiceClient } from "shared-clients";

export const PROFILE_BASE_URL = CONFIG.PROFILE_BASE_URL;

// ==================== POSITION CONSTANTS ====================

const seniorKeys = [
  "chair",
  "technical-head",
  "treasurer",
  "secretary",
  "convenor",
] as const;
const viceKeys = [
  "vice-chair",
  "vice-technical-head",
  "vice-treasurer",
  "vice-secretary",
  "vice-convenor",
] as const;

const getNameByValue = (val: string) =>
  IEEE_POSITIONS.find((p) => p.value === val)?.name || "";

export const SB_SENIOR_POSITIONS = new Set<string>(
  seniorKeys.map(getNameByValue).filter(Boolean),
);

export const SB_VICE_POSITIONS = new Set<string>(
  viceKeys.map(getNameByValue).filter(Boolean),
);

/** Get the rank index of a position from the catalogues position data */
export function getPositionIndex(positionName: string): number {
  const index = IEEE_POSITIONS.findIndex(
    (p) => p.name.toLowerCase() === positionName.toLowerCase(),
  );
  return index === -1 ? IEEE_POSITIONS.length : index;
}

/** Sort team members according to the canonical IEEE position rank order */
export function sortMembersByPosition(members: ITeamMember[]): ITeamMember[] {
  return [...members].sort(
    (a, b) => getPositionIndex(a.position) - getPositionIndex(b.position),
  );
}

// ==================== MOCK DATA ====================

const MOCK_SB_OFFICERS: ITeamMember[] = [];

const MOCK_CHAPTER_TEAMS: Record<string, ITeamMember[]> = {};

// ==================== API FUNCTIONS ====================

/**
 * Fetch Student Branch officers for the current term.
 * Returns members ordered: senior officers first, then vice officers.
 */
export async function fetchSBOfficers(): Promise<ITeamMember[]> {
  try {
    const res = await RootServiceClient.getUsers({
      query: {
        chapters: "sb",
        limit: 10,
        onlySeniorPositions: false,
        onlyJuniorPositions: false,
        onlyExecoms: false,
      },
    });
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((user) => {
        const sbChapter = user.chapters.find(
          (ch) =>
            ch.acronym.toUpperCase() === "SB" ||
            ch.name.toLowerCase() === "student branch",
        )!;
        return {
          username: user.username,
          name: user.name,
          image:
            user.image ||
            `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}&backgroundColor=0a0b14`,
          position: sbChapter.position,
          chapter: {
            acronym: sbChapter.acronym,
            name: sbChapter.name,
          },
          department: user.department,
          year: user.year,
          term: user.term,
        };
      });
    }
  } catch (error) {
    console.error(
      "Failed to fetch SB officers from API via RootServiceClient, falling back to mock data:",
      error,
    );
  }
  return Promise.resolve(MOCK_SB_OFFICERS);
}

/**
 * Fetch all members for a given chapter (officers + execoms) for the current term.
 * Returns a flat array — split by position === "Execom" on the consumer side.
 */
export async function fetchChapterTeam(
  acronym: string,
): Promise<ITeamMember[]> {
  try {
    const res = await RootServiceClient.getUsers({
      query: {
        chapters: acronym.toLowerCase(),
        limit: 100,
        onlySeniorPositions: false,
        onlyJuniorPositions: false,
        onlyExecoms: false,
      },
    });
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((user) => {
        const targetChapter = user.chapters.find(
          (ch) => ch.acronym.toLowerCase() === acronym.toLowerCase(),
        )!;
        return {
          username: user.username,
          name: user.name,
          image:
            user.image ||
            `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}&backgroundColor=0a0b14`,
          position: targetChapter.position,
          chapter: {
            acronym: acronym.toUpperCase(),
            name: targetChapter.name,
          },
          department: user.department,
          year: user.year,
          term: user.term,
        };
      });
    }
  } catch (error) {
    console.error(
      `Failed to fetch chapter team for ${acronym} from API via RootServiceClient, falling back to mock data:`,
      error,
    );
  }
  return Promise.resolve(MOCK_CHAPTER_TEAMS[acronym.toUpperCase()] ?? []);
}
