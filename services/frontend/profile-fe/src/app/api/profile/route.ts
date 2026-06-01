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
  
  // Find authoritative system user record first
  const user = await db.collection("user").findOne({ username });
  if (!user) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  let profile = await db.collection("profile").findOne({ username });

  const safeParseJson = (val: any) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error("Failed to parse JSON string:", val, e);
        return [];
      }
    }
    return Array.isArray(val) ? val : [];
  };

  if (!profile) {
    // Construct a minimal profile from user data
    profile = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      chapters: safeParseJson(user.chapters),
      skills: [],
      social_links: [],
      stats: {},
      achievements: [],
      projects: [],
    };
  }

  // Merge up-to-date authoritative user fields
  const mergedProfile = {
    ...profile,
    name: user.name || profile.name,
    email: user.email || profile.email,
    username: user.username || profile.username,
    membershipId: user.membershipId,
    usn: user.usn,
    phoneNumber: user.phoneNumber,
    year: user.year,
    batch: user.batch,
    department: user.department,
    chapters: safeParseJson(user.chapters || profile.chapters),
    positions: safeParseJson(user.positions || profile.positions),
    skills: safeParseJson(user.skills || profile.skills),
    social_links: safeParseJson(user.social_links || profile.social_links),
  };

  return NextResponse.json(mergedProfile);
}

function hasProfileChanged(oldProfile: any, newProfile: any): boolean {
  const normString = (val: any) => {
    if (val === null || val === undefined) return "";
    return String(val).trim();
  };

  const a = oldProfile || {};
  const b = newProfile || {};

  if (normString(a.name) !== normString(b.name)) return true;
  if (normString(a.username) !== normString(b.username)) return true;
  if (normString(a.image) !== normString(b.image)) return true;
  if (normString(a.current_status) !== normString(b.current_status)) return true;
  if (normString(a.bio) !== normString(b.bio)) return true;

  // Compare stats
  const statsA = a.stats || {};
  const statsB = b.stats || {};
  const keysA = Object.keys(statsA).filter(k => normString(statsA[k]) !== "");
  const keysB = Object.keys(statsB).filter(k => normString(statsB[k]) !== "");
  if (keysA.length !== keysB.length) return true;
  for (const k of keysA) {
    if (normString(statsA[k]) !== normString(statsB[k])) return true;
  }

  // Compare social links
  const linksA = (a.social_links || []).filter((l: any) => normString(l?.label) !== "" || normString(l?.link) !== "");
  const linksB = (b.social_links || []).filter((l: any) => normString(l?.label) !== "" || normString(l?.link) !== "");
  if (linksA.length !== linksB.length) return true;
  for (let i = 0; i < linksA.length; i++) {
    if (normString(linksA[i]?.label) !== normString(linksB[i]?.label)) return true;
    if (normString(linksA[i]?.link) !== normString(linksB[i]?.link)) return true;
  }

  // Compare achievements
  const achA = (a.achievements || []).filter((h: any) => normString(h?.title) !== "");
  const achB = (b.achievements || []).filter((h: any) => normString(h?.title) !== "");
  if (achA.length !== achB.length) return true;
  for (let i = 0; i < achA.length; i++) {
    if (normString(achA[i]?.title) !== normString(achB[i]?.title)) return true;
    if (normString(achA[i]?.badge_type) !== normString(achB[i]?.badge_type)) return true;
    if (normString(achA[i]?.date) !== normString(achB[i]?.date)) return true;
    if (normString(achA[i]?.description) !== normString(achB[i]?.description)) return true;
    if (normString(achA[i]?.link) !== normString(achB[i]?.link)) return true;
  }

  // Compare projects
  const projA = (a.projects || []).filter((p: any) => normString(p?.title) !== "");
  const projB = (b.projects || []).filter((p: any) => normString(p?.title) !== "");
  if (projA.length !== projB.length) return true;
  for (let i = 0; i < projA.length; i++) {
    if (normString(projA[i]?.type) !== normString(projB[i]?.type)) return true;
    if (normString(projA[i]?.title) !== normString(projB[i]?.title)) return true;
    if (normString(projA[i]?.short_description) !== normString(projB[i]?.short_description)) return true;
    if (normString(projA[i]?.long_description) !== normString(projB[i]?.long_description)) return true;
    if (normString(projA[i]?.primary_link) !== normString(projB[i]?.primary_link)) return true;
    if (normString(projA[i]?.extra_link) !== normString(projB[i]?.extra_link)) return true;

    const tagsA = (projA[i]?.tags || []).filter((t: string) => normString(t) !== "");
    const tagsB = (projB[i]?.tags || []).filter((t: string) => normString(t) !== "");
    if (tagsA.length !== tagsB.length) return true;
    for (let j = 0; j < tagsA.length; j++) {
      if (normString(tagsA[j]) !== normString(tagsB[j])) return true;
    }
  }


  // Compare skills
  const skillsA = a.skills || [];
  const skillsB = b.skills || [];
  if (skillsA.length !== skillsB.length) return true;
  for (let i = 0; i < skillsA.length; i++) {
    if (normString(skillsA[i]) !== normString(skillsB[i])) return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  
  // Clean empty social links before validation and saving
  const cleanedSocialLinks = (body.social_links || []).filter((sl: any) => sl.link && sl.link.trim() !== "");
  const cleanedBody = {
    ...body,
    social_links: cleanedSocialLinks,
  };

  const result = profileSchema.safeParse(cleanedBody);

  if (!result.success) {
    return NextResponse.json({ message: "Invalid data", errors: result.error.format() }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(getDbName());

  // Get existing profile to preserve chapters and positions
  const currentProfile = await db.collection("profile").findOne({ email: session.user.email });

  if (!hasProfileChanged(currentProfile, result.data)) {
    return NextResponse.json({ message: "No changes detected. Profile is already up-to-date." });
  }

  const preservedChapters = currentProfile?.chapters || [];
  const preservedPositions = currentProfile?.positions || [];

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
  const profileData = {
    ...result.data,
    chapters: preservedChapters, // Overwrite with preserved chapters
    positions: preservedPositions, // Overwrite with preserved positions
    userId: session.user.id,
    updatedAt: new Date()
  };

  await db.collection("profile").updateOne(
    { email: session.user.email },
    { $set: profileData },
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
        skills: result.data.skills,
        social_links: result.data.social_links,
        // chapters are not updated here as they are managed by admin/onboarding
        updatedAt: new Date()
      }
    }
  );

  return NextResponse.json({ message: "Profile updated successfully" });
}
