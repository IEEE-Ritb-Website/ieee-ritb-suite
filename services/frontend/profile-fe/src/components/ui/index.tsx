import React from 'react';

export * from "./button";
export * from "./input";
export * from "./label";
export * from "./select";
export * from "./dialog";
export * from "./card";
export * from "./dropdown-menu";
export * from "./drawer";
export * from "./textarea";
export * from "./sonner";

export const StatBox = ({ num, label }: { num: string, label: string }) => (
  <div className="bg-[rgba(0,255,157,0.03)] border border-[rgba(0,255,157,0.25)] rounded-[3px] p-2.5 text-center">
    <div className="font-vt text-[26px] text-[#00ff9d] leading-none">{num}</div>
    <div className="text-[9px] text-[rgba(200,255,232,0.45)] tracking-[0.1em] mt-0.5 uppercase">{label}</div>
  </div>
);

export const SectionBlock = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <section className="border border-[rgba(0,255,157,0.25)] rounded-[4px] p-3.5 relative bg-[rgba(0,255,157,0.015)]">
    <div className="text-[9px] tracking-[0.18em] text-[rgba(200,255,232,0.45)] uppercase mb-2.5 flex items-center gap-2">
      {title} <span className="flex-1 h-[1px] bg-[rgba(0,255,157,0.25)]" />
    </div>
    {children}
  </section>
);

export const SkillTag = ({ label, color }: { label: string, color: 'blue' | 'green' | 'amber' | 'pink' }) => {
  const styles = {
    blue: "border-[rgba(0,207,255,0.3)] text-[#00cfff] bg-[rgba(0,207,255,0.05)]",
    green: "border-[rgba(0,255,157,0.3)] text-[#00ff9d] bg-[rgba(0,255,157,0.05)]",
    amber: "border-[rgba(255,183,0,0.3)] text-[#ffb700] bg-[rgba(255,183,0,0.05)]",
    pink: "border-[rgba(255,79,216,0.3)] text-[#ff4fd8] bg-[rgba(255,79,216,0.05)]"
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-[2px] tracking-[0.06em] border ${styles[color]}`}>
      {label}
    </span>
  );
};

export const TimelineItem = ({ year, title, subtitle, badge, badgeColor }: { year: string, title: string, subtitle: string, badge?: string, badgeColor?: 'amber' | 'blue' }) => {
  const badgeStyles = {
    amber: "border-[rgba(255,183,0,0.35)] text-[#ffb700] bg-[rgba(255,183,0,0.06)]",
    blue: "border-[rgba(0,207,255,0.35)] text-[#00cfff] bg-[rgba(0,207,255,0.06)]"
  };

  return (
    <div className="grid grid-cols-[70px_1fr] gap-3 mb-3 text-[11px]">
      <div className="text-[#00ff9d] pt-0.5 tracking-[0.05em] text-[10px]">{year}</div>
      <div className="border-l border-[rgba(0,255,157,0.25)] pl-3 pb-2">
        <div className="text-[#c8ffe8] text-[12px] mb-0.5 flex items-center flex-wrap gap-2">
          {title}
          {badge && badgeColor && (
            <span className={`text-[9px] px-1.5 py-[1px] rounded-[2px] border ${badgeStyles[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="text-[rgba(200,255,232,0.45)] text-[10px] leading-relaxed">{subtitle}</div>
      </div>
    </div>
  );
};

export const Badge = ({ label, color }: { label: string, color: 'amber' | 'green' | 'blue' | 'pink' }) => {
  const styles = {
    amber: "border-[rgba(255,183,0,0.35)] text-[#ffb700] bg-[rgba(255,183,0,0.06)]",
    green: "border-[rgba(0,255,157,0.35)] text-[#00ff9d] bg-[rgba(0,255,157,0.06)]",
    blue: "border-[rgba(0,207,255,0.35)] text-[#00cfff] bg-[rgba(0,207,255,0.06)]",
    pink: "border-[rgba(255,79,216,0.35)] text-[#ff4fd8] bg-[rgba(255,79,216,0.06)]"
  };
  return (
    <span className={`flex items-center gap-1.5 p-1 px-2.5 rounded-[2px] text-[10px] tracking-[0.05em] border ${styles[color]}`}>
      {label}
    </span>
  );
};

export const OpenTag = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1.5 p-1 px-3 border border-dashed border-[rgba(0,255,157,0.35)] rounded-[2px] text-[10px] text-[#00ff9d] tracking-[0.05em]">
    <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse-dot" />
    {label}
  </div>
);

export const ChapterChip = ({ color, title, subtitle }: { color: 'amber' | 'blue' | 'pink', title: string, subtitle: string }) => {
  const styles = {
    amber: "border-[rgba(255,183,0,0.35)] bg-[rgba(255,183,0,0.06)] text-[#ffb700]",
    blue: "border-[rgba(0,207,255,0.35)] bg-[rgba(0,207,255,0.06)] text-[#00cfff]",
    pink: "border-[rgba(255,79,216,0.35)] bg-[rgba(255,79,216,0.06)] text-[#ff4fd8]"
  };
  const dotColors = {
    amber: "bg-[#ffb700]",
    blue: "bg-[#00cfff]",
    pink: "bg-[#ff4fd8]"
  };

  return (
    <div className={`flex items-center gap-2 p-1.5 px-2.5 rounded-[3px] border text-[10px] tracking-[0.05em] cursor-default transition-colors hover:bg-opacity-10 ${styles[color]}`}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[color]}`} />
      <div className="overflow-hidden">
        <div className="text-[10px] font-bold truncate">{title}</div>
        <div className="text-[9px] opacity-70 truncate">{subtitle}</div>
      </div>
    </div>
  );
};

export const LinkItem = ({ label, icon, href = "#" }: { label: string, icon: React.ReactNode, href?: string }) => (
  <a href={href} className="flex items-center gap-2 text-[11px] text-[rgba(200,255,232,0.45)] no-underline py-1 border-b border-[rgba(0,255,157,0.07)] transition-colors hover:text-[#00ff9d] w-full">
    <span className="w-3.5 h-3.5 opacity-60 flex-shrink-0">{icon}</span>
    <span className="truncate">{label}</span>
  </a>
);

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d0d1a]/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0d0d1a] border border-[#00ff9d] rounded-[4px] shadow-[0_0_50px_rgba(0,255,157,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
        
        <div className="flex justify-between items-center px-4 py-3 border-b border-[rgba(0,255,157,0.25)] bg-[rgba(0,255,157,0.05)] relative z-10">
          <h3 className="font-vt text-xl text-[#00ff9d] uppercase tracking-widest">{title}</h3>
          <button onClick={onClose} className="text-[#ff4fd8] hover:text-[#ffb700] transition-colors font-bold uppercase text-xs">Close [X]</button>
        </div>
        
        <div className="p-6 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
