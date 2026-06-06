import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis and Ratelimit only if the environment variables are present
// to avoid breaking local development/testing if they are not set.
let ratelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"), // Max 3 updates per hour
      analytics: true,
      prefix: "profile-fe/upload",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to initialize Upstash Ratelimit:", message);
  }
}

export async function POST(req: NextRequest) {
  // Ensure cloudinary is configured
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    secure: true,
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Apply rate limiting if initialized
  if (ratelimit) {
    try {
      const identifier = session.user.id;
      const { success, limit, reset, remaining } =
        await ratelimit.limit(identifier);

      if (!success) {
        return NextResponse.json(
          {
            message:
              "You have exceeded the profile picture update limit. Max 3 updates per hour allowed.",
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
      console.error("Rate limiting execution error:", message);
      // Fail-open: proceed with upload even if rate limit check fails
    }
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    // Enforce 5 MB maximum file size
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { message: "File size exceeds the limit of 5 MB." },
        { status: 400 },
      );
    }

    // Enforce supported image types (JPEG, PNG, WEBP) and block others (like GIF)
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];
    if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          message:
            "Unsupported file format. Please upload an image (JPEG, PNG, WEBP).",
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profiles",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string });
            },
          )
          .end(buffer);
      },
    );

    return NextResponse.json({
      message: "Upload successful",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Rollback rate limit for Cloudinary/system failure since it's not a user error
    if (ratelimit) {
      try {
        const identifier = session.user.id;
        await ratelimit.resetUsedTokens(identifier);
        console.log(
          `Rate limit tokens reset successfully for user: ${identifier}`,
        );
      } catch (resetError) {
        console.error("Failed to reset rate limit tokens:", resetError);
      }
    }

    return NextResponse.json(
      {
        message:
          "Server error or upload provider disruption. Please try again.",
      },
      { status: 500 },
    );
  }
}
