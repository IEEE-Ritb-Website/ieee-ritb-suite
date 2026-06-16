"use client";

import Link from "next/link";
import { useState } from "react";
import { OrganizationStructure } from "@astranova/catalogues";
import { ChapterIcon } from "@/components/ChapterIcon";

interface ChapterCardProps {
  acronym: string;
  position: string;
  index: number;
}

const allChapters = OrganizationStructure;

export const ChapterCard = ({ acronym, position, index }: ChapterCardProps) => {
  const [hovered, setHovered] = useState(false);
  const chapter = allChapters.find((c) => c.acronym === acronym);
  if (!chapter) return null;

  const isEven = index % 2 === 0;
  const tilt = isEven ? 1.5 : -1.5;
  const shiftX = isEven ? 6 : -6;
  const color = chapter.color;
  const href = `https://ieee.ritb.in/chapters/${chapter.acronym.toLowerCase()}`;

  return (
    <Link
      href={href}
      target="_blank"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col gap-3 p-3 border border-[rgba(255,255,255,0.08)] rounded-[12px] bg-[rgba(255,255,255,0.02)] min-h-[160px] transition-all duration-300 hover:border-transparent overflow-hidden no-underline"
      style={{
        transform: hovered
          ? `translateX(${shiftX}px) rotate(${tilt}deg) translateY(-4px) scale(1.02)`
          : undefined,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <div
        className="absolute inset-[-50%] opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}30, transparent)`,
          filter: "blur(40px)",
        }}
      />

      <div
        className="relative w-[52px] h-[52px] flex items-center justify-center rounded-[12px] transition-all duration-300 group-hover:translate-y-[-2px] group-hover:scale-[1.12] group-hover:rotate-[3deg]"
        style={{
          color,
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1.5px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className="absolute inset-[-4px] rounded-[inherit] opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{ background: color, filter: "blur(12px)" }}
        />
        <ChapterIcon acronym={chapter.acronym} size={28} />
      </div>

      <div className="relative flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[rgba(200,255,232,0.9)] leading-tight m-0 flex-1">
          {chapter.name}
        </h3>
        <span
          className="relative text-[10px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-[4px] whitespace-nowrap transition-all duration-200 group-hover:translate-x-[2px]"
          style={{
            color,
            backgroundColor: `${color}15`,
          }}
        >
          {chapter.acronym}
        </span>
      </div>

      <p className="relative text-xs text-[rgba(200,255,232,0.45)] leading-relaxed m-0 flex-1 line-clamp-2">
        {chapter.shortDescription.slice(0, 60)}
        {chapter.shortDescription.length > 60 ? "..." : ""}
      </p>

      <div className="relative mt-auto">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[rgba(200,255,232,0.35)] transition-all duration-200 group-hover:text-[#00ff9d] group-hover:gap-2.5">
          Go to chapter page
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:translate-x-[2px]">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>

      <div
        className="absolute inset-0 border-2 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ borderColor: color }}
      />
    </Link>
  );
};
