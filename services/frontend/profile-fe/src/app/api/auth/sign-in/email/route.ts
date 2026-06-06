import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getDbName } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let signInRatelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    signInRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 attempts per 1 minute
      analytics: true,
      prefix: "profile-fe/sign-in",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to initialize Sign-in Upstash Ratelimit:", message);
  }
}

export async function POST(req: NextRequest) {
  if (signInRatelimit) {
    try {
      const ip =
        (req as any).ip ||
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        "127.0.0.1";
      const { success, limit, reset, remaining } =
        await signInRatelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            message:
              "Too many authentication attempts. Please try again later.",
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
      console.error("Sign-in rate limiting error:", message);
      // Fail-open
    }
  }

  try {
    const { email: identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
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
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Call Better Auth to perform sign in with email and password.
    // Setting `asResponse: true` causes Better Auth to return a standard Response
    // with secure HttpOnly Set-Cookie headers for the session.
    const response = await auth.api.signInEmail({
      body: {
        email: user.email,
        password: password,
      },
      headers: await headers(),
      asResponse: true,
    });

    return response;
  } catch (error: any) {
    console.error("Custom sign-in override error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
