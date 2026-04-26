
import { auth } from "../src/lib/auth";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

// Load environment variables from .env or .env.local
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

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

async function onboardUser(userData: {
  email: string;
  name: string;
  username: string;
  membershipId: string;
  chapters?: string; // Comma separated acronyms or JSON string
  positions?: string; // JSON string or comma separated
}) {
  const password = generatePassword();
  
  // Parse chapters if provided
  let chapters: any[] = [];
  if (userData.chapters) {
    try {
      // Try to parse as JSON first
      chapters = JSON.parse(userData.chapters);
    } catch (e) {
      // Fallback to comma separated acronyms
      chapters = userData.chapters.split(",").map(acronym => ({
        name: acronym.trim(), // We might want to look up full names later
        acronym: acronym.trim(),
        position: "Member",
      }));
    }
  }

  // Parse positions if provided
  let positions: any[] = [];
  if (userData.positions) {
    try {
      positions = JSON.parse(userData.positions);
    } catch (e) {
      positions = userData.positions.split(",").map(pos => pos.trim());
    }
  }

  try {
    console.log(`Creating user: ${userData.email}...`);
    
    // Create user using Better Auth API
    const user = await auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: password,
        name: userData.name,
        username: userData.username,
        membershipId: userData.membershipId,
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
      text: `Hello ${userData.name},\n\nYour account has been created successfully.\n\nUsername: ${userData.username}\nMembership ID: ${userData.membershipId}\nPassword: ${password}\n\nPlease log in at ${process.env.NEXT_PUBLIC_APP_URL || 'https://profile.ieee-ritb.org'}/auth/sign-in\n\nBest regards,\nIEEE RITB Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #00ff9d; background: #0d0d1a; padding: 10px; border-radius: 5px; text-align: center;">Welcome to IEEE RITB</h2>
          <p>Hello <strong>${userData.name}</strong>,</p>
          <p>Your account has been created on the IEEE RITB Profile Portal.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Username:</strong> ${userData.username}</p>
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
    const lines = content.split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    
    // Basic validation of headers
    const requiredHeaders = ["email", "name", "username", "membershipId"];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      console.error(`File ${file} is missing required headers: ${missingHeaders.join(", ")}`);
      continue;
    }

    const users = lines.slice(1).filter(l => l.trim()).map(line => {
      const values = line.split(",").map(v => v.trim());
      const user: any = {};
      headers.forEach((header, i) => {
        user[header] = values[i];
      });
      return user;
    });

    for (const user of users) {
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
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
