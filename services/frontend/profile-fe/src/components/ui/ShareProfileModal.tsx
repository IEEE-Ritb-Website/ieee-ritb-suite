"use client";

import { useState, useCallback, useMemo } from "react";
import { Modal } from "./index";
import { Check, Copy } from "lucide-react";
import { useToast } from "./use-toast";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  name: string;
}

type Platform = {
  name: string;
  icon: React.ReactNode;
  shareUrl: string;
  copyOnly?: boolean;
};

export const ShareProfileModal = ({
  isOpen,
  onClose,
  username,
  name,
}: ShareProfileModalProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `/${username}`;

  const shareText = useMemo(
    () => `Check out my IEEE RIT-B profile: ${name}\n${profileUrl}`,
    [name, profileUrl]
  );

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Profile link copied to clipboard.",
        variant: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  }, [profileUrl, toast]);

  const handleShare = useCallback(
    (platform: Platform) => {
      if (platform.copyOnly) {
        navigator.clipboard.writeText(profileUrl).then(() => {
          toast({
            title: "Link Copied",
            description: "Profile link copied. Share it on Instagram!",
            variant: "success",
          });
        });
        return;
      }
      window.open(platform.shareUrl, "_blank");
    },
    [profileUrl, toast]
  );

  const platforms: Platform[] = [
    {
      name: "WhatsApp",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.102-1.016-1.846-2.266-2.062-2.652-.215-.386-.023-.595.163-.788.168-.173.374-.45.562-.675.187-.225.249-.386.374-.644.125-.258.062-.483-.031-.675-.093-.192-.67-1.617-.92-2.214-.246-.596-.498-.597-.673-.6-.184-.003-.386-.004-.588-.004s-.54.079-.823.297c-.283.217-1.079 1.054-1.079 2.57 0 1.516 1.104 2.983 1.258 3.188.154.206 2.17 3.32 5.257 4.65.734.318 1.307.508 1.754.65.738.235 1.41.2 1.94.12.607-.09 1.873-.764 2.136-1.5.263-.735.263-1.365.194-1.5-.07-.135-.257-.217-.554-.367zM12 2C6.477 2 2 6.477 2 12c0 1.89.526 3.662 1.44 5.186L2.04 22l4.86-1.416A9.975 9.975 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.89 0-3.662-.526-5.186-1.44l-.372-.224-2.883.84.84-2.884-.224-.372A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
        </svg>
      ),
      shareUrl: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
      shareUrl: "",
      copyOnly: true,
    },
    {
      name: "LinkedIn",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    },
    {
      name: "X",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Profile">
      <div className="space-y-6">
        <div className="flex items-center gap-2 border border-[rgba(0,255,157,0.25)] rounded-[2px] bg-[rgba(0,255,157,0.03)]">
          <input
            type="text"
            readOnly
            value={profileUrl}
            className="flex-1 bg-transparent text-[#c8ffe8] text-xs font-mono px-3 py-2.5 outline-none tracking-wider"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2.5 border-l border-[rgba(0,255,157,0.25)] text-[#00ff9d] hover:bg-[rgba(0,255,157,0.1)] transition-all cursor-pointer uppercase text-xs tracking-widest"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div>
          <div className="text-xs tracking-[0.15em] text-[rgba(200,255,232,0.45)] uppercase border-b border-[rgba(0,255,157,0.1)] pb-1.5 mb-3">
            Share on Social Media
          </div>
          <div className="grid grid-cols-5 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform)}
                className="flex flex-col items-center justify-between gap-1.5 p-3 border border-[rgba(0,255,157,0.2)] rounded-[3px] bg-[rgba(0,255,157,0.02)] hover:bg-[rgba(0,255,157,0.08)] hover:border-[#00ff9d] transition-all cursor-pointer group"
                title={`Share on ${platform.name}`}
              >
                <span className="text-[rgba(200,255,232,0.6)] group-hover:text-[#00ff9d] transition-colors">
                  {platform.icon}
                </span>
                <span className="text-[10px] text-[rgba(200,255,232,0.35)] group-hover:text-[rgba(200,255,232,0.6)] tracking-wider transition-colors">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
