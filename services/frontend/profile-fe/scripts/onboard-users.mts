import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { Chapters as CatalogChapters } from "../../../../packages/catalogues/src/chapter-data/index";

const Chapters = [
  ...CatalogChapters,
  {
    name: "Student Branch",
    acronym: "SB",
    type: null as any,
    color: "#ef4444",
  }
];


// Load environment variables from .env or .env.local
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

// Configure Node environment before any database/auth imports to prevent hoisting-based connection issues
let NODE_ENV: string;
const isProd = process.argv.includes("--production") || process.argv.includes("-p");
if (isProd) {
  NODE_ENV = "production";
} else {
  NODE_ENV = "development";
}

// Module-scoped auth variable that will be dynamically imported
let auth: any;

async function initAuth() {
  const authModule = await import("../src/lib/auth");
  auth = authModule.auth;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Generate clean, unique username utility
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

// Resolve chapter details from catalogues catalog utility
function resolveChapter(acronym: string, position: string) {
  const match = Chapters.find(c => c.acronym.toLowerCase() === acronym.trim().toLowerCase());
  return {
    acronym: acronym.trim().toUpperCase(),
    name: match ? match.name : acronym.trim(),
    position: position || "Member",
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
}) {
  const password = generatePassword();
  console.log(`Password for ${userData.email}: ${password}`);

  const username = generateUsername(userData.name, userData.email);

  // Map chapters
  const chapters: any[] = [];
  if (userData.chapter1) {
    chapters.push(resolveChapter(userData.chapter1, userData.position));
  }
  if (userData.chapter2) {
    chapters.push(resolveChapter(userData.chapter2, userData.position));
  }

  // Map positions
  const positions = userData.position ? [userData.position] : [];

  try {
    console.log(`Creating user: ${userData.email}...`);

    // Create user using Better Auth API
    const user = await auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: password,
        name: userData.name,
        username: username,
        membershipId: userData.membershipId,
        usn: userData.usn || "",
        phoneNumber: userData.phoneNumber || "",
        year: userData.year || "",
        department: userData.department || "",
        chapters: chapters,
        positions: positions,
        social_links: [], // Initialize empty
      } as any,
    });

    if (!user) {
      throw new Error("Failed to create user - no user object returned");
    }

    console.log(`User created. Sending email to ${userData.email}...`);

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"IEEE RITB" <noreply@ieee-ritb.org>',
      to: userData.email,
      subject: "Welcome to IEEE RITB - Your Account Details",
      text: `Hello ${userData.name},\n\nYour account has been created successfully.\n\nUsername: ${username}\nMembership ID: ${userData.membershipId}\nPassword: ${password}\n\nPlease log in at ${process.env.NEXT_PUBLIC_APP_URL || 'https://profile.ieee-ritb.org'}/auth/sign-in\n\nBest regards,\nIEEE RITB Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #00ff9d; background: #0d0d1a; padding: 10px; border-radius: 5px; text-align: center;">Welcome to IEEE RITB</h2>
          <p>Hello <strong>${userData.name}</strong>,</p>
          <p>Your account has been created on the IEEE RITB Profile Portal.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Membership ID:</strong> ${userData.membershipId}</p>
            <p><strong>Password:</strong> <code style="background: #eee; padding: 2px 5px; border-radius: 3px;">${password}</code></p>
          </div>
          <p>Please log in and change your password as soon as possible.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://profile.ieee-ritb.org'}/auth/sign-in" style="background: #00ff9d; color: #0d0d1a; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
          </div>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #666; text-align: center;">If you didn't expect this email, please ignore it.</p>
        </div>
      `,
    });

    console.log(`Success: Onboarded ${userData.email}`);
    return { success: true, email: userData.email };
  } catch (error: any) {
    console.error(`Error onboarding ${userData.email}:`, error.message);
    return { success: false, email: userData.email, error: error.message };
  }
}

