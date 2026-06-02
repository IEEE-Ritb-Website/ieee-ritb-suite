"use client";

import React, { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { ScanlineOverlay } from "@/components/layout/Common";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();
  const { toast } = useToast();

  const handleResetPassword = async () => {
    if (!token) {
      toast({
        title: "Validation Error",
        description: "Missing password reset verification token.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Security Warning",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: newPassword,
        token: token,
      });

      if (error) {
        toast({
          title: "Telemetry Refused",
          description: error.message || "Failed to finalize new password.",
          variant: "destructive",
        });
      } else {
        setSuccess(true);
        toast({
          title: "Password Updated",
          description: "System registry updated. Redirecting to login...",
          variant: "success",
        });
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 3000);
      }
    } catch (err: any) {
      console.error("Reset password failed:", err);
      toast({
        title: "Transmission Failed",
        description: "A system communication timeout occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <div className="border border-[#ff4fd8]/40 bg-[rgba(255,79,216,0.05)] p-4 rounded text-xs uppercase tracking-wider text-[#ff4fd8] font-bold">
          Access Token Expired or Invalid
        </div>
        <p className="text-sm text-[rgba(200,255,232,0.65)] leading-relaxed">
          Please initiate a new password reset procedure. Token validation is mandatory.
        </p>
        <div className="pt-4">
          <Link
            href="/auth/forgot-password"
            className="text-xs uppercase tracking-widest text-[#00ff9d] hover:underline"
          >
            &rarr; Request New Token
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {success ? (
        <div className="space-y-4 text-center">
          <div className="border border-[rgba(0,255,157,0.4)] bg-[rgba(0,255,157,0.05)] p-4 rounded text-xs uppercase tracking-wider text-[#00ff9d]">
            Registry Updated Successfully
          </div>
          <p className="text-sm text-[rgba(200,255,232,0.65)]">
            Redirecting to main interface login portal...
          </p>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">
              new secure password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded pl-4 pr-10 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(200,255,232,0.45)] hover:text-[#00ff9d] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">
              confirm secure password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded pl-4 pr-10 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(200,255,232,0.45)] hover:text-[#00ff9d] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] text-[#00ff9d] py-3 rounded uppercase tracking-widest hover:bg-[rgba(0,255,157,0.2)] transition-all disabled:opacity-50 mt-4 font-bold"
          >
            {loading ? "Registering..." : "Finalize Password Update"}
          </button>
        </>
      )}
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-['Share_Tech_Mono',_monospace] flex items-center justify-center p-6 relative">
      <ScanlineOverlay />
      <div className="w-full max-w-md border border-[rgba(0,255,157,0.25)] bg-[rgba(0,255,157,0.02)] p-8 rounded-lg relative z-10">
        <h1 className="font-vt text-4xl text-[#00ff9d] mb-6 text-center uppercase tracking-widest">
          Reset System Password
        </h1>
        <Suspense
          fallback={
            <div className="text-center font-mono animate-pulse text-xs tracking-widest uppercase text-[#00ff9d]">
              Retrieving Access Tokens...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
