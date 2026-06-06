import clientPromise, { getDbName } from "@/lib/db";
import { ScanlineOverlay, HeaderBar } from "@/components/layout/Common";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileView } from "@/components/views/ProfileView";
import { notFound } from "next/navigation";

export default async function PublicProfilePage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const username = params.username;

  const client = await clientPromise;
  const db = client.db(getDbName());

  // Find authoritative system user record first (since username is in user)
  const user = await db.collection("user").findOne({ username });
  if (!user) {
    notFound();
  }

  // Find corresponding profile record by userId
  let profileDoc = await db
    .collection("profile")
    .findOne({ userId: user._id.toString() });

  if (!profileDoc) {
    // Create minimal profile doc on the fly
    profileDoc = {
      _id: user._id,
      name: user.name,
      skills: [],
      social_links: [],
      stats: {},
      achievements: [],
      projects: [],
    };
  }

  const safeParseJson = (val: unknown) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return Array.isArray(val) ? val : [];
  };

  // Serialize and merge up-to-date authoritative user fields
  // Hiding email, USN, and Phone Number from public payload
  const profile = {
    ...JSON.parse(JSON.stringify(profileDoc)),
    name: user.name || profileDoc.name,
    username: user.username,
    image: user.image,
    membershipId: user.membershipId,
    department: user.department,
    year: user.year,
    batch: user.batch,
    batch_of: user.batch_of,
    term: user.term,
    chapters: safeParseJson(user.chapters),
    skills: safeParseJson(profileDoc.skills),
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
        <Sidebar
          user={profile as unknown as Parameters<typeof Sidebar>[0]["user"]}
          isPublic={true}
        />

        <main className="flex-1 p-6 flex flex-col gap-6 max-w-5xl relative z-10 pb-20">
          <ProfileView data={profile} />
        </main>
      </div>
    </div>
  );
}
