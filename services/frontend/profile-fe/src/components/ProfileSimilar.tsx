"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SimilarProfile {
  name: string;
  username: string;
  image: string;
  department: string;
  batchOf: string;
  year: string;
  chapters: string[];
  skills: string[];
}

interface ScoredProfile {
  score: number;
  profile: SimilarProfile;
}

export const ProfileSimilar = ({ username }: { username: string }) => {
  const [profiles, setProfiles] = useState<ScoredProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile/similar?username=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data.similar || []);
      })
      .catch(() => {
        setProfiles([]);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[rgba(0,255,157,0.08)]" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 w-16 bg-[rgba(0,255,157,0.08)] rounded" />
                <div className="h-2 w-10 bg-[rgba(0,255,157,0.05)] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-sm text-[rgba(200,255,232,0.3)] uppercase tracking-wider py-4 text-center">
        No similar profiles found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {profiles.map(({ profile }) => (
        <Link
          key={profile.username}
          href={`/${profile.username}`}
          className="group p-2 rounded-lg border border-transparent hover:border-[rgba(0,255,157,0.2)] hover:bg-[rgba(0,255,157,0.03)] transition-all no-underline"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[rgba(0,255,157,0.2)] flex-shrink-0 bg-[rgba(0,255,157,0.05)]">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#00ff9d] font-bold uppercase font-vt">
                  {profile.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2) || "??"}
                </div>
              )}
            </div>
            <div className="flex flex-col w-full">
              <div className="text-sm text-[#c8ffe8] font-medium truncate group-hover:text-[#00ff9d] transition-colors leading-tight">
                {profile.name}
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                {profile.department && (
                  <div className="text-xs text-[rgba(200,255,232,0.45)] group-hover:text-[#fff] transition-colors truncate mt-0.5">
                    {profile.department}
                  </div>
                )}
                <div className="flex items-center gap-1 flex-wrap">
                  {profile.chapters.slice(0, 2).map((ch) => (
                    <span
                      key={ch}
                      className="text-xs px-1 py-[1px] rounded-[2px] border border-[rgba(0,255,157,0.2)] text-[rgba(0,255,157,0.5)] uppercase tracking-wider"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
