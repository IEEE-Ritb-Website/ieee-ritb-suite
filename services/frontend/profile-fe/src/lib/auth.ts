import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import clientPromise, { getDbName } from "./db";

// Better Auth 1.0 supports passing a promise for the database or we can await it here.
// To ensure the topology is open, we await the client promise.
const client = await clientPromise;
const db = client.db(getDbName());

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
      },
      tagline: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      social_links: {
        type: "json",
        required: false,
      },
      chapters: {
        type: "json",
        required: false,
      },
      batch: {
        type: "string",
        required: false,
      },
      year: {
        type: "string",
        required: false,
      },
      department: {
        type: "string",
        required: false,
      },
      usn: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        defaultValue: "member",
      },
      membershipId: {
        type: "string",
        required: true,
      },
      positions: {
        type: "json",
        defaultValue: [],
      }
    }
  },
  plugins: [nextCookies()],
});
