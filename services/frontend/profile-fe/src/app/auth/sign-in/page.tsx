"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ScanlineOverlay } from "@/components/layout/Common";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const signIn = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identifier.trim(),
          password,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const errorData = await response.json();
        toast({
          title: "Connection Failed",
          description: errorData.message || "Invalid identifier or password",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Sign in failed:", err);
      toast({
        title: "Connection Failed",
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
        <h1 className="font-vt text-4xl text-[#00ff9d] mb-6 text-center uppercase tracking-widest">System Access: Log In</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">identifier (email / membership id)</label>
            <input
              type="text"
              placeholder="Enter email, username, or membership id"
              className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-4 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)]">password</label>
              <Link
                href="/auth/forgot-password"
                className="text-xs uppercase tracking-wider text-[#ff4fd8] hover:text-[#ffb700] hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded pl-4 pr-10 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            onClick={signIn}
            disabled={loading}
            className="w-full bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] text-[#00ff9d] py-3 rounded uppercase tracking-widest hover:bg-[rgba(0,255,157,0.2)] transition-all disabled:opacity-50 mt-4 font-bold"
          >
            {loading ? "Authenticating..." : "Establish Connection"}
          </button>

          <div className="text-center mt-6 text-[11px] text-[rgba(200,255,232,0.45)] uppercase tracking-wider">
            Contact admin if you don't have an account
          </div>
        </div>
      </div>
    </div>
  );
}

