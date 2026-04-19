import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getDbName } from "@/lib/db";
import { profileSchema } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ message: "Username is required" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(getDbName());
  let profile = await db.collection("profile").findOne({ username });

  if (!profile) {
    // Fallback to basic user info if profile hasn't been initialized yet
    const user = await db.collection("user").findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }
    // Construct a minimal profile from user data
    profile = {
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      chapters: [],
      social_links: [],
      stats: {},
      achievements: [],
      projects: [],
    };
  }

  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  
  // We use profileSchema for validation. Note: We don't touch Better Auth 'user' table here.
  // The 'profile' collection is our custom extension.
  const result = profileSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Invalid data", errors: result.error.format() }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(getDbName());

  // Strict check: Is this username taken by someone ELSE in either our profile table OR BA user table?
  const username = result.data.username;
  
  // 1. Check profiles collection
  const existingProfile = await db.collection("profile").findOne({ 
    username, 
    email: { $ne: session.user.email } 
  });
  
  if (existingProfile) {
    return NextResponse.json({ message: "Username already taken by another profile" }, { status: 400 });
  }

  // 2. Check Better Auth user collection (to ensure consistency across the app)
  // We assume the user table is named "user" as per standard Better Auth config
  const existingUser = await db.collection("user").findOne({ 
    username, 
    email: { $ne: session.user.email } 
  });

  if (existingUser) {
    return NextResponse.json({ message: "Username already taken by another system user" }, { status: 400 });
  }

  // Update or Insert the profile document
  await db.collection("profile").updateOne(
    { email: session.user.email },
    { 
      $set: { 
        ...result.data, 
        userId: session.user.id, 
        updatedAt: new Date() 
      } 
    },
    { upsert: true }
  );

  // Sync basic info to Better Auth user collection
  await db.collection("user").updateOne(
    { email: session.user.email },
    {
      $set: {
        name: result.data.name,
        image: result.data.image,
        username: result.data.username,
        updatedAt: new Date()
      }
    }
  );

  return NextResponse.json({ message: "Profile updated successfully" });
}
