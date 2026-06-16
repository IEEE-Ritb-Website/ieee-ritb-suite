"use client";

import { Users } from "lucide-react";
import { ProfileSimilar } from "@/components/ProfileSimilar";
import { ChapterCard } from "@/components/ChapterCard";

interface ChapterEntry {
  acronym: string;
  position: string;
}

interface RightPanelProps {
  username: string;
  chapters?: ChapterEntry[];
}

const safeChapters = (chapters: unknown): ChapterEntry[] => {
  if (typeof chapters === "string") {
    try {
      return JSON.parse(chapters);
    } catch {
      return [];
    }
  }
  if (Array.isArray(chapters)) {
    return chapters.map((ch) => {
      if (typeof ch === "string") return { acronym: ch, position: "Execom" };
      if (ch && typeof ch === "object" && "acronym" in ch)
        return { acronym: ch.acronym || "", position: ch.position || "Execom" };
      return { acronym: "", position: "Execom" };
    }).filter((ch) => ch.acronym);
  }
  return [];
};

export const RightPanel = ({ username, chapters }: RightPanelProps) => {
  const entries = safeChapters(chapters);

  return (
    <aside className="w-full md:w-auto border-t md:border-t-0 md:border-l border-[rgba(0,255,157,0.25)] flex flex-col gap-4"
      style={{ overflowY: "auto", overflowX: "visible" }}
    >
      {entries.length > 0 && (
        <div className="flex flex-col gap-3 px-3 pt-4">
          {entries.map((ch, i) => (
            <ChapterCard
              key={ch.acronym}
              acronym={ch.acronym}
              position={ch.position}
              index={i}
            />
          ))}
        </div>
      )}

      <div className="px-3 pb-4">
        <div className="text-sm tracking-[0.15em] text-[rgba(200,255,232,0.45)] uppercase border-b border-[rgba(0,255,157,0.1)] pb-1 flex items-center gap-2 mb-2.5">
          <Users size={14} />
          Similar Profiles
        </div>

        <ProfileSimilar username={username} />
      </div>
    </aside>
  );
};
