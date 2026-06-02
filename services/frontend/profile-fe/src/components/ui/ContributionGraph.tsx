"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Github } from "lucide-react";

interface DayData {
  date: string;
  count: number;
}

interface MergedContributionGraphProps {
  github?: string;
  leetcode?: string;
}

const EMPTY = "bg-[rgba(255,255,255,0.03)]";
const GREEN = ["bg-[#0e4429]", "bg-[#006d32]", "bg-[#26a641]", "bg-[#39d353]"];
const YELLOW = ["bg-[rgba(255,183,0,0.2)]", "bg-[rgba(255,183,0,0.4)]", "bg-[rgba(255,183,0,0.6)]", "bg-[#ffb700]"];
const ORANGE = ["bg-[rgba(255,120,0,0.25)]", "bg-[rgba(255,120,0,0.45)]", "bg-[rgba(255,120,0,0.65)]", "bg-[#ff7800]"];

function getIntensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
}

function generateLastYearDays(): { date: string; dow: number }[] {
  const today = new Date();
  const days: { date: string; dow: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({ date: dateStr, dow: d.getDay() });
  }
  return days;
}

export function ContributionGraph({ github, leetcode }: MergedContributionGraphProps) {
  const [ghData, setGhData] = useState<DayData[]>([]);
  const [lcData, setLcData] = useState<DayData[]>([]);
  const [ghTotal, setGhTotal] = useState(0);
  const [lcTotal, setLcTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetches: Promise<void>[] = [];

    if (github) {
      fetches.push(
        fetch(`https://github-contributions-api.deno.dev/${github}.json`)
          .then((res) => {
            if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
            return res.json();
          })
          .then((json) => {
            const days: DayData[] = (json.contributions || [])
              .flat()
              .map((c: any) => ({ date: c.date, count: c.contributionCount }));
            setGhData(days);
            setGhTotal(json.totalContributions ?? 0);
          })
      );
    }

    if (leetcode) {
      fetches.push(
        fetch(`/api/leetcode/${leetcode}`)
          .then((res) => {
            if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);
            return res.json();
          })
          .then((json) => {
            setLcData(json.days || []);
            setLcTotal(json.total ?? 0);
          })
      );
    }

    Promise.all(fetches)
      .then(() => setLoading(false))
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [github, leetcode]);

  const gridDays = useMemo(() => {
    const allDays = generateLastYearDays();
    const ghMap = new Map(ghData.map((d) => [d.date, d.count]));
    const lcMap = new Map(lcData.map((d) => [d.date, d.count]));
    return allDays.map((d) => ({
      date: d.date,
      dow: d.dow,
      gh: ghMap.get(d.date) ?? 0,
      lc: lcMap.get(d.date) ?? 0,
    }));
  }, [ghData, lcData]);

  const weeks: { date: string; gh: number; lc: number }[][] = [];
  let currentWeek: { date: string; gh: number; lc: number }[] = [];
  for (const day of gridDays) {
    currentWeek.push(day);
    if (day.dow === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  if (loading) {
    return (
      <div className="text-xs text-[rgba(200,255,232,0.4)] tracking-wider animate-pulse">
        loading contribution data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-[#ff4fd8] tracking-wider">
        failed to load contribution data
      </div>
    );
  }

  const getCellColor = (gh: number, lc: number): string => {
    const hasGh = gh > 0;
    const hasLc = lc > 0;
    if (!hasGh && !hasLc) return EMPTY;
    const idx = Math.max(getIntensity(gh), getIntensity(lc));
    if (hasGh && hasLc) return ORANGE[idx - 1];
    if (hasGh) return GREEN[idx - 1];
    return YELLOW[idx - 1];
  };

  const getCellTitle = (date: string, gh: number, lc: number): string => {
    const parts = [`${date}`];
    if (gh > 0) parts.push(`GitHub: ${gh}`);
    if (lc > 0) parts.push(`LeetCode: ${lc}`);
    if (gh === 0 && lc === 0) parts.push("no contributions");
    return parts.join(" · ");
  };

  const combinedTotal = ghTotal + lcTotal;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-[rgba(200,255,232,0.6)]">
        <Github size={13} className="text-[rgba(200,255,232,0.4)]" />
        <span className="tracking-wider">
          {[github, leetcode].filter(Boolean).join(" / ")}
        </span>
        <span className="text-[rgba(200,255,232,0.35)]">
          · {combinedTotal} contributions
        </span>
      </div>
      <div className="flex gap-[2px] overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={`w-[10px] h-[10px] rounded-[2px] ${getCellColor(day.gh, day.lc)}`}
                title={getCellTitle(day.date, day.gh, day.lc)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[9px] text-[rgba(200,255,232,0.3)] tracking-wider">
          {github && (
            <span className="flex items-center gap-1">
              <span className="w-[10px] h-[10px] rounded-[2px] bg-[#26a641]" />
              GitHub
            </span>
          )}
          {leetcode && (
            <span className="flex items-center gap-1">
              <span className="w-[10px] h-[10px] rounded-[2px] bg-[#ffb700]" />
              LeetCode
            </span>
          )}
          {github && leetcode && (
            <span className="flex items-center gap-1">
              <span className="w-[10px] h-[10px] rounded-[2px] bg-[#ff7800]" />
              Both
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-[rgba(200,255,232,0.3)] tracking-wider">
          <span>Less</span>
          <div className={`w-[10px] h-[10px] rounded-[2px] ${EMPTY}`} />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0e4429]" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-[#26a641]" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-[#39d353]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
