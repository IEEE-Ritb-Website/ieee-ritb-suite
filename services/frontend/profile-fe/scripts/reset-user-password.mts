import dotenv from "dotenv";
import fs from "fs";
import { hashPassword } from "better-auth/crypto";

// Configure dotenv
const isProd = process.argv.includes("--production") || process.argv.includes("-p");
const envMode = isProd ? "production" : "development";
type MutableProcessEnv = Omit<NodeJS.ProcessEnv, "NODE_ENV"> & { NODE_ENV?: string };
(process.env as MutableProcessEnv).NODE_ENV = envMode;

const loadEnvIfExists = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath });
  }
};

loadEnvIfExists(".env.local");
loadEnvIfExists(".env");

async function main() {
  const emailArg = process.argv.find(arg => arg.includes("@"));
  const passwordArg = process.argv.find(arg => arg.startsWith("--password="))?.split("=")[1] || "Password123!";
  
  if (!emailArg) {
    console.error("Error: Please provide a target email address as an argument.");
    console.info("Usage: npx tsx scripts/reset-user-password.mts <email> [--password=<new_password>] [-p/--production]");
    process.exit(1);
  }

  const email = emailArg.trim().toLowerCase();
  
  try {
    const { default: clientPromise, getDbName } = await import("../src/lib/db");
    const client = await clientPromise;
    const db = client.db(getDbName());
    
    console.log(`\n=========================================`);
    console.log(`Targeting Database: ${getDbName().toUpperCase()}`);
    console.log(`User Email: ${email}`);
    console.log(`New Password: ${passwordArg}`);
    console.log(`=========================================\n`);
    
    const user = await db.collection("user").findOne({ email });
    if (!user) {
      console.error(`Error: User with email '${email}' not found in the database.`);
      await client.close();
      process.exit(1);
    }
    
    console.log(`Found user: ${user.name} (ID: ${user._id})`);
    
    // Hash the password using Better Auth's standard hasher
    const passwordHash = await hashPassword(passwordArg);
    
    // Update or upsert the account document
    const result = await db.collection("account").updateOne(
      { userId: user._id, providerId: "credential" },
      {
        $set: {
          userId: user._id,
          providerId: "credential",
          accountId: user._id.toString(),
          password: passwordHash,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log(`SUCCESS: Password updated successfully for user ${email}!`);
    console.log(`Database matching account update results:`, result);
    
    await client.close();
  } catch (err: any) {
    console.error("Failed to reset password:", err.message, err);
  }
}

main();
