"use client";

import { useState } from 'react';
import { AvatarFrame } from './Common';
import { ChapterChip, LinkItem, Modal } from '../ui';
import { ExternalIcon } from '../icons';
import { Chapters as CatalogChapters } from "@astranova/catalogues";
import { useToast } from '../ui/use-toast';
import { Share2 } from 'lucide-react';


interface SidebarProps {
  user: {
    name: string;
    username: string;
    image?: string;
    batch_of?: string;
    batch?: string;
    year?: string;
    term?: string;
    chapters?: any[];
    social_links?: { label: string; link: string }[];
    department?: string;
  };
  isEditMode?: boolean;
  openModal?: () => void;
  isPublic?: boolean;
}

const Chapters = [
  ...CatalogChapters,
  {
    name: "Student Branch",
    acronym: "SB",
    type: null,
    color: "#ef4444",
    shortDescription: "The IEEE Student Branch (SB) is the foundational student community within our campus, serving as the central hub for coordination, student activities, leadership, and professional growth across all technical and non-technical societies."
  }
];


export const Sidebar = ({ user, isEditMode, openModal, isPublic = false }: SidebarProps) => {
  const { toast } = useToast();
  const [activeChapterDetails, setActiveChapterDetails] = useState<any>(null);

  const handleShare = () => {
    if (typeof window !== "undefined" && user.username) {
      const shareUrl = `${window.location.origin}/${user.username}`;
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "System registry link copied to clipboard.",
            variant: "success",
          });
        })
        .catch(() => {
          toast({
            title: "Transfer Failed",
            description: "Failed to write registry link to clipboard.",
            variant: "destructive",
          });
        });
    }
  };

  const safeParseChapters = (chVal: any) => {
    if (typeof chVal === "string") {
      try {
        return JSON.parse(chVal);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(chVal) ? chVal : [];
  };

  const userChapters = safeParseChapters(user.chapters).map((ch: any) => {
    const acronym = typeof ch === 'string' ? ch : ch?.acronym;
    const match = acronym ? Chapters.find(c => c.acronym === acronym) : null;
    if (!match) return null;
    return {
      ...match,
      position: typeof ch === 'string' ? 'Execom' : ch?.position || 'Execom'
    };
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
              className="w-full text-md cursor-pointer uppercase tracking-widest border border-[#00ff9d] py-1 bg-[rgba(0,255,157,0.05)] hover:bg-[rgba(0,255,157,0.15)] transition-all text-[#00ff9d]"
            >
              Upload Image
            </button>
          </div>
        )}

        <div className="mt-2">
          <button
            onClick={handleShare}
            className="w-full flex gap-2 items-center justify-center text-xs cursor-pointer uppercase tracking-widest border border-[#ff4fd8] py-1.5 bg-[rgba(255,79,216,0.05)] hover:bg-[rgba(255,79,216,0.15)] transition-all text-[#ff4fd8] rounded-[2px]"
          >
            <Share2 size={12} />
            <span>Share Profile</span>
          </button>
        </div>
      </div>

      <div>
        <h1 className="font-vt text-[28px] text-[#00ff9d] tracking-[1px] leading-tight m-0 uppercase">{user.name || "UNNAMED"}</h1>
        {/* <div className="text-[11px] text-[rgba(200,255,232,0.45)] tracking-[0.1em] uppercase">@{user.username || "unknown"}</div> */}
        {(() => {
          const termEndYear = user.term ? parseInt(user.term.slice(0, 2) + user.term.slice(-2)) : null;
          const isTermOver = termEndYear ? new Date().getFullYear() > termEndYear : false;
          return (
            <div className="inline-block bg-[rgba(0,255,157,0.08)] border border-[rgba(0,255,157,0.3)] text-[#00ff9d] text-sm px-2 py-0.5 rounded-[2px] tracking-[0.08em] mt-1.5 uppercase">
              {isTermOver ? `Term: ${user.term}` : `Year of Study: ${user.year || "N/A"}`}
            </div>
          );
        })()}
        <div className="flex pt-2 text-sm text-[rgba(200,255,232,0.65)] font-mono leading-relaxed">
          <span className="text-[rgba(200,255,232,0.35)]">BATCH OF: </span>
          <span className="text-[#00ff9d]">{user.batch_of || user.batch || "N/A"}</span>
        </div>
        {/* Official Registry Data (System-Locked) */}
        <div className="flex pt-2 text-sm text-[rgba(200,255,232,0.65)] font-mono leading-relaxed">
          <span className="text-[rgba(200,255,232,0.35)]">DEPT: </span>
          <span className="text-[#00ff9d]">{user.department || "N/A"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs tracking-[0.15em] text-[rgba(200,255,232,0.45)] uppercase border-b border-[rgba(0,255,157,0.1)] pb-1">Chapters</div>
        {userChapters.length > 0 ? userChapters.map((ch: any, i: number) => (
          <ChapterChip
            key={`${ch.acronym}-${i}`}
            color={ch.acronym === "SB" ? "red" : (ch.type === "tech" ? "blue" : "pink")}
            title={ch.acronym}
            subtitle={ch.position}
            onClick={() => setActiveChapterDetails(ch)}
          />
        )) : (
          <div className="text-xs opacity-50">No affiliations detected</div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-xs tracking-[0.15em] text-[rgba(200,255,232,0.45)] uppercase border-b border-[rgba(0,255,157,0.1)] pb-1 mb-1">Links</div>
        {(user.social_links || []).map((link, i) => (
          <LinkItem key={i} label={link.label} icon={<ExternalIcon />} href={link.link} />
        ))}
        {(!user.social_links || user.social_links.length === 0) && (
          <div className="text-xs opacity-50">No links added</div>
        )}
      </div>

      {activeChapterDetails && (
        <Modal
          isOpen={true}
          onClose={() => setActiveChapterDetails(null)}
          title={`${user.name.split(" ")[0]}'s Details`}
        >
          <div className="space-y-4 font-mono text-xs">
            <div>
              <h2 className="text-[#00ff9d] text-lg font-bold font-vt tracking-wide uppercase leading-tight">
                {activeChapterDetails.name}
              </h2>
            </div>
            {activeChapterDetails.type ?
              <div className="inline-block px-2 py-0.5 rounded-[2px] border border-[rgba(0,255,157,0.3)] bg-[rgba(0,255,157,0.06)] text-[#00ff9d] uppercase text-xs">
                {activeChapterDetails.type} society
              </div>
              : null}
            {activeChapterDetails.position && (
              <div>
                <div className="text-[#ff4fd8] uppercase font-bold text-[11px]">
                  {activeChapterDetails.position}
                </div>
              </div>
            )}
            <div className="border-t border-[rgba(0,255,157,0.15)] pt-3">
              <span className="text-[rgba(200,255,232,0.35)] uppercase tracking-wider block mb-1.5">overview</span>
              <p className="text-[rgba(200,255,232,0.7)] leading-relaxed text-[11px] uppercase">
                {activeChapterDetails.shortDescription || "No detailed telemetry description available in official logs."}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </aside>
  );
};

