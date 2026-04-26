import React from "react";
import clientPromise, { getDbName } from "@/lib/db";
import { ScanlineOverlay, HeaderBar } from "@/components/layout/Common";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  StatBox, 
  SectionBlock, 
  OpenTag,
  Badge
} from "@/components/ui";
import { notFound } from "next/navigation";
import { Chapters } from "@astranova/catalogues";

export default async function PublicProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const username = params.username;
  
  const client = await clientPromise;
  const db = client.db(getDbName());
  const profileDoc = await db.collection("profile").findOne({ username });

  if (!profileDoc) {
    const user = await db.collection("user").findOne({ username });
    if (!user) {
        notFound();
    }
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

  // Serialize MongoDB document
  const profile = JSON.parse(JSON.stringify(profileDoc));

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-['Share_Tech_Mono',_monospace] relative overflow-x-hidden">
      <ScanlineOverlay />
      <HeaderBar />

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-40px)]">
        <Sidebar user={profile as any} />

        <main className="flex-1 p-6 flex flex-col gap-6 max-w-5xl relative z-10 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(profile.stats || {}).map(([key, val]) => (
                <StatBox key={key} num={val as string} label={key} />
            ))}
          </div>

          <SectionBlock title="SYSTEM IDENTIFICATION">
            <div className="font-vt text-3xl text-[#00ff9d] leading-tight mb-2 uppercase">
              {profile.current_status || "Biometric signal active. Status unknown."}
            </div>
            <div className="text-[12px] text-[rgba(200,255,232,0.45)] leading-[1.7] mt-2.5">
              {profile.bio || "No biography data available in system records."}
            </div>
          </SectionBlock>

          <SectionBlock title="HONORS & ACHIEVEMENTS">
            <div className="flex flex-wrap gap-2">
              {(profile.achievements || []).map((ach: any, idx: number) => (
                <Badge key={idx} label={ach.title} color={
                  ach.badge_type === 'hackathon' ? 'amber' :
                  ach.badge_type === 'gsoc' ? 'green' :
                  ach.badge_type === 'open_source' ? 'pink' :
                  ach.badge_type === 'certification' ? 'blue' : 'amber'
                } />
              ))}
            </div>
          </SectionBlock>

          <SectionBlock title="ACTIVE PROJECTS">
            <div className="space-y-4">
                {(profile.projects || []).map((project: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-[rgba(0,255,157,0.2)] pl-4 py-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-[#00ff9d] font-bold uppercase">{project.title}</h3>
                            {project.link && <a href={project.link} target="_blank" className="text-[9px] border border-[#00ff9d] px-2 py-0.5 hover:bg-[#00ff9d] hover:text-[#0d0d1a]">ACCESS SOURCE</a>}
                        </div>
                        <p className="text-[11px] text-[rgba(200,255,232,0.6)] mt-1">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(project.tags || []).map((tag: string) => (
                                <span key={tag} className="text-[9px] text-[#00ff9d] opacity-50">#{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </SectionBlock>

          <SectionBlock title="STATUS">
            <div className="flex flex-wrap gap-2">
              <OpenTag label="Available for Collaboration" />
            </div>
          </SectionBlock>
        </main>
      </div>
    </div>
  );
}
