import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getDbName } from "@/lib/db";

export const dynamic = "force-dynamic";

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

interface ChapterItem {
  acronym?: string;
  position?: string;
}

function parseChapters(val: unknown): string[] {
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((c: ChapterItem | string) =>
          typeof c === "string" ? c : c.acronym || ""
        ).filter(Boolean);
      }
    } catch {
      return [];
    }
  }
  if (Array.isArray(val)) {
    return val.map((c: ChapterItem | string) =>
      typeof c === "string" ? c : c.acronym || ""
    ).filter(Boolean);
  }
  return [];
}

function extractProjectTags(projects: unknown): string[] {
  if (!Array.isArray(projects)) return [];
  const tags = new Set<string>();
  for (const p of projects) {
    if (p && typeof p === "object" && "tags" in p && Array.isArray(p.tags)) {
      for (const t of p.tags) {
        if (typeof t === "string") tags.add(t);
      }
    }
  }
  return [...tags];
}

function computeSimilarity(source: {
  skills: string[];
  chapters: string[];
  department: string;
  batchOf: string;
  year: string;
  projectTags: string[];
}, target: {
  skills: string[];
  chapters: string[];
  department: string;
  batchOf: string;
  year: string;
  projectTags: string[];
}): number {
  const skillsScore = jaccardSimilarity(source.skills, target.skills);
  const chaptersScore = jaccardSimilarity(source.chapters, target.chapters);

  const deptScore =
    source.department && target.department && source.department === target.department
      ? 1 : 0;

  const batchScore =
    source.batchOf && target.batchOf && source.batchOf === target.batchOf
      ? 1
      : source.year && target.year && source.year === target.year
        ? 0.5 : 0;

  const tagsScore = jaccardSimilarity(source.projectTags, target.projectTags);

  return skillsScore * 0.40 + chaptersScore * 0.25 + deptScore * 0.15
    + batchScore * 0.10 + tagsScore * 0.10;
}

interface SanitizedProfile {
  name: string;
  username: string;
  image: string;
  department: string;
  batchOf: string;
  year: string;
  chapters: string[];
  skills: string[];
}

function sanitize(user: Record<string, any>, profile: Record<string, any>): SanitizedProfile {
  const safeParse = (val: unknown) => {
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return []; }
    }
    return Array.isArray(val) ? val : [];
  };

  return {
    name: user.name || "",
    username: user.username || "",
    image: user.image || "",
    department: user.department || "",
    batchOf: user.batch_of || "",
    year: user.year || "",
    chapters: parseChapters(user.chapters),
    skills: (safeParse(profile.skills) as string[]).filter(
      (s): s is string => typeof s === "string"
    ),
  };
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Missing username parameter" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(getDbName());

    const sourceUser = await db.collection("user").findOne({ username });
    if (!sourceUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sourceProfileDoc = await db
      .collection("profile")
      .findOne({ userId: sourceUser._id.toString() });

    const sourceProfile = sourceProfileDoc ?? { skills: "[]", projects: "[]" };

    const sourceSafe = sanitize(sourceUser, sourceProfile);
    const sourceProjectTags = extractProjectTags(
      typeof sourceProfile.projects === "string"
        ? JSON.parse(sourceProfile.projects || "[]")
        : sourceProfile.projects || []
    );

    const sourceData = {
      skills: sourceSafe.skills,
      chapters: sourceSafe.chapters,
      department: sourceSafe.department,
      batchOf: sourceSafe.batchOf,
      year: sourceSafe.year,
      projectTags: sourceProjectTags,
    };

    const otherUsers = await db
      .collection("user")
      .find({
        username: { $exists: true, $nin: ["", username] },
        name: { $exists: true, $ne: "" },
      })
      .project({ _id: 1, name: 1, username: 1, image: 1, department: 1, batch_of: 1, year: 1, chapters: 1 })
      .toArray();

    const otherUserIds = otherUsers.map((u) => u._id.toString());
    const otherProfiles = await db
      .collection("profile")
      .find({ userId: { $in: otherUserIds } })
      .project({ userId: 1, skills: 1, projects: 1 })
      .toArray();

    const profileMap = new Map(otherProfiles.map((p) => [p.userId, p]));

    const scored = otherUsers
      .map((user) => {
        const profile = profileMap.get(user._id.toString()) ?? { skills: "[]", projects: "[]" };
        const safe = sanitize(user, profile);

        const projectTags = extractProjectTags(
          typeof profile.projects === "string"
            ? JSON.parse(profile.projects || "[]")
            : profile.projects || []
        );

        const score = computeSimilarity(sourceData, {
          skills: safe.skills,
          chapters: safe.chapters,
          department: safe.department,
          batchOf: safe.batchOf,
          year: safe.year,
          projectTags,
        });

        return { score, profile: safe };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return NextResponse.json({ similar: scored });
  } catch (error) {
    console.error("Similar profiles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
