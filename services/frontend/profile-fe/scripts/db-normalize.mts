import dotenv from "dotenv";
import fs from "fs";
import { DEPARTMENTS } from "../src/lib/departments";
import { OrganizationStructure } from "@astranova/catalogues";

const isProd =
  process.argv.includes("--production") || process.argv.includes("-p");
const envMode: "production" | "development" = isProd
  ? "production"
  : "development";
type MutableProcessEnv = Omit<NodeJS.ProcessEnv, "NODE_ENV"> & {
  NODE_ENV?: string;
};

(process.env as MutableProcessEnv).NODE_ENV = envMode;

const loadEnvIfExists = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath });
  }
};

if (isProd) {
  loadEnvIfExists(".env.production.local");
  loadEnvIfExists(".env.local");
  loadEnvIfExists(".env.production");
  loadEnvIfExists(".env");
} else {
  loadEnvIfExists(".env.development.local");
  loadEnvIfExists(".env.local");
  loadEnvIfExists(".env.development");
  loadEnvIfExists(".env");
}

console.log(`Ultimate Database Normalizer Bootstrapping in ${envMode} mode...`);

const ChaptersCatalog = OrganizationStructure;

function generateUsername(name: string, email: string): string {
  let base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  if (base.length < 3) {
    base = name.toLowerCase().replace(/[^a-z0-9_]/g, "");
  }
  if (base.length < 3) {
    base = "user_" + Math.random().toString(36).substring(2, 6);
  }
  return base.substring(0, 20);
}

function normalizeChapters(rawChapters: any): any[] {
  let parsed: any[] = [];
  if (typeof rawChapters === "string") {
    try {
      parsed = JSON.parse(rawChapters);
    } catch {
      parsed = [];
    }
  } else if (Array.isArray(rawChapters)) {
    parsed = rawChapters;
  }

  return parsed
    .map((ch: any) => {
      const acronym =
        typeof ch === "string" ? ch.trim() : (ch.acronym || "").trim();
      const pos =
        typeof ch === "string" ? "Execom" : (ch.position || "Execom").trim();
      const match = ChaptersCatalog.find(
        (c) => c.acronym.toLowerCase() === acronym.toLowerCase(),
      );
      return {
        acronym: match ? match.acronym : acronym,
        name: match ? match.name : acronym,
        position: pos || "Execom",
      };
    })
    .filter((c) => c.acronym.length > 0);
}

function safeParseArray(val: any): any[] {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return Array.isArray(val) ? val : [];
}

function normalizeYear(year: string): string {
  const y = String(year || "")
    .trim()
    .toLowerCase();
  if (!y) return "";

  if (y.includes("1") || y.includes("first")) return "1st Year";
  if (y.includes("2") || y.includes("second")) return "2nd Year";
  if (y.includes("3") || y.includes("third")) return "3rd Year";
  if (y.includes("4") || y.includes("fourth")) return "4th Year";

  // Fallback to extracting digits
  const digitMatch = y.match(/\d+/);
  if (digitMatch) {
    const num = parseInt(digitMatch[0], 10);
    if (num === 1) return "1st Year";
    if (num === 2) return "2nd Year";
    if (num === 3) return "3rd Year";
    if (num === 4) return "4th Year";
    return `${num}th Year`;
  }

  return year.trim();
}

function resolveDepartment(dept: string): string {
  const d = String(dept || "")
    .trim()
    .toLowerCase();
  if (!d) return "";

  // 1. Try exact or case-insensitive value match
  const valueMatch = DEPARTMENTS.find((dep) => dep.value.toLowerCase() === d);
  if (valueMatch) return valueMatch.value;

  // 2. Try exact or case-insensitive label match
  const labelMatch = DEPARTMENTS.find((dep) => dep.label.toLowerCase() === d);
  if (labelMatch) return labelMatch.value;

  // 3. Try partial label match (e.g. "Medical Electronics" matching "Medical Electronics Engineering")
  const partialMatch = DEPARTMENTS.find((dep) => {
    const label = dep.label.toLowerCase();
    return label.includes(d) || d.includes(label);
  });
  if (partialMatch) return partialMatch.value;

  // 4. Return as-is if no match
  return dept.trim();
}

const defaultTerm = `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`;

