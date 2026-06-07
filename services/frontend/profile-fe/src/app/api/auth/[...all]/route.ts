import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { getDb } from "@/lib/db";
import { verifyPassword } from "better-auth/crypto";

const handler = toNextJsHandler(auth);

const blockSignUp = (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname.includes("sign-up")) {
    return new Response("Sign up is disabled", { status: 403 });
  }
  return null;
};

const handleEmailChangeRequest = async (req: Request) => {
  const url = new URL(req.url);
  if (!url.pathname.endsWith("/change-email") || req.method !== "POST") {
    return null;
  }

  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: { message: "Unauthorized" } }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const clone = req.clone();
    const body = await clone.json().catch(() => ({}));
    const { newEmail, currentPassword } = body;

    if (!newEmail || typeof newEmail !== "string" || !newEmail.trim()) {
      return new Response(
        JSON.stringify({ error: { message: "New email is required." } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const normalizedNewEmail = newEmail.trim().toLowerCase();
    if (normalizedNewEmail === session.user.email.toLowerCase()) {
      return new Response(
        JSON.stringify({
          error: { message: "New email must be different from current email." },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!currentPassword || typeof currentPassword !== "string") {
      return new Response(
        JSON.stringify({ error: { message: "Current password is required." } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const db = await getDb();
    const userId = session.user.id;

    // 1. Verify password
    const account = await db.collection("account").findOne({
      userId: userId,
      providerId: "credential",
    });

    if (!account || !account.password) {
      return new Response(
        JSON.stringify({
          error: { message: "Account credentials not found." },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const isPasswordCorrect = await verifyPassword({
      password: currentPassword,
      hash: account.password,
    });

    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ error: { message: "Invalid current password." } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // 2. Enforce rate limit (max 2 email changes per account per rolling 24-hour day)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await db.collection("email_change_logs").countDocuments({
      userId: userId,
      requestedAt: { $gte: twentyFourHoursAgo },
    });

    if (count >= 2) {
      return new Response(
        JSON.stringify({
          error: {
            message:
              "Rate limit exceeded: You can only change your email 2 times per 24 hours.",
          },
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    // 3. Log the change attempt
    await db.collection("email_change_logs").insertOne({
      userId: userId,
      oldEmail: session.user.email,
      newEmail: normalizedNewEmail,
      requestedAt: new Date(),
    });

    return null; // Proceed to better-auth default handler
  } catch (err: any) {
    console.error("Error validating email change request:", err);
    return new Response(
      JSON.stringify({
        error: { message: "Internal server error during validation." },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const GET = async (req: Request) => {
  const blocked = blockSignUp(req);
  if (blocked) return blocked;
  return handler.GET(req);
};

export const POST = async (req: Request) => {
  const blocked = blockSignUp(req);
  if (blocked) return blocked;

  const emailChangeResponse = await handleEmailChangeRequest(req);
  if (emailChangeResponse) return emailChangeResponse;

  return handler.POST(req);
};
