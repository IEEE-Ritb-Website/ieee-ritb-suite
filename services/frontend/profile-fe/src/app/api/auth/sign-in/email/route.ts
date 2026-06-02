import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getDbName } from "@/lib/db";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email: identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(getDbName());

    // Resolve user by checking email, membershipId, or username in the user collection
    const user = await db.collection("user").findOne({
      $or: [
        { email: identifier.trim() },
        { membershipId: identifier.trim() },
        { username: identifier.trim() }
      ]
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
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
      { status: 500 }
    );
  }
}
