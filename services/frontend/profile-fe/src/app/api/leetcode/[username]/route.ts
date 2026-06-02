import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ message: "Username is required" }, { status: 400 });
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
      return NextResponse.json({ message: "LeetCode API error" }, { status: res.status });
    }

    const json = await res.json();

    if (!json.data?.matchedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const calendarStr = json.data.matchedUser.userCalendar.submissionCalendar;
    const calendar = typeof calendarStr === "string" ? JSON.parse(calendarStr) : calendarStr;

    const days = Object.entries(calendar as Record<string, number>).map(([ts, count]) => ({
      date: new Date(parseInt(ts) * 1000).toISOString().split("T")[0],
      count,
    }));

    const total = days.reduce((s, d) => s + d.count, 0);

    return NextResponse.json({ days, total });
  } catch (err) {
    console.error("LeetCode proxy error:", err);
    return NextResponse.json({ message: "Failed to fetch LeetCode data" }, { status: 500 });
  }
}
