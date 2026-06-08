import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { verifyPassword } from "better-auth/crypto";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in first." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const { token, password } = body as { token?: string; password?: string };

    if (!token || !password) {
      return NextResponse.json(
        { message: "Verification token and password are required." },
        { status: 400 },
      );
    }

    const db = await getDb();

    // Look up the pending verification by token AND userId to prevent token-swap attacks
    const pending = await db
      .collection("email_change_verifications")
      .findOne({ token, userId: session.user.id });

    if (!pending) {
      return NextResponse.json(
        { message: "Invalid or expired verification link." },
        { status: 400 },
      );
    }

    if (new Date() > new Date(pending.expiresAt)) {
      await db
        .collection("email_change_verifications")
        .deleteOne({ _id: pending._id });
      return NextResponse.json(
        {
          message:
            "This verification link has expired. Please request a new email change.",
        },
        { status: 400 },
      );
    }

    // Verify the current password
    const account = await db.collection("account").findOne({
      userId: session.user.id,
      providerId: "credential",
    });

    if (!account?.password) {
      return NextResponse.json(
        {
          message:
            "No password credentials found for this account. Contact support.",
        },
        { status: 400 },
      );
    }

    const isPasswordCorrect = await verifyPassword({
      password,
      hash: account.password,
    });

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password." },
        { status: 400 },
      );
    }

    // Check the new email isn't taken by someone else (race condition guard)
    const taken = await db
      .collection("user")
      .findOne({ email: pending.newEmail, id: { $ne: session.user.id } });
    if (taken) {
      await db
        .collection("email_change_verifications")
        .deleteOne({ _id: pending._id });
      return NextResponse.json(
        { message: "This email is already registered to another account." },
        { status: 400 },
      );
    }

    // Apply the email change
    await db
      .collection("user")
      .updateOne(
        { id: session.user.id },
        { $set: { email: pending.newEmail, updatedAt: new Date() } },
      );

    // Clean up the pending verification
    await db
      .collection("email_change_verifications")
      .deleteOne({ _id: pending._id });

    // Sign the user out so they re-authenticate with the new email
    await auth.api.signOut({ headers: await headers() });

    return NextResponse.json({ status: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Verify email change error:", message);
    return NextResponse.json(
      { message: message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { message: "Token is required." },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const pending = await db
      .collection("email_change_verifications")
      .findOne({ token });

    if (!pending || new Date() > new Date(pending.expiresAt)) {
      return NextResponse.json(
        { valid: false, message: "Invalid or expired verification link." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      valid: true,
      newEmail: pending.newEmail,
      currentEmail: pending.currentEmail,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message }, { status: 500 });
  }
}
