import dotenv from "dotenv";
import fs from "fs";
import { ObjectId } from "mongodb";

const isProd =
  process.argv.includes("--production") || process.argv.includes("-p");
const isDryRun =
  process.argv.includes("--dry-run") || process.argv.includes("-d");
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

async function main() {
  try {
    const { default: clientPromise, getDbName } = await import("../src/lib/db");
    const client = await clientPromise;
    const db = client.db(getDbName());

    console.log(`\n=========================================`);
    console.log(`Targeting Database: ${getDbName().toUpperCase()}`);
    console.log(
      `Execution Mode: ${isDryRun ? "DRY-RUN (No changes will be saved)" : "LIVE CLEANUP"}`,
    );
    console.log(`=========================================\n`);

    const profiles = await db.collection("profile").find({}).toArray();
    console.log(
      `Fetched ${profiles.length} profile documents from collection.`,
    );

    let orphansFound = 0;
    let validCount = 0;
    const profilesToDelete: ObjectId[] = [];

    for (const profile of profiles) {
      const { _id, userId, name } = profile;
      const profileName = name || "Unnamed";

      // 1. Check if userId is missing, null, or empty
      if (!userId || typeof userId !== "string" || userId.trim() === "") {
        console.log(
          `[ORPHAN] Profile ID: ${_id} (Name: ${profileName}) - Reason: Missing or empty userId.`,
        );
        orphansFound++;
        profilesToDelete.push(_id);
        continue;
      }

      // 2. Check if the userId matches any user in the user collection
      let userObjId: ObjectId | null = null;
      try {
        if (ObjectId.isValid(userId)) {
          userObjId = new ObjectId(userId);
        }
      } catch {
        // Invalid ObjectId string
      }

      let userExists = false;

      // Try looking up by ObjectId
      if (userObjId) {
        const user = await db.collection("user").findOne({ _id: userObjId });
        if (user) {
          userExists = true;
        }
      }

      // Fallback lookup by string _id (some custom setups or mocks might store string _ids)
      if (!userExists) {
        const userWithStringId = await db
          .collection("user")
          .findOne({ _id: userId as unknown as ObjectId });
        if (userWithStringId) {
          userExists = true;
        }
      }

      if (!userExists) {
        console.log(
          `[ORPHAN] Profile ID: ${_id} (Name: ${profileName}, userId: "${userId}") - Reason: No matching user found in 'user' collection.`,
        );
        orphansFound++;
        profilesToDelete.push(_id);
      } else {
        validCount++;
      }
    }

    console.log(`\nScan complete:`);
    console.log(`- Total Profiles: ${profiles.length}`);
    console.log(`- Valid Profiles: ${validCount}`);
    console.log(`- Orphan Profiles: ${orphansFound}`);

    if (orphansFound > 0) {
      if (isDryRun) {
        console.log(
          `\n[DRY-RUN] Would have deleted ${orphansFound} orphan profiles.`,
        );
      } else {
        console.log(`\nDeleting ${orphansFound} orphan profiles...`);
        const result = await db.collection("profile").deleteMany({
          _id: { $in: profilesToDelete },
        });
        console.log(
          `Successfully deleted ${result.deletedCount} profile documents.`,
        );
      }
    } else {
      console.log(`\nNo orphan profiles found. Database is clean!`);
    }

    await client.close();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("FATAL Cleanup Error:", message, err);
    process.exit(1);
  }
}

main();
