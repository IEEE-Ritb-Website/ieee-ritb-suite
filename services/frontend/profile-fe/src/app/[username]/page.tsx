import clientPromise, { getDbName } from "@/lib/db";
import { ScanlineOverlay, HeaderBar } from "@/components/layout/Common";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileView } from "@/components/views/ProfileView";
import { notFound } from "next/navigation";

export default async function PublicProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const username = params.username;

  const client = await clientPromise;
  const db = client.db(getDbName());

  // Find authoritative system user record first
  const user = await db.collection("user").findOne({ username });
  if (!user) {
    notFound();
  }

  let profileDoc = await db.collection("profile").findOne({ username });

  if (!profileDoc) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-mono flex items-center justify-center">
        <ScanlineOverlay />
        <div className="text-center">
          <h1 className="text-[#00ff9d] text-4xl mb-4 uppercase shadow-[0_0_20px_rgba(0,255,157,0.3)]">Profile Encrypted</h1>
          <p className="opacity-50">Detailed system profile for @{username} has not been initialized.</p>
        </div>
      </div>
    );
  }

  const safeParseJson = (val: any) => {
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch (e) { return []; }
    }
    return Array.isArray(val) ? val : [];
  };

  // Serialize and merge up-to-date authoritative user fields
  // Hiding email, USN, and Phone Number from public payload
  const profile = {
    ...JSON.parse(JSON.stringify(profileDoc)),
    name: user.name || profileDoc.name,
    username: user.username || profileDoc.username,
    membershipId: user.membershipId,
    department: user.department,
    year: user.year,
    batch: user.batch,
    chapters: safeParseJson(user.chapters || profileDoc.chapters),
    positions: safeParseJson(user.positions || profileDoc.positions),
    skills: safeParseJson(user.skills || profileDoc.skills),
    social_links: safeParseJson(profileDoc.social_links),
    achievements: safeParseJson(profileDoc.achievements),
    projects: safeParseJson(profileDoc.projects),
    stats: profileDoc.stats || {},
    email: undefined,
    usn: undefined,
    phoneNumber: undefined,
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-['Share_Tech_Mono',_monospace] relative overflow-x-hidden">
      <ScanlineOverlay />
      <HeaderBar />

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-40px)]">
        <Sidebar user={profile as any} isPublic={true} />

        <main className="flex-1 p-6 flex flex-col gap-6 max-w-5xl relative z-10 pb-20">
          <ProfileView data={profile} />
        </main>
      </div>
    </div>
  );
}