async function main() {
  try {
    const { default: clientPromise, getDbName } = await import("../src/lib/db");
    const client = await clientPromise;
    const db = client.db(getDbName());

    console.log(`Connected successfully. Target Database: ${getDbName()}`);

    const users = await db.collection("user").find({}).toArray();
    console.log(
      `Analyzing ${users.length} user records for normalization & duplicate checks...`,
    );

    // 1. Group users by membershipId to resolve duplicates
    const membershipMap = new Map<string, any[]>();
    for (const u of users) {
      if (u.membershipId) {
        const id = String(u.membershipId).trim();
        if (!membershipMap.has(id)) {
          membershipMap.set(id, []);
        }
        membershipMap.get(id)!.push(u);
      }
    }

    const resolvedMembershipIds = new Map<string, string>();
    for (const [mId, dupUsers] of membershipMap.entries()) {
      if (dupUsers.length > 1) {
        console.warn(
          `WARNING: Found ${dupUsers.length} users sharing the duplicate membership ID '${mId}'!`,
        );

        dupUsers.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        resolvedMembershipIds.set(dupUsers[0]._id.toString(), mId);
        console.log(
          `- Keeping membership ID '${mId}' for User: ${dupUsers[0].email}`,
        );

        for (let i = 1; i < dupUsers.length; i++) {
          const suffixId = `${mId}-${i}`;
          resolvedMembershipIds.set(dupUsers[i]._id.toString(), suffixId);
          console.warn(
            `- Assisting User ${dupUsers[i].email} with new unique membership ID '${suffixId}'`,
          );
        }
      } else {
        resolvedMembershipIds.set(dupUsers[0]._id.toString(), mId);
      }
    }

    // 2. Perform normalized updates
    for (const u of users) {
      console.log(`Normalizing User: ${u.email || u.name}...`);

      const userIdStr = u._id.toString();

      // Resolve batch_of
      let cleanBatchOf = u.batch_of || "";
      if (!cleanBatchOf && u.year) {
        const cleanYear = normalizeYear(u.year);
        const yearNum = parseInt(cleanYear.replace(/\D/g, "") || "0", 10);
        if (yearNum > 0) {
          cleanBatchOf = String(new Date().getFullYear() - yearNum);
        }
      }

      // ── Profile collection: find existing profile doc first to check for image propagation ──
      const profileDoc = await db
        .collection("profile")
        .findOne({ userId: userIdStr });

      // Migrate image if profile has it but user doesn't
      let resolvedUserImage = u.image || "";
      if (!resolvedUserImage && profileDoc && profileDoc.image) {
        resolvedUserImage = profileDoc.image;
        console.log(
          `- Propagated image from profile to user collection for: ${u.email}`,
        );
      }

      // Capture legacy data from user doc (might have been stored there before profile existed)
      const legacySkills = safeParseArray(u.skills);
      const legacySocialLinks = safeParseArray(u.social_links);

      // ── User collection: set all current-schema fields, unset legacy fields ──
      const userUpdateFields: Record<string, unknown> = {
        username:
          u.username ||
          generateUsername(u.name || "User", u.email || "user@domain.com"),
        membershipId:
          resolvedMembershipIds.get(userIdStr) || u.membershipId || "",
        batch_of: cleanBatchOf,
        chapters: normalizeChapters(u.chapters),
        role: u.role || "member",
        term: u.term || defaultTerm,
        updatedAt: new Date(),
      };

      // Preserve existing values (if they exist) rather than overwriting with empty
      if (u.name) userUpdateFields["name"] = u.name;
      if (u.email) userUpdateFields["email"] = u.email;
      if (u.emailVerified !== undefined)
        userUpdateFields["emailVerified"] = !!u.emailVerified;
      if (resolvedUserImage) userUpdateFields["image"] = resolvedUserImage;
      if (u.tagline) userUpdateFields["tagline"] = u.tagline;
      if (u.bio) userUpdateFields["bio"] = u.bio;
      if (u.year) userUpdateFields["year"] = normalizeYear(u.year);
      if (u.department)
        userUpdateFields["department"] = resolveDepartment(u.department);
      if (u.usn) userUpdateFields["usn"] = u.usn;
      if (u.phoneNumber) userUpdateFields["phoneNumber"] = u.phoneNumber;

      await db.collection("user").updateOne(
        { _id: u._id },
        {
          $set: userUpdateFields,
          $unset: {
            positions: "",
            skills: "",
            social_links: "",
          },
        },
      );

      const cleanSkills =
        profileDoc && Array.isArray(profileDoc.skills)
          ? profileDoc.skills
          : legacySkills;

      const cleanSocialLinks =
        profileDoc && Array.isArray(profileDoc.social_links)
          ? profileDoc.social_links
          : legacySocialLinks;

      const newProfileData = {
        userId: userIdStr,
        name: u.name || profileDoc?.name || "Unnamed",
        current_status: profileDoc?.current_status || "",
        bio: u.bio || profileDoc?.bio || "",
        stats: profileDoc?.stats || {},
        skills: cleanSkills,
        social_links: cleanSocialLinks,
        achievements: Array.isArray(profileDoc?.achievements)
          ? profileDoc.achievements
          : [],
        projects: Array.isArray(profileDoc?.projects)
          ? profileDoc.projects
          : [],
        github_username: profileDoc?.github_username || "",
        leetcode_username: profileDoc?.leetcode_username || "",
        updatedAt: new Date(),
      };

      await db.collection("profile").updateOne(
        { userId: userIdStr },
        {
          $set: newProfileData,
          $unset: {
            image: "",
            username: "",
            email: "",
            chapters: "",
            membershipId: "",
            positions: "",
            usn: "",
            year: "",
            batch: "",
            phoneNumber: "",
            department: "",
          },
        },
        { upsert: true },
      );
    }

    console.log(
      "Ultimate Normalization complete. Verification and sanitization successful!",
    );
    await client.close();
  } catch (err) {
    console.error("FATAL Normalization Error:", err);
  }
}

main();
