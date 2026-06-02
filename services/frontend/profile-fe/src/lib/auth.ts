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
    sendResetPassword: async ({ user, url }) => {
      const { sendResetPasswordEmail } = await import("./email");
      sendResetPasswordEmail({
        email: user.email,
        name: user.name,
        resetUrl: url,
      }).catch((err) => {
        console.error("Failed to send password reset email to", user.email, err);
      });
    },
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
      chapters: {
        type: "json",
        required: false,
      },
      batch: {
        type: "string",
        required: false,
      },
      batch_of: {
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
      phoneNumber: {
        type: "string",
        required: false,
      },
      term: {
        type: "string",
        required: true,
      }
    }
  },
  plugins: [nextCookies()],
});
