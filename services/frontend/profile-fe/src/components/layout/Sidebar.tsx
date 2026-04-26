"use client";

import React from 'react';
import { AvatarFrame } from './Common';
import { ChapterChip, LinkItem } from '../ui';
import { ExternalIcon } from '../icons';
import { Chapters } from "@astranova/catalogues";

interface SidebarProps {
  user: {
    name: string;
    username: string;
    image?: string;
    batch?: string;
    year?: string;
    chapters?: any[];
    social_links?: { label: string; link: string }[];
  };
  isEditMode?: boolean;
  openModal?: () => void;
}

export const Sidebar = ({ user, isEditMode, openModal }: SidebarProps) => {
  const userChapters = (user.chapters || []).map(ch => {
    const acronym = typeof ch === 'string' ? ch : ch.acronym;
    return Chapters.find(c => c.acronym === acronym);
  }).filter(Boolean);

  return (
    <aside className="w-full md:w-[240px] border-b md:border-b-0 md:border-r border-[rgba(0,255,157,0.25)] p-6 flex flex-col gap-6 relative">
      <div className="relative group">
        <div className="relative">
           {user.image ? (
             <div className="relative w-full aspect-square border-[1.5px] border-[#00ff9d] rounded-[4px] overflow-hidden bg-[rgba(0,255,157,0.02)]">
                <img src={user.image} alt={user.name} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[length:16px_16px] pointer-events-none" />
                <div className="absolute w-full h-[3px] bg-[rgba(0,255,157,0.2)] animate-scan z-10 pointer-events-none" />
             </div>
           ) : (
             <AvatarFrame initials={user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "??"} />
           )}
        </div>
        
        {isEditMode && (
          <div className="mt-2">
            <button 
                onClick={openModal} 
                className="w-full text-[9px] uppercase tracking-widest border border-[#00ff9d] py-1 bg-[rgba(0,255,157,0.05)] hover:bg-[rgba(0,255,157,0.15)] transition-all text-[#00ff9d]"
            >
                Upload Image
            </button>
          </div>
        )}
      </div>

      <div>
        <h1 className="font-vt text-[28px] text-[#00ff9d] tracking-[1px] leading-tight m-0 uppercase">{user.name || "UNNAMED"}</h1>
        <div className="text-[11px] text-[rgba(200,255,232,0.45)] tracking-[0.1em]">@{user.username || "unknown"}</div>
        <div className="inline-block bg-[rgba(0,255,157,0.08)] border border-[rgba(0,255,157,0.3)] text-[#00ff9d] text-[10px] px-2 py-0.5 rounded-[2px] tracking-[0.08em] mt-1.5 uppercase">
          {user.batch || "BATCH OF ??"} | {user.year || "YEAR ??"}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[9px] tracking-[0.15em] text-[rgba(200,255,232,0.45)] uppercase border-b border-[rgba(0,255,157,0.1)] pb-1">{`// chapters`}</div>
        {userChapters.length > 0 ? userChapters.map((ch: any, i) => (
          <ChapterChip 
            key={`${ch.acronym}-${i}`} 
            color={ch.type === "tech" ? "blue" : "pink"} 
            title={ch.acronym} 
            subtitle={ch.name} 
          />
        )) : (
          <div className="text-[10px] opacity-50 italic uppercase">No affiliations detected</div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[9px] tracking-[0.15em] text-[rgba(200,255,232,0.45)] uppercase border-b border-[rgba(0,255,157,0.1)] pb-1 mb-1">{`// links`}</div>
        {(user.social_links || []).map((link, i) => (
          <LinkItem key={i} label={link.label} icon={<ExternalIcon />} href={link.link} />
        ))}
        {(!user.social_links || user.social_links.length === 0) && (
           <div className="text-[10px] opacity-50 italic uppercase">No links established</div>
        )}
      </div>
    </aside>
  );
};
