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

const PROFILE_API_BASE = CONFIG.PROFILE_API_BASE;
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

/** Canonical display order for chapter officer positions */
export const CHAPTER_POSITION_ORDER: string[] = [
  ...seniorKeys.map(getNameByValue).filter(Boolean),
  ...viceKeys.map(getNameByValue).filter(Boolean),
];

// ==================== MOCK DATA ====================

const MOCK_SB_OFFICERS: ITeamMember[] = [
  // ── Senior Officers ──────────────────────────────────────
  {
    username: "rahulsharma23",
    name: "Rahul Sharma",
    image:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=rahulsharma23&backgroundColor=0a0b14",
    position: "Chair",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "CSE",
    year: "3rd",
    term: "2026-27",
  },
  {
    username: "whoisshivesh",
    name: "Shivesh Tiwari",
    image:
      "https://res.cloudinary.com/ddrv7lqrg/image/upload/v1780819144/profiles/vedg8oi6xkkbdbc2ws6k.jpg",
    position: "Technical Head",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "ISE",
    year: "3rd",
    term: "2026-27",
  },
  {
    username: "priyanair22",
    name: "Priya Nair",
    image:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair22&backgroundColor=0a0b14",
    position: "Treasurer",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "ECE",
    year: "3rd",
    term: "2026-27",
  },
  {
    username: "arjunmehta23",
    name: "Arjun Mehta",
    image:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=arjunmehta23&backgroundColor=0a0b14",
    position: "Secretary",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "CSE",
    year: "3rd",
    term: "2026-27",
  },
  {
    username: "sneharao23",
    name: "Sneha Rao",
    image:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=sneharao23&backgroundColor=0a0b14",
    position: "Convenor",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "MECH",
    year: "3rd",
    term: "2026-27",
  },
  // ── Vice Officers ─────────────────────────────────────────
  {
    username: "kavyakrishnan24",
    name: "Kavya Krishnan",
    image:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=kavyakrishnan24&backgroundColor=0a0b14",
    position: "Vice Chair",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "CS",
    year: "2nd",
    term: "2026-27",
  },
  {
    username: "ahadullabaig16",
    name: "Ahad Ulla Baig",
    image:
      "https://res.cloudinary.com/ddrv7lqrg/image/upload/v1780473826/profiles/p8qq7ehdnerlf4w5kgni.jpg",
    position: "Vice Technical Head",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "AIML",
    year: "2nd",
    term: "2026-27",
  },
  {
    username: "vikrampatel24",
    name: "Vikram Patel",
    image:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=vikrampatel24&backgroundColor=0a0b14",
    position: "Vice Treasurer",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "EEE",
    year: "2nd",
    term: "2026-27",
  },
  {
    username: "diyajoshi24",
    name: "Diya Joshi",
    image:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=diyajoshi24&backgroundColor=0a0b14",
    position: "Vice Secretary",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "ISE",
    year: "2nd",
    term: "2026-27",
  },
  {
    username: "rohangupta24",
    name: "Rohan Gupta",
    image:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=rohangupta24&backgroundColor=0a0b14",
    position: "Vice Convenor",
    chapter: { acronym: "SB", name: "Student Branch" },
    department: "CIVIL",
    year: "2nd",
    term: "2026-27",
  },
];

/**
 * Mock chapter teams.
 * Only a few chapters are populated here — others return [] until the real API is ready.
 * Keys are UPPERCASE chapter acronyms matching @astranova/catalogues.
 */
