"use client";

import { useState } from "react";
import { ScanlineOverlay } from "@/components/layout/Common";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleRequestReset = async () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      toast({
        title: "Validation Error",
        description: "Please enter your email, membership ID, or username.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          redirectTo: "/auth/reset-password",
        }),
      });

      if (res.status === 429) {
        toast({
          title: "Access Suspended",
          description:
            "You have made too many authentication attempts. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast({
          title: "Transmission Failed",
          description:
            (data as { message?: string }).message ||
            "Could not process recovery telemetry.",
          variant: "destructive",
        });
        return;
      }

      setSuccess(true);
      toast({
        title: "Recovery Sent",
        description: "System recovery packet dispatched to your mailbox.",
        variant: "success",
      });
    } catch (err: unknown) {
      console.error("Forgot password failed:", err);
      toast({
        title: "Transmission Failed",
        description: "A system communication timeout occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-['Share_Tech_Mono',_monospace] flex items-center justify-center p-6 relative">
      <ScanlineOverlay />
      <div className="w-full max-w-md border border-[rgba(0,255,157,0.25)] bg-[rgba(0,255,157,0.02)] p-8 rounded-lg relative z-10">
        <h1 className="font-vt text-4xl text-[#00ff9d] mb-6 text-center uppercase tracking-widest">
          System Recovery: Access
        </h1>

        {success ? (
          <div className="space-y-6 text-center">
            <div className="border border-[rgba(0,255,157,0.4)] bg-[rgba(0,255,157,0.05)] p-4 rounded text-xs uppercase tracking-wider text-[#00ff9d]">
              Recovery Packet Dispatched
            </div>
            <p className="text-sm leading-relaxed text-[rgba(200,255,232,0.7)]">
              If an account matching{" "}
              <span className="text-[#00ff9d] font-bold">
                {identifier.trim()}
              </span>{" "}
              exists, a recovery link has been dispatched to its registered
              mailbox. Click the link within 1 hour to establish your new system
              password.
            </p>
            <div className="pt-4 border-t border-[rgba(0,255,157,0.1)]">
              <Link
                href="/auth/sign-in"
                className="text-xs uppercase tracking-widest text-[#ff4fd8] hover:underline"
              >
                &larr; Return to Authentication
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1"
              >
                Identifier
              </label>
              <input
                id="identifier"
                type="text"
                placeholder="Enter email or membership id or username"
                className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-4 py-2 text-[#c8ffe8] placeholder-[rgba(200,255,232,0.2)] outline-none focus:border-[#00ff9d] transition-colors"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRequestReset()}
              />
              <p className="mt-1.5 text-[10px] text-[rgba(200,255,232,0.3)] leading-relaxed">
                Enter any of: registered email address, IEEE membership ID, or
                your profile username.
              </p>
            </div>

            <button
              id="request-reset-btn"
              onClick={handleRequestReset}
              disabled={loading}
              className="w-full bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] text-[#00ff9d] py-3 rounded uppercase tracking-widest hover:bg-[rgba(0,255,157,0.2)] transition-all disabled:opacity-50 mt-4 font-bold"
            >
              {loading ? "Transmitting..." : "Request Access Recovery"}
            </button>

            <div className="pt-4 border-t border-[rgba(0,255,157,0.1)] text-center">
              <Link
                href="/auth/sign-in"
                className="text-xs uppercase tracking-widest text-[rgba(200,255,232,0.6)] hover:text-[#00ff9d] transition-colors"
              >
                &larr; Return to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