async function main() {
  await initAuth();

  const targetDb = process.env.NODE_ENV === "production" ? "astranova (PRODUCTION)" : "test (TEST)";
  console.log(`\n=========================================`);
  console.log(`Targeting Database: ${targetDb.toUpperCase()}`);
  console.log(`=========================================\n`);

  const requiredEnvVars = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "MONGODB_URL", "BETTER_AUTH_SECRET"];
  const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

  if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
    console.info("Please ensure they are defined in .env or .env.local");
    process.exit(1);
  }

  const csvDir = path.join(process.cwd(), "onboarding-data");
  if (!fs.existsSync(csvDir)) {
    console.error(`Directory ${csvDir} not found. Please create it and add your CSV files.`);
    process.exit(1);
  }

  const files = fs.readdirSync(csvDir).filter(f => f.endsWith(".csv"));
  if (files.length === 0) {
    console.log("No CSV files found in onboarding-data directory.");
    return;
  }

  const results = [];

  for (const file of files) {
    console.log(`Processing file: ${file}`);
    const content = fs.readFileSync(path.join(csvDir, file), "utf-8");
    const lines = content.split(/\r?\n/);
    if (lines.length === 0 || !lines[0].trim()) {
      console.error(`Fatal Error: File ${file} is empty.`);
      process.exit(1);
    }
    const headers = lines[0].split(",").map(h => h.trim());

    // Normalize and validate required headers
    // Required headers are: name, position, chapter 1, membership id, department/branch, email
    const cleanHeaders = headers.map(h => h.toLowerCase().replace(/\s+/g, ""));
    const requiredKeys = ["name", "position", "chapter1", "membershipid", "department", "email"];

    // Check if "branch" is present instead of "department"
    const hasBranch = cleanHeaders.includes("branch");
    const hasDept = cleanHeaders.includes("department");

    // Check if "position" has variations
    const hasPostion = cleanHeaders.includes("postion") || cleanHeaders.includes("positions");
    const hasPos = cleanHeaders.includes("position");

    const missingHeaders = [];
    if (!cleanHeaders.includes("name")) missingHeaders.push("Name");
    if (!hasPos && !hasPostion) missingHeaders.push("Position");
    if (!cleanHeaders.includes("chapter1") && !cleanHeaders.includes("chapter_1")) missingHeaders.push("Chapter 1");
    if (!cleanHeaders.includes("membershipid")) missingHeaders.push("Membership ID");
    if (!hasDept && !hasBranch) missingHeaders.push("Department / Branch");
    if (!cleanHeaders.includes("email")) missingHeaders.push("Email");

    if (missingHeaders.length > 0) {
      console.error(`Fatal Error: File ${file} is missing required headers: ${missingHeaders.join(", ")}`);
      process.exit(1);
    }

    const users = lines.slice(1).filter(l => l.trim()).map(line => {
      // Robust CSV line parser supporting quotes and commas
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
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
        else if (cleanHeader === "position" || cleanHeader === "postion" || cleanHeader === "positions") user.position = cleanValue;
        else if (cleanHeader === "chapter1" || cleanHeader === "chapter_1") user.chapter1 = cleanValue;
        else if (cleanHeader === "chapter2" || cleanHeader === "chapter_2") user.chapter2 = cleanValue;
        else if (cleanHeader === "usn") user.usn = cleanValue;
        else if (cleanHeader === "phonenumber" || cleanHeader === "phone") user.phoneNumber = cleanValue;
        else if (cleanHeader === "email") user.email = cleanValue;
        else if (cleanHeader === "yearofstudy" || cleanHeader === "year") user.year = cleanValue;
        else if (cleanHeader === "membershipid") user.membershipId = cleanValue;
        else if (cleanHeader === "department" || cleanHeader === "branch") user.department = cleanValue;
      });
      return user;
    });

    for (const user of users) {
      // Validate required fields per user row
      const missingFields = [];
      if (!user.name) missingFields.push("Name");
      if (!user.position) missingFields.push("Position");
      if (!user.chapter1) missingFields.push("Chapter 1");
      if (!user.membershipId) missingFields.push("Membership ID");
      if (!user.department) missingFields.push("Department / Branch");
      if (!user.email) missingFields.push("Email");

      if (missingFields.length > 0) {
        const rowIdentifier = user.email || user.name || "Unknown Row";
        console.error(`Row Validation Error (${rowIdentifier}): Missing required fields: ${missingFields.join(", ")}`);
        results.push({ success: false, email: user.email || "unknown", error: `Missing fields: ${missingFields.join(", ")}` });
        continue;
      }

      const result = await onboardUser(user);
      results.push(result);
    }
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`\nOnboarding Complete!`);
  console.log(`Successfully onboarded: ${successful}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log("\nFailures:");
    results.filter(r => !r.success).forEach(r => {
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

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
