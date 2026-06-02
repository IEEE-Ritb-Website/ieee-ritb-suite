import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Configure Node environment before any database/auth imports to prevent hoisting-based connection issues
const isProd = process.argv.includes("--production") || process.argv.includes("-p");
const envMode: "production" | "development" = isProd ? "production" : "development";
type MutableProcessEnv = Omit<NodeJS.ProcessEnv, "NODE_ENV"> & { NODE_ENV?: string };

// db.ts relies on process.env.NODE_ENV at import time.
(process.env as MutableProcessEnv).NODE_ENV = envMode;

const loadEnvIfExists = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath });
  }
};

// Next-style env precedence: highest priority files first.
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

const ChaptersCatalog = [
  { name: "Computer Society", acronym: "CS" },
  { name: "Computational Intelligence Society", acronym: "CIS" },
  { name: "Student Branch", acronym: "SB" }
];

function generateUsername(name: string, email: string): string {
  let base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
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

  return parsed.map((ch: any) => {
    const acronym = typeof ch === "string" ? ch.trim().toUpperCase() : (ch.acronym || "").trim().toUpperCase();
    const pos = typeof ch === "string" ? "Execom" : (ch.position || "Execom").trim();
    const match = ChaptersCatalog.find(c => c.acronym.toUpperCase() === acronym);
    return {
      acronym,
      name: match ? match.name : acronym,
      position: pos || "Execom"
    };
  }).filter(c => c.acronym.length > 0);
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

async function main() {
  try {
    const { default: clientPromise, getDbName } = await import("../src/lib/db");
    const client = await clientPromise;
    const db = client.db(getDbName());

    console.log(`Connected successfully. Target Database: ${getDbName()}`);

    const users = await db.collection("user").find({}).toArray();
    console.log(`Analyzing ${users.length} user records for normalization & duplicate checks...`);

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

    // Identify and resolve duplicates by assigning unique identifiers
    const resolvedMembershipIds = new Map<string, string>();
    for (const [mId, dupUsers] of membershipMap.entries()) {
      if (dupUsers.length > 1) {
        console.warn(`WARNING: Found ${dupUsers.length} users sharing the duplicate membership ID '${mId}'!`);
        
        // Sort users: keep the membershipId for the user who matches the standard format or has the correct profile first,
        // or simply keep it for the most recently updated one.
        dupUsers.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA; // descending order (newest first)
        });

        // The first one keeps the membership ID
        resolvedMembershipIds.set(dupUsers[0]._id.toString(), mId);
        console.log(`- Keeping membership ID '${mId}' for User: ${dupUsers[0].email}`);

        // The others get a suffixed unique membership ID
        for (let i = 1; i < dupUsers.length; i++) {
          const suffixId = `${mId}-${i}`;
          resolvedMembershipIds.set(dupUsers[i]._id.toString(), suffixId);
          console.warn(`- Assisting User ${dupUsers[i].email} with new unique membership ID '${suffixId}'`);
        }
      } else {
        resolvedMembershipIds.set(dupUsers[0]._id.toString(), mId);
      }
    }

    // 2. Perform normalized updates
    for (const u of users) {
      console.log(`Normalizing User: ${u.email || u.name}...`);

      const userIdStr = u._id.toString();

      // Resolve unique username
      const cleanUsername = u.username || generateUsername(u.name || "User", u.email || "user@domain.com");

      // Resolve unique membershipId from our resolved list
      const cleanMembershipId = resolvedMembershipIds.get(userIdStr) || u.membershipId || "";

      // Resolve batch_of
      let cleanBatchOf = u.batch_of || "";
      if (!cleanBatchOf && u.year) {
        const yearNum = parseInt(u.year.replace(/\D/g, "") || "0");
        if (yearNum > 0) {
          cleanBatchOf = String(new Date().getFullYear() - yearNum);
        }
      }

      // Resolve chapters
      const cleanChapters = normalizeChapters(u.chapters);

      // Capture legacy data
      const legacySkills = safeParseArray(u.skills);
      const legacySocialLinks = safeParseArray(u.social_links);

      // Update user document
      const userUpdateFields: any = {
        username: cleanUsername,
        membershipId: cleanMembershipId,
        batch_of: cleanBatchOf,
        chapters: cleanChapters, // Native JSON array of objects!
        role: u.role || "member",
        updatedAt: u.updatedAt instanceof Date ? u.updatedAt : new Date()
      };
      
      if (u.name) userUpdateFields.name = u.name;
      if (u.email) userUpdateFields.email = u.email;
      if (u.emailVerified !== undefined) userUpdateFields.emailVerified = !!u.emailVerified;
      if (u.image) userUpdateFields.image = u.image;
      if (u.tagline) userUpdateFields.tagline = u.tagline;
      if (u.bio) userUpdateFields.bio = u.bio;
      if (u.year) userUpdateFields.year = u.year;
      if (u.department) userUpdateFields.department = u.department;
      if (u.usn) userUpdateFields.usn = u.usn;
      if (u.phoneNumber) userUpdateFields.phoneNumber = u.phoneNumber;
      if (u.term) userUpdateFields.term = u.term;

      await db.collection("user").updateOne(
        { _id: u._id },
        {
          $set: userUpdateFields,
          $unset: {
            positions: "",
            skills: "",
            social_links: ""
          }
        }
      );

      // Find or create matching profile document
      let profileDoc = await db.collection("profile").findOne({ userId: userIdStr });
      
      const cleanSkills = profileDoc && profileDoc.skills && Array.isArray(profileDoc.skills)
        ? profileDoc.skills
        : legacySkills;

      const cleanSocialLinks = profileDoc && profileDoc.social_links && Array.isArray(profileDoc.social_links)
        ? profileDoc.social_links
        : legacySocialLinks;

      const newProfileData = {
        userId: userIdStr,
        name: u.name || profileDoc?.name || "Unnamed",
        image: u.image || profileDoc?.image || "",
        current_status: profileDoc?.current_status || "",
        bio: u.bio || profileDoc?.bio || "",
        stats: profileDoc?.stats || {},
        skills: cleanSkills,
        social_links: cleanSocialLinks,
        achievements: profileDoc?.achievements || [],
        projects: profileDoc?.projects || [],
        usn: u.usn || profileDoc?.usn || "",
        year: u.year || profileDoc?.year || "",
        batch: cleanBatchOf || profileDoc?.batch || "",
        phoneNumber: u.phoneNumber || profileDoc?.phoneNumber || "",
        updatedAt: new Date()
      };

      await db.collection("profile").updateOne(
        { userId: userIdStr },
        {
          $set: newProfileData,
          $unset: {
            username: "",
            email: "",
            chapters: "",
            department: "",
            membershipId: "",
            positions: ""
          }
        },
        { upsert: true }
      );
    }

    console.log("Ultimate Normalization complete. Verification and sanitization successful!");
    await client.close();
  } catch (err) {
    console.error("FATAL Normalization Error:", err);
  }
}

main();
