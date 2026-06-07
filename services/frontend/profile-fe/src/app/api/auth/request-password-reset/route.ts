import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getDbName } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let passwordResetRatelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    passwordResetRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "5 m"), // 3 attempts per 5 minutes
      analytics: true,
      prefix: "profile-fe/password-reset",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      "Failed to initialize Password reset Upstash Ratelimit:",
      message,
    );
  }
}

export async function POST(req: NextRequest) {
  if (passwordResetRatelimit) {
    try {
      const ip =
        (req as NextRequest & { ip?: string }).ip ||
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        "127.0.0.1";
      const { success, limit, reset, remaining } =
        await passwordResetRatelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            message:
              "Too many password reset attempts. Please try again later.",
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          },
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Password reset rate limiting error:", message);
      // Fail-open
    }
  }

  try {
    const { email: identifier, redirectTo } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        { message: "Email, Username, or Membership ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(getDbName());

    // Resolve user by checking email, membershipId, or username in the user collection
    const user = await db.collection("user").findOne({
      $or: [
        { email: identifier.trim() },
        { membershipId: identifier.trim() },
        { username: identifier.trim() },
      ],
    });

    if (!user || !user.email) {
      // Return success response to prevent email enumeration
      return NextResponse.json({ status: true });
    }

    // Call Better Auth to initiate password reset on the resolved email
    const response = await auth.api.requestPasswordReset({
      body: {
        email: user.email,
        redirectTo: redirectTo,
      },
      headers: await headers(),
      asResponse: true,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Custom password reset override error:", message);
    return NextResponse.json(
      { message: message || "Internal server error" },
      { status: 500 },
    );
  }
}
