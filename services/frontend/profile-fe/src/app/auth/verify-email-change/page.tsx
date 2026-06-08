"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ScanlineOverlay } from "@/components/layout/Common";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface PendingChange {
  newEmail: string;
  currentEmail: string;
}

function VerifyEmailChangeForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const token = searchParams.get("token");

  const [pending, setPending] = useState<PendingChange | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchPending = useCallback(async () => {
    if (!token) {
      setLoadError("No verification token found in this link.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/auth/verify-email-change?token=${encodeURIComponent(token)}`,
      );
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setLoadError(
          data.message || "This verification link is invalid or has expired.",
        );
      } else {
        setPending({
          newEmail: data.newEmail,
          currentEmail: data.currentEmail,
        });
      }
    } catch {
      setLoadError("Failed to validate verification link.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast({
        title: "Password Required",
        description:
          "Please enter your current password to confirm the change.",
        variant: "destructive",
      });
      return;
    }

    setConfirming(true);
    try {
      const res = await fetch("/api/auth/verify-email-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Verification Failed",
          description:
            (data as { message?: string }).message ||
            "Could not complete the email change.",
          variant: "destructive",
        });
      } else {
        setSuccess(true);
        toast({
          title: "Email Updated",
          description:
            "Your email has been changed. Please sign in with your new address.",
          variant: "success",
        });
        setTimeout(() => router.push("/auth/sign-in"), 3000);
      }
    } catch {
      toast({
        title: "Connection Failure",
        description: "Request timed out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      {loading && (
        <p className="text-center text-xs uppercase tracking-widest text-[rgba(200,255,232,0.45)] animate-pulse">
          Validating token...
        </p>
      )}

      {!loading && loadError && (
        <div className="space-y-6 text-center">
          <div className="border border-[rgba(255,79,216,0.4)] bg-[rgba(255,79,216,0.05)] p-4 rounded text-xs uppercase tracking-wider text-[#ff4fd8]">
            Link Invalid or Expired
          </div>
          <p className="text-sm leading-relaxed text-[rgba(200,255,232,0.6)]">
            {loadError}
          </p>
          <Link
            href="/"
            className="inline-block text-xs uppercase tracking-widest text-[rgba(200,255,232,0.6)] hover:text-[#00ff9d] transition-colors"
          >
            &larr; Return to Profile
          </Link>
        </div>
      )}

      {!loading && !loadError && success && (
        <div className="space-y-6 text-center">
          <div className="border border-[rgba(0,255,157,0.4)] bg-[rgba(0,255,157,0.05)] p-4 rounded text-xs uppercase tracking-wider text-[#00ff9d]">
            Email Changed Successfully
          </div>
          <p className="text-sm leading-relaxed text-[rgba(200,255,232,0.7)]">
            Your account email has been updated to{" "}
            <span className="text-[#00ff9d] font-bold">
              {pending?.newEmail}
            </span>
            . Redirecting you to sign in...
          </p>
        </div>
      )}

      {!loading && !loadError && !success && pending && (
        <form onSubmit={handleConfirm} className="space-y-5">
          {/* Info banner */}
          <div className="border border-[rgba(0,255,157,0.2)] bg-[rgba(0,255,157,0.04)] rounded p-4 space-y-1 text-xs">
            <p className="text-[rgba(200,255,232,0.45)] uppercase tracking-wider">
              Current email
            </p>
            <p className="text-[#c8ffe8] font-mono">{pending.currentEmail}</p>
            <div className="pt-2 border-t border-[rgba(0,255,157,0.1)]">
              <p className="text-[rgba(200,255,232,0.45)] uppercase tracking-wider">
                New email
              </p>
              <p className="text-[#00ff9d] font-mono font-bold">
                {pending.newEmail}
              </p>
            </div>
          </div>

          <p className="text-xs text-[rgba(200,255,232,0.5)] leading-relaxed">
            Enter your current password to confirm this email change. You will
            be signed out and need to sign in again with your new address.
          </p>

          {/* Password field */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded pl-4 pr-10 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm(e)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(200,255,232,0.45)] hover:text-[#00ff9d] transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            id="confirm-email-change-btn"
            type="submit"
            disabled={confirming}
            className="w-full bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] text-[#00ff9d] py-3 rounded uppercase tracking-widest hover:bg-[rgba(0,255,157,0.2)] transition-all disabled:opacity-50 font-bold"
          >
            {confirming ? "Confirming..." : "Confirm Email Change"}
          </button>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs uppercase tracking-widest text-[rgba(200,255,232,0.4)] hover:text-[#00ff9d] transition-colors"
            >
              &larr; Cancel &amp; Return
            </Link>
          </div>
        </form>
      )}
    </>
  );
}

export default function VerifyEmailChange() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-['Share_Tech_Mono',_monospace] flex items-center justify-center p-6 relative">
      <ScanlineOverlay />
      <div className="w-full max-w-md border border-[rgba(0,255,157,0.25)] bg-[rgba(0,255,157,0.02)] p-8 rounded-lg relative z-10">
        <h1 className="font-vt text-4xl text-[#00ff9d] mb-6 text-center uppercase tracking-widest">
          Confirm Email Change
        </h1>
        <Suspense
          fallback={
            <p className="text-center text-xs uppercase tracking-widest text-[rgba(200,255,232,0.45)] animate-pulse">
              Initializing verification...
            </p>
          }
        >
          <VerifyEmailChangeForm />
        </Suspense>
      </div>
    </div>
  );
}