const MOCK_CHAPTER_TEAMS: Record<string, ITeamMember[]> = {
  CS: [
    {
      username: "ananyaverma23",
      name: "Ananya Verma",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=ananyaverma23&backgroundColor=0a0b14",
      position: "Chair",
      chapter: { acronym: "CS", name: "Computer Society" },
      department: "CSE",
      year: "3rd",
      term: "2026-27",
    },
    {
      username: "karthiksrinivas23",
      name: "Karthik Srinivas",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=karthiksrinivas23&backgroundColor=0a0b14",
      position: "Technical Head",
      chapter: { acronym: "CS", name: "Computer Society" },
      department: "CSE",
      year: "3rd",
      term: "2026-27",
    },
    {
      username: "ishitaseth24",
      name: "Ishita Seth",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=ishitaseth24&backgroundColor=0a0b14",
      position: "Vice Chair",
      chapter: { acronym: "CS", name: "Computer Society" },
      department: "AIML",
      year: "2nd",
      term: "2026-27",
    },
    {
      username: "devjain24",
      name: "Dev Jain",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=devjain24&backgroundColor=0a0b14",
      position: "Execom",
      chapter: { acronym: "CS", name: "Computer Society" },
      department: "CSE",
      year: "2nd",
      term: "2026-27",
    },
    {
      username: "meghanahs24",
      name: "Meghana H S",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=meghanahs24&backgroundColor=0a0b14",
      position: "Execom",
      chapter: { acronym: "CS", name: "Computer Society" },
      department: "ISE",
      year: "2nd",
      term: "2026-27",
    },
    {
      username: "nikhilbhat24",
      name: "Nikhil Bhat",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=nikhilbhat24&backgroundColor=0a0b14",
      position: "Execom",
      chapter: { acronym: "CS", name: "Computer Society" },
      department: "CSE",
      year: "1st",
      term: "2026-27",
    },
    {
      username: "tanvipillai24",
      name: "Tanvi Pillai",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=tanvipillai24&backgroundColor=0a0b14",
      position: "Execom",
      chapter: { acronym: "CS", name: "Computer Society" },
      department: "CSE",
      year: "2nd",
      term: "2026-27",
    },
    {
      username: "abhiramk24",
      name: "Abhiram K",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=abhiramk24&backgroundColor=0a0b14",
      position: "Execom",
      chapter: { acronym: "CS", name: "Computer Society" },
      department: "CSE",
      year: "2nd",
      term: "2026-27",
    },
  ],
  RAS: [
    {
      username: "sriramnaidu23",
      name: "Sriram Naidu",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=sriramnaidu23&backgroundColor=0a0b14",
      position: "Chair",
      chapter: { acronym: "RAS", name: "Robotics & Automation Society" },
      department: "EEE",
      year: "3rd",
      term: "2026-27",
    },
    {
      username: "poojasharma23",
      name: "Pooja Sharma",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=poojasharma23&backgroundColor=0a0b14",
      position: "Technical Head",
      chapter: { acronym: "RAS", name: "Robotics & Automation Society" },
      department: "ECE",
      year: "3rd",
      term: "2026-27",
    },
    {
      username: "ahadullabaig16",
      name: "Ahad Ulla Baig",
      image:
        "https://res.cloudinary.com/ddrv7lqrg/image/upload/v1780473826/profiles/p8qq7ehdnerlf4w5kgni.jpg",
      position: "Execom",
      chapter: { acronym: "RAS", name: "Robotics & Automation Society" },
      department: "AIML",
      year: "2nd",
      term: "2026-27",
    },
    {
      username: "aditikumar24",
      name: "Aditi Kumar",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=aditikumar24&backgroundColor=0a0b14",
      position: "Execom",
      chapter: { acronym: "RAS", name: "Robotics & Automation Society" },
      department: "ECE",
      year: "2nd",
      term: "2026-27",
    },
    {
      username: "saiyashwanth24",
      name: "Sai Yashwanth",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=saiyashwanth24&backgroundColor=0a0b14",
      position: "Execom",
      chapter: { acronym: "RAS", name: "Robotics & Automation Society" },
      department: "MECH",
      year: "2nd",
      term: "2026-27",
    },
  ],
};

// ==================== API FUNCTIONS ====================

interface IApiResponse {
  success: boolean;
  data: Array<{
    name: string;
    image: string | null;
    username: string;
    chapters: Array<{
      name: string;
      acronym: string;
      position?: string;
    }>;
    department?: string | null;
    year?: string | null;
    term?: string | null;
  }>;
  message?: string;
}

/**
 * Fetch Student Branch officers for the current term.
 * Returns members ordered: senior officers first, then vice officers.
 */
export async function fetchSBOfficers(): Promise<ITeamMember[]> {
  try {
    const res = await fetch(
      "https://ieee-ritb-root-service.onrender.com/api/users?chapters=sb&limit=100",
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = (await res.json()) as IApiResponse;
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((user) => {
        const sbChapter = user.chapters.find(
          (ch) =>
            ch.acronym.toUpperCase() === "SB" ||
            ch.name.toLowerCase() === "student branch",
        );
        return {
          username: user.username,
          name: user.name,
          image:
            user.image ||
            `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}&backgroundColor=0a0b14`,
          position: sbChapter?.position || "Execom",
          chapter: {
            acronym: "SB",
            name: "Student Branch",
          },
          department: user.department || "CSE",
          year: user.year || "3rd",
          term: user.term || "2026-27",
        };
      });
    }
  } catch (error) {
    console.error(
      "Failed to fetch SB officers from API, falling back to mock data:",
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
    const res = await fetch(
      `https://ieee-ritb-root-service.onrender.com/api/users?chapters=${acronym.toLowerCase()}&limit=100`,
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = (await res.json()) as IApiResponse;
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((user) => {
        const targetChapter = user.chapters.find(
          (ch) => ch.acronym.toLowerCase() === acronym.toLowerCase(),
        );
        return {
          username: user.username,
          name: user.name,
          image:
            user.image ||
            `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}&backgroundColor=0a0b14`,
          position: targetChapter?.position || "Execom",
          chapter: {
            acronym: acronym.toUpperCase(),
            name: targetChapter?.name || acronym.toUpperCase(),
          },
          department: user.department || "CSE",
          year: user.year || "3rd",
          term: user.term || "2026-27",
        };
      });
    }
  } catch (error) {
    console.error(
      `Failed to fetch chapter team for ${acronym} from API, falling back to mock data:`,
      error,
    );
  }
  return Promise.resolve(MOCK_CHAPTER_TEAMS[acronym.toUpperCase()] ?? []);
}

// Suppress unused import warning until fetch calls are enabled
void PROFILE_API_BASE;
