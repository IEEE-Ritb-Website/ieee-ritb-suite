"use client";

import React from "react";
import { useToast } from "./use-toast";

export const Toaster = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto z-[99999] flex flex-col gap-3 w-full md:max-w-sm px-4 pb-4 md:px-0 md:pb-0 pointer-events-none font-['Share_Tech_Mono',_monospace]">
      {toasts.map((t) => {
        const isDestructive = t.variant === "destructive";
        const isSuccess = t.variant === "success";

        let borderColor = "border-[rgba(0,255,157,0.25)]";
        let titleColor = "text-[#00ff9d]";
        let shadowColor = "shadow-[0_0_20px_rgba(0,255,157,0.1)]";
        let prefix = "// SYSTEM ALERT:";

        if (isDestructive) {
          borderColor = "border-[rgba(255,79,216,0.45)]";
          titleColor = "text-[#ff4fd8]";
          shadowColor = "shadow-[0_0_20px_rgba(255,79,216,0.15)]";
          prefix = "// CRITICAL ERROR:";
        } else if (isSuccess) {
          borderColor = "border-[rgba(0,255,157,0.5)]";
          titleColor = "text-[#00ff9d]";
          shadowColor = "shadow-[0_0_20px_rgba(0,255,157,0.15)]";
          prefix = "// OPERATION SUCCESS:";
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto relative overflow-hidden bg-[#0d0d1a] border ${borderColor} ${shadowColor} p-4 rounded-[4px] flex justify-between items-start gap-4 transition-all duration-300 animate-in slide-in-from-right-10 fade-in duration-200`}
            style={{
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Retro Scanline Overlay inside each Toast */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />

            <div className="relative z-10 flex-1">
              {/* <div className="text-[9px] uppercase tracking-widest text-[rgba(200,255,232,0.45)] mb-1">
                {prefix}
              </div> */}
              <div className={`font-vt text-lg font-bold uppercase tracking-wider ${titleColor} leading-tight`}>
                {t.title}
              </div>
              {t.description && (
                <div className="text-[11px] text-[rgba(200,255,232,0.65)] leading-relaxed mt-1 tracking-[0.02em]">
                  {t.description}
                </div>
              )}
            </div>

            <button
              onClick={() => dismiss(t.id)}
              className="relative z-10 text-[rgba(200,255,232,0.4)] hover:text-[#ffb700] transition-colors text-xs font-bold uppercase cursor-pointer"
            >
              [X]
            </button>
          </div>
        );
      })}
    </div>
  );
};
export default Toaster;
