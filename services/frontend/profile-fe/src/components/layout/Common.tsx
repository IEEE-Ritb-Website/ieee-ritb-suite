
export const HeaderBar = () => (
  <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[rgba(0,255,157,0.25)] px-5 py-2.5 text-xs tracking-[0.1em] text-[rgba(200,255,232,0.45)] gap-2 relative z-10">
    <div className="flex items-center gap-2">
      <div
        className="w-14 h-5 bg-[#00ff9d] opacity-80"
        style={{
          maskImage: "url('/ieee-logo-transparent.png')",
          WebkitMaskImage: "url('/ieee-logo-transparent.png')",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "left center",
          WebkitMaskPosition: "left center"
        }}
        aria-label="IEEE RITB Logo"
      />
      <span>IEEE RITB MEMBER PROFILE</span>
    </div>
    {/* <div className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        <span className="animate-blink text-[#00ff9d]">█</span> ONLINE
      </span>
    </div> */}
  </header>
);

export const ScanlineOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
);

export const AvatarFrame = ({ initials }: { initials: string }) => (
  <div className="relative w-full aspect-square border-[1.5px] border-[#00ff9d] rounded-[4px] bg-[rgba(0,255,157,0.04)] overflow-hidden flex items-center justify-center group">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.05)_1px,transparent_1px)] bg-[length:16px_16px]" />
    <div className="absolute w-full h-[3px] bg-[rgba(0,255,157,0.2)] animate-scan z-10" />

    <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#00ff9d]" />
    <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#00ff9d]" />
    <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#00ff9d]" />
    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#00ff9d]" />

    <span className="font-vt text-[52px] text-[#00ff9d] tracking-[2px] z-10">{initials}</span>
  </div>
);
