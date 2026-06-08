import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { newEmail } = body as { newEmail?: string };

    if (!newEmail || typeof newEmail !== "string" || !newEmail.trim()) {
      return NextResponse.json(
        { message: "New email is required." },
        { status: 400 },
      );
    }

    const normalizedNewEmail = newEmail.trim().toLowerCase();

    if (normalizedNewEmail === session.user.email.toLowerCase()) {
      return NextResponse.json(
        { message: "New email must be different from your current email." },
        { status: 400 },
      );
    }

    const db = await getDb();

    // Check if the new email is already registered
    const existing = await db
      .collection("user")
      .findOne({ email: normalizedNewEmail });
    if (existing) {
      return NextResponse.json(
        {
          message:
            "This email address is already registered to another account.",
        },
        { status: 400 },
      );
    }

    // Generate a secure single-use token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Remove any existing pending change for this user and store the new one
    await db
      .collection("email_change_verifications")
      .deleteMany({ userId: session.user.id });

    await db.collection("email_change_verifications").insertOne({
      userId: session.user.id,
      currentEmail: session.user.email,
      newEmail: normalizedNewEmail,
      token,
      createdAt: new Date(),
      expiresAt,
    });

    // Send verification email to the NEW address
    const { sendEmailChangeVerificationEmail } = await import("@/lib/email");
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";
    const verificationUrl = `${appUrl}/auth/verify-email-change?token=${token}`;

    await sendEmailChangeVerificationEmail({
      email: normalizedNewEmail,
      name: session.user.name,
      verificationUrl,
    });

    return NextResponse.json({ status: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Change email request error:", message);
    return NextResponse.json(
      { message: message || "Internal server error" },
      { status: 500 },
    );
  }
}
