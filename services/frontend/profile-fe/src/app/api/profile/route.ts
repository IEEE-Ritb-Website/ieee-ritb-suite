import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getDbName } from "@/lib/db";
import { profileSchema } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  if (!username && !email && !userId) {
    return NextResponse.json(
      { message: "Identifier is required" },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db(getDbName());

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

  let profile = null;
  let user = null;

  if (username) {
    user = await db.collection("user").findOne({ username });
    if (user) {
      profile = await db
        .collection("profile")
        .findOne({ userId: user._id.toString() });
      if (!profile) {
        // Create minimal profile
        profile = {
          _id: user._id,
          name: user.name,
          skills: [],
          social_links: [],
          stats: {},
          achievements: [],
          projects: [],
        };
      }
    }
  } else if (email) {
    user = await db.collection("user").findOne({ email });
    if (user) {
      profile = await db
        .collection("profile")
        .findOne({ userId: user._id.toString() });
      if (!profile) {
        // Create minimal profile on the fly
        profile = {
          _id: user._id,
          name: user.name,
          skills: [],
          social_links: [],
          stats: {},
          achievements: [],
          projects: [],
        };
      }
    }
  } else if (userId) {
    const queryId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    user = await db.collection("user").findOne({ _id: queryId as any });
    if (user) {
      profile = await db
        .collection("profile")
        .findOne({ userId: user._id.toString() });
      if (!profile) {
        profile = {
          _id: user._id,
          name: user.name,
          skills: [],
          social_links: [],
          stats: {},
          achievements: [],
          projects: [],
        };
      }
    }
  }

  if (!user || !profile) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  // Merge up-to-date authoritative user fields
  const mergedProfile = {
    ...profile,
    name: user.name || profile.name,
    email: user.email,
    username: user.username,
    membershipId: user.membershipId,
    usn: user.usn,
    phoneNumber: user.phoneNumber,
    year: user.year,
    batch: user.batch,
    batch_of: user.batch_of,
    department: user.department,
    term: user.term,
    chapters: safeParseJson(user.chapters),
    skills: safeParseJson(profile.skills),
    social_links: safeParseJson(profile.social_links),
    timeline: safeParseJson(profile.timeline),
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
  if (normString(a.image) !== normString(b.image)) return true;
  if (normString(a.current_status) !== normString(b.current_status))
    return true;
  if (normString(a.bio) !== normString(b.bio)) return true;

  // Compare stats
  const statsA = a.stats || {};
  const statsB = b.stats || {};
  const keysA = Object.keys(statsA).filter((k) => normString(statsA[k]) !== "");
  const keysB = Object.keys(statsB).filter((k) => normString(statsB[k]) !== "");
  if (keysA.length !== keysB.length) return true;
  for (const k of keysA) {
    if (normString(statsA[k]) !== normString(statsB[k])) return true;
  }

  // Compare social links
  const linksA = (a.social_links || []).filter(
    (l: any) => normString(l?.label) !== "" || normString(l?.link) !== "",
  );
  const linksB = (b.social_links || []).filter(
    (l: any) => normString(l?.label) !== "" || normString(l?.link) !== "",
  );
  if (linksA.length !== linksB.length) return true;
  for (let i = 0; i < linksA.length; i++) {
    if (normString(linksA[i]?.label) !== normString(linksB[i]?.label))
      return true;
    if (normString(linksA[i]?.link) !== normString(linksB[i]?.link))
      return true;
  }

  // Compare achievements
  const achA = (a.achievements || []).filter(
    (h: any) => normString(h?.title) !== "",
  );
  const achB = (b.achievements || []).filter(
    (h: any) => normString(h?.title) !== "",
  );
  if (achA.length !== achB.length) return true;
  for (let i = 0; i < achA.length; i++) {
    if (normString(achA[i]?.title) !== normString(achB[i]?.title)) return true;
    if (normString(achA[i]?.badge_type) !== normString(achB[i]?.badge_type))
      return true;
    if (normString(achA[i]?.date) !== normString(achB[i]?.date)) return true;
    if (normString(achA[i]?.description) !== normString(achB[i]?.description))
      return true;
    if (normString(achA[i]?.link) !== normString(achB[i]?.link)) return true;
  }

  // Compare projects
  const projA = (a.projects || []).filter(
    (p: any) => normString(p?.title) !== "",
  );
  const projB = (b.projects || []).filter(
    (p: any) => normString(p?.title) !== "",
  );
  if (projA.length !== projB.length) return true;
  for (let i = 0; i < projA.length; i++) {
    if (normString(projA[i]?.type) !== normString(projB[i]?.type)) return true;
    if (normString(projA[i]?.title) !== normString(projB[i]?.title))
      return true;
    if (
      normString(projA[i]?.short_description) !==
      normString(projB[i]?.short_description)
    )
      return true;
    if (
      normString(projA[i]?.long_description) !==
      normString(projB[i]?.long_description)
    )
      return true;
    if (
      normString(projA[i]?.primary_link) !== normString(projB[i]?.primary_link)
    )
      return true;
    if (normString(projA[i]?.extra_link) !== normString(projB[i]?.extra_link))
      return true;

    const tagsA = (projA[i]?.tags || []).filter(
      (t: string) => normString(t) !== "",
    );
    const tagsB = (projB[i]?.tags || []).filter(
      (t: string) => normString(t) !== "",
    );
    if (tagsA.length !== tagsB.length) return true;
    for (let j = 0; j < tagsA.length; j++) {
      if (normString(tagsA[j]) !== normString(tagsB[j])) return true;
    }
  }

  if (normString(a.github_username) !== normString(b.github_username))
    return true;
  if (normString(a.leetcode_username) !== normString(b.leetcode_username))
    return true;
  if (normString(a.department) !== normString(b.department)) return true;

  // Compare skills
  const skillsA = a.skills || [];
  const skillsB = b.skills || [];
  if (skillsA.length !== skillsB.length) return true;
  for (let i = 0; i < skillsA.length; i++) {
    if (normString(skillsA[i]) !== normString(skillsB[i])) return true;
  }

  // Compare timeline
  const tlA = (a.timeline || []).filter(
    (t: any) => normString(t?.year) !== "" && normString(t?.position) !== "",
  );
  const tlB = (b.timeline || []).filter(
    (t: any) => normString(t?.year) !== "" && normString(t?.position) !== "",
  );
  if (tlA.length !== tlB.length) return true;
  for (let i = 0; i < tlA.length; i++) {
    if (normString(tlA[i]?.year) !== normString(tlB[i]?.year)) return true;
    if (normString(tlA[i]?.position) !== normString(tlB[i]?.position))
      return true;
    if (normString(tlA[i]?.chapter) !== normString(tlB[i]?.chapter))
      return true;
    if (normString(tlA[i]?.description) !== normString(tlB[i]?.description))
      return true;
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
  const cleanedSocialLinks = (body.social_links || []).filter(
    (sl: any) => sl.link && sl.link.trim() !== "",
  );
  const cleanedBody = {
    ...body,
    social_links: cleanedSocialLinks,
  };

  const result = profileSchema.safeParse(cleanedBody);

  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: result.error.format() },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db(getDbName());

  const queryId = ObjectId.isValid(session.user.id)
    ? new ObjectId(session.user.id)
    : session.user.id;
  const user = await db.collection("user").findOne({ _id: queryId as any });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Get existing profile by userId
  const currentProfile = await db
    .collection("profile")
    .findOne({ userId: session.user.id });

  const existingProfile: any = currentProfile || {};
  const mergedCurrentProfile = {
    ...existingProfile,
    department: user.department || existingProfile.department,
  };

  if (!hasProfileChanged(mergedCurrentProfile, result.data)) {
    return NextResponse.json({
      message: "No changes detected. Profile is already up-to-date.",
    });
  }

  // Update or Insert the profile document
  const { usn, year, batch, phoneNumber, department, ...profileSaveData } =
    result.data;

  const profileData = {
    ...profileSaveData,
    userId: session.user.id,
    updatedAt: new Date(),
  };

  await db
    .collection("profile")
    .updateOne(
      { userId: session.user.id },
      { $set: profileData },
      { upsert: true },
    );

  // Sync basic info to Better Auth user collection
  const userSyncFields: any = {
    name: result.data.name,
    image: result.data.image,
    updatedAt: new Date(),
  };
  if (result.data.department !== undefined) {
    userSyncFields.department = result.data.department;
  }

  await db
    .collection("user")
    .updateOne({ _id: queryId as any }, { $set: userSyncFields });

  return NextResponse.json({ message: "Profile updated successfully" });
}
