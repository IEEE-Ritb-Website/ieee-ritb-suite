import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis and Ratelimit only if the environment variables are present
// to avoid breaking local development/testing if they are not set.
let leetcodeRatelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    leetcodeRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per 1 minute
      analytics: true,
      prefix: "profile-fe/leetcode",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to initialize LeetCode Upstash Ratelimit:", message);
  }
}

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json(
      { message: "Username is required" },
      { status: 400 },
    );
  }

  // Apply rate limiting if initialized
  if (leetcodeRatelimit) {
    try {
      const ip =
        (req as any).ip ||
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        "127.0.0.1";
      const { success, limit, reset, remaining } =
        await leetcodeRatelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { message: "Too many requests. Please try again later." },
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
      console.error("LeetCode rate limiting error:", message);
      // Fail-open
    }
  }

  try {
    const query = `
      query userProfileCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar {
            submissionCalendar
          }
        }
      }
    `;

    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com/",
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "LeetCode API error" },
        { status: res.status },
      );
    }

    const json = await res.json();

    if (!json.data?.matchedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const calendarStr = json.data.matchedUser.userCalendar.submissionCalendar;
    const calendar =
      typeof calendarStr === "string" ? JSON.parse(calendarStr) : calendarStr;

    const days = Object.entries(calendar as Record<string, number>).map(
      ([ts, count]) => ({
        date: new Date(parseInt(ts) * 1000).toISOString().split("T")[0],
        count,
      }),
    );

    const total = days.reduce((s, d) => s + d.count, 0);

    return NextResponse.json({ days, total });
  } catch (err) {
    console.error("LeetCode proxy error:", err);
    return NextResponse.json(
      { message: "Failed to fetch LeetCode data" },
      { status: 500 },
    );
  }
}
