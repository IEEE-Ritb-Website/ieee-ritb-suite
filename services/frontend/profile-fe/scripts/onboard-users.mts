import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { Chapters as CatalogChapters } from "../../../../packages/catalogues/src/chapter-data/index";

const BATCH_SIZE = 10;
const DELAY_BETWEEN_EMAILS_MS = 2000;
const DELAY_BETWEEN_BATCHES_MS = 45000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const jitter = () => Math.random() * 1500;

const Chapters = [
  ...CatalogChapters,
  {
    name: "Student Branch",
    acronym: "SB",
    type: null as any,
    color: "#ef4444",
  },
];

// Configure Node environment before any database/auth imports to prevent hoisting-based connection issues
const isProd =
  process.argv.includes("--production") || process.argv.includes("-p");
const envMode: "production" | "development" = isProd
  ? "production"
  : "development";
type MutableProcessEnv = Omit<NodeJS.ProcessEnv, "NODE_ENV"> & {
  NODE_ENV?: string;
};

// Better Auth and db.ts both rely on process.env.NODE_ENV at import time.
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

console.log(`Running in ${envMode} mode`);

// Module-scoped auth variable that will be dynamically imported
let auth: any;

async function initAuth() {
  const authModule = await import("../src/lib/auth");
  auth = authModule.auth;
}

function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

// Generate clean, unique username utility checking for DB existence
async function generateUniqueUsername(
  name: string,
  email: string,
  db: any,
): Promise<string> {
  const emailPrefix = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  const nameParts = name
    .toLowerCase()
    .split(/\s+/)
    .map((p) => p.replace(/[^a-z0-9_]/g, ""))
    .filter(Boolean);

  const candidates: string[] = [];

  // 1. Email prefix (e.g. shiveshtiwari0)
  if (emailPrefix.length >= 3) {
    candidates.push(emailPrefix.substring(0, 20));
  }

  // 2. Full name parts joined (e.g. shiveshtiwari)
  if (nameParts.length > 0) {
    const joinedName = nameParts.join("");
    if (joinedName.length >= 3) {
      candidates.push(joinedName.substring(0, 20));
    }
  }

  // 3. First name + last name initial (e.g. shivesht)
  if (nameParts.length > 1) {
    const fnLn = nameParts[0] + nameParts[nameParts.length - 1][0];
    if (fnLn.length >= 3) {
      candidates.push(fnLn.substring(0, 20));
    }
  }

  // 4. First name + random number (e.g. shivesh42)
  if (nameParts.length > 0) {
    candidates.push(
      (nameParts[0] + Math.floor(10 + Math.random() * 90)).substring(0, 20),
    );
  }

  // Check candidates first
  for (const candidate of candidates) {
    const exists = await db.collection("user").findOne({ username: candidate });
    if (!exists) {
      return candidate;
    }
  }

  // 5. If all candidates exist, append randomized sequences
  const base = nameParts.length > 0 ? nameParts[0] : "user";
  let attempt = 1;
  while (attempt <= 100) {
    const candidate =
      `${base}${Math.floor(100 + Math.random() * 900)}`.substring(0, 20);
    const exists = await db.collection("user").findOne({ username: candidate });
    if (!exists) {
      return candidate;
    }
    attempt++;
  }

  // 6. Fallback
  return (base + "_" + Math.random().toString(36).substring(2, 7)).substring(
    0,
    20,
  );
}

// Resolve chapter details from catalogues catalog utility
function resolveChapter(acronym: string, position: string) {
  const match = Chapters.find(
    (c) => c.acronym.toLowerCase() === acronym.trim().toLowerCase(),
  );
  if (!match) {
    return null;
  }
  return {
    acronym: match.acronym,
    name: match.name,
    position: position || "Execom",
  };
}

async function onboardUser(userData: {
  email: string;
  name: string;
  position: string;
  chapter1: string;
  chapter2?: string;
  usn?: string;
  phoneNumber?: string;
  year?: string;
  membershipId: string;
  department: string;
  term: string;
}): Promise<
  | { success: true; email: string }
  | { success: false; email: string; error: string }
> {
  const password = generatePassword();
  console.log(`Password for ${userData.email}: ${password}`);

  const dbModule = await import("../src/lib/db");
  const client = await dbModule.default;
  const db = client.db(dbModule.getDbName());

  // Validate membership ID format (9 digits, numbers only)
  const membershipId = String(userData.membershipId || "").trim();
  if (!/^\d{9}$/.test(membershipId)) {
    console.error(
      `Validation Error (${userData.email}): Membership ID '${membershipId}' is invalid. It must be exactly 9 digits.`,
    );
    return {
      success: false,
      email: userData.email,
      error: `Membership ID '${membershipId}' must be exactly 9 digits.`,
    };
  }

  // Validate uniqueness of email
  const emailLower = userData.email.trim().toLowerCase();
  const existingEmail = await db
    .collection("user")
    .findOne({ email: emailLower });
  if (existingEmail) {
    console.error(
      `Validation Error (${userData.email}): Email is already in use.`,
    );
    return {
      success: false,
      email: userData.email,
      error: `Email '${userData.email}' is already in use.`,
    };
  }

  // Validate uniqueness of membershipId
  const existingMId = await db.collection("user").findOne({ membershipId });
  if (existingMId) {
    console.error(
      `Validation Error (${userData.email}): Membership ID '${membershipId}' is already in use.`,
    );
    return {
      success: false,
      email: userData.email,
      error: `Membership ID '${membershipId}' is already in use.`,
    };
  }

  // Generate unique username dynamically (verifying uniqueness in database)
  const username = await generateUniqueUsername(
    userData.name,
    userData.email,
    db,
  );

  // Map chapters
  const chapters: any[] = [];
  if (userData.chapter1) {
    const pos1 =
      userData.position && userData.position.trim() !== ""
        ? userData.position.trim()
        : "Execom";
    const resolved = resolveChapter(userData.chapter1, pos1);
    if (!resolved) {
      console.error(
        `Validation Error (${userData.email}): Invalid chapter name/acronym '${userData.chapter1}' for Chapter 1.`,
      );
      return {
        success: false,
        email: userData.email,
        error: `Invalid chapter name/acronym '${userData.chapter1}' for Chapter 1.`,
      };
    }
    chapters.push(resolved);
  }
  if (userData.chapter2) {
    const resolved = resolveChapter(userData.chapter2, "Execom");
    if (!resolved) {
      console.error(
        `Validation Error (${userData.email}): Invalid chapter name/acronym '${userData.chapter2}' for Chapter 2.`,
      );
      return {
        success: false,
        email: userData.email,
        error: `Invalid chapter name/acronym '${userData.chapter2}' for Chapter 2.`,
      };
    }
    chapters.push(resolved);
  }

  // Map positions
  const positions = userData.position ? [userData.position] : [];

  // Calculate batch_of
  let batchOfStr = "";
  if (userData.year) {
    const yearNum = parseInt(userData.year.replace(/\D/g, "") || "0");
    if (yearNum > 0) {
      batchOfStr = String(new Date().getFullYear() - yearNum);
    }
  }

  console.log(`Creating user: ${userData.email}...`);

  // Create user using Better Auth API
  const user = await auth.api.signUpEmail({
    body: {
      email: userData.email,
      password: password,
      name: userData.name,
      username: username,
      membershipId: membershipId,
      usn: userData.usn || "",
      phoneNumber: userData.phoneNumber || "",
      year: userData.year || "",
      department: userData.department || "",
      chapters: chapters,
      batch_of: batchOfStr,
      term: userData.term,
    } as any,
  });

  if (!user) {
    console.error(
      `Error (${userData.email}): Failed to create user - no user object returned`,
    );
    return {
      success: false,
      email: userData.email,
      error: "Failed to create user - no user object returned",
    };
  }

  await db.collection("profile").updateOne(
    { userId: user.user.id },
    {
      $set: {
        userId: user.user.id,
        name: userData.name,
        skills: [],
        social_links: [],
        stats: {},
        achievements: [],
        projects: [],
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  console.log(`User created. Sending welcome email to ${userData.email}...`);

  const { sendOnboardingEmail } = await import("../src/lib/email");
  await sendOnboardingEmail({
    email: userData.email,
    name: userData.name,
    username: username,
    membershipId: membershipId,
    password: password,
  });

  console.log(`Success: Onboarded ${userData.email}`);
  return { success: true, email: userData.email };
}

async function main() {
  await initAuth();

  const targetDb =
    envMode === "production" ? "astranova (PRODUCTION)" : "test (TEST)";
  console.log(`\n=========================================`);
  console.log(`Targeting Database: ${targetDb.toUpperCase()}`);
  console.log(`=========================================\n`);

  const requiredEnvVars = [
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "MONGODB_URL",
    "BETTER_AUTH_SECRET",
  ];
  const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

  if (missingEnvVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`,
    );
    console.info(
      "Please ensure they are defined in .env*. Production runs prefer .env.production(.local).",
    );
    process.exit(1);
  }

  // Verify SMTP connection before processing any users
  console.log("Verifying SMTP connection...");
  const { verifySmtpConnection } = await import("../src/lib/email");
  const smtpOk = await verifySmtpConnection();
  if (!smtpOk) {
    console.error(
      "Fatal Error: SMTP connection verification failed. Check your SMTP_HOST, SMTP_USER, and SMTP_PASS settings.",
    );
    process.exit(1);
  }
  console.log("SMTP connection verified successfully.");

  const csvDir = path.join(process.cwd(), "onboarding-data");
  if (!fs.existsSync(csvDir)) {
    console.error(
      `Directory ${csvDir} not found. Please create it and add your CSV files.`,
    );
    process.exit(1);
  }

  const csvFile = envMode === "production" ? "prod.csv" : "sample.csv";
  const filePath = path.join(csvDir, csvFile);
  if (!fs.existsSync(filePath)) {
    console.error(`File ${csvFile} not found in ${csvDir}.`);
    process.exit(1);
  }

  const results: { success: boolean; email: string; error?: string }[] = [];

  console.log(`Processing file: ${csvFile}`);
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/);
  if (lines.length === 0 || !lines[0].trim()) {
    console.error(`Fatal Error: File ${csvFile} is empty.`);
    process.exit(1);
  }
  const headers = lines[0].split(",").map((h) => h.trim());

  const cleanHeaders = headers.map((h) => h.toLowerCase().replace(/\s+/g, ""));

  const hasBranch = cleanHeaders.includes("branch");
  const hasDept = cleanHeaders.includes("department");

  const hasPostion =
    cleanHeaders.includes("postion") || cleanHeaders.includes("positions");
  const hasPos = cleanHeaders.includes("position");

  const missingHeaders: string[] = [];
  if (!cleanHeaders.includes("name")) missingHeaders.push("Name");
  if (!hasPos && !hasPostion) missingHeaders.push("Position");
  if (!cleanHeaders.includes("chapter1") && !cleanHeaders.includes("chapter_1"))
    missingHeaders.push("Chapter 1");
  if (!cleanHeaders.includes("membershipid"))
    missingHeaders.push("Membership ID");
  if (!hasDept && !hasBranch) missingHeaders.push("Department / Branch");
  if (!cleanHeaders.includes("email")) missingHeaders.push("Email");

  if (missingHeaders.length > 0) {
    console.error(
      `Fatal Error: File ${csvFile} is missing required headers: ${missingHeaders.join(", ")}`,
    );
    process.exit(1);
  }

  const users = lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const user: any = {};
      headers.forEach((header, i) => {
        const cleanHeader = header.toLowerCase().replace(/\s+/g, "");
        const rawValue = values[i] || "";
        const cleanValue = rawValue.replace(/^"|"$/g, "").trim();

        if (cleanHeader === "name") user.name = cleanValue;
        else if (
          cleanHeader === "position" ||
          cleanHeader === "postion" ||
          cleanHeader === "positions"
        )
          user.position = cleanValue;
        else if (cleanHeader === "chapter1" || cleanHeader === "chapter_1")
          user.chapter1 = cleanValue;
        else if (cleanHeader === "chapter2" || cleanHeader === "chapter_2")
          user.chapter2 = cleanValue;
        else if (cleanHeader === "usn") user.usn = cleanValue;
        else if (cleanHeader === "phonenumber" || cleanHeader === "phone")
          user.phoneNumber = cleanValue;
        else if (cleanHeader === "email") user.email = cleanValue;
        else if (cleanHeader === "yearofstudy" || cleanHeader === "year")
          user.year = cleanValue;
        else if (cleanHeader === "membershipid") user.membershipId = cleanValue;
        else if (cleanHeader === "department" || cleanHeader === "branch")
          user.department = cleanValue;
        else if (cleanHeader === "term") user.term = cleanValue;
      });
      return user;
    });

  const defaultTerm = `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`;
  for (const user of users) {
    if (!user.term) {
      user.term = defaultTerm;
    }
  }

  let processedInBatch = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const missingFields: string[] = [];
    if (!user.name) missingFields.push("Name");
    if (!user.position) missingFields.push("Position");
    if (!user.chapter1) missingFields.push("Chapter 1");
    if (!user.membershipId) missingFields.push("Membership ID");
    if (!user.department) missingFields.push("Department / Branch");
    if (!user.email) missingFields.push("Email");

    if (missingFields.length > 0) {
      const rowIdentifier = user.email || user.name || "Unknown Row";
      console.error(
        `Row Validation Error (${rowIdentifier}): Missing required fields: ${missingFields.join(", ")}`,
      );
      results.push({
        success: false,
        email: user.email || "unknown",
        error: `Missing fields: ${missingFields.join(", ")}`,
      });
      continue;
    }

    const mId = String(user.membershipId || "").trim();
    if (!/^\d{9}$/.test(mId)) {
      const rowIdentifier = user.email || user.name || "Unknown Row";
      console.error(
        `Row Validation Error (${rowIdentifier}): Membership ID must be exactly 9 digits.`,
      );
      results.push({
        success: false,
        email: user.email || "unknown",
        error: `Membership ID '${mId}' must be exactly 9 digits.`,
      });
      continue;
    }

    try {
      const result = await onboardUser(user);
      results.push(result);

      if (result.success) {
        processedInBatch++;

        if (i < users.length - 1) {
          const waitMs = DELAY_BETWEEN_EMAILS_MS + jitter();
          console.log(
            `Waiting ${(waitMs / 1000).toFixed(1)}s before next email...`,
          );
          await delay(waitMs);
        }

        if (processedInBatch % BATCH_SIZE === 0 && i < users.length - 1) {
          const batchWaitMs = DELAY_BETWEEN_BATCHES_MS + jitter();
          console.log(
            `\n--- Batch of ${BATCH_SIZE} completed. Cooling down for ${(batchWaitMs / 1000).toFixed(0)}s to avoid rate limits... ---\n`,
          );
          await delay(batchWaitMs);
        }
      }
    } catch (emailErr: any) {
      console.error(
        `\nFatal: Email sending failed for ${user.email}: ${emailErr.message}`,
      );
      console.error(
        "Exiting immediately to prevent silent failures. Re-run for remaining users.\n",
      );

      try {
        const clientPromise = (await import("../src/lib/db")).default;
        const client = await clientPromise;
        await client.close();
      } catch {}

      process.exit(1);
    }
  }

  // Summary
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  console.log(`\nOnboarding Complete!`);
  console.log(`Successfully onboarded: ${successful}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log("\nFailures:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`- ${r.email}: ${r.error}`);
      });
  }

  // Explicitly close MongoDB connection and terminate execution to prevent hanging
  try {
    const clientPromise = (await import("../src/lib/db")).default;
    const client = await clientPromise;
    await client.close();
    console.log("Database connection closed.");
  } catch (e) {
    console.error("Error closing connection:", e);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
