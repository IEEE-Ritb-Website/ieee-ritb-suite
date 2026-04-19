"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ScanlineOverlay } from "@/components/layout/Common";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signUp = async () => {
    setLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      username,
      callbackURL: "/",
    } as any);
    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-['Share_Tech_Mono',_monospace] flex items-center justify-center p-6 relative">
      <ScanlineOverlay />
      <div className="w-full max-w-md border border-[rgba(0,255,157,0.25)] bg-[rgba(0,255,157,0.02)] p-8 rounded-lg relative z-10">
        <h1 className="font-vt text-4xl text-[#00ff9d] mb-6 text-center uppercase tracking-widest">Initial Boot: Sign Up</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">// full name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-4 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">// unique username</label>
            <input
              type="text"
              placeholder="johndoe_os"
              className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-4 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">// email address</label>
            <input
              type="email"
              placeholder="user@ieee-ritb.org"
              className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-4 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">// password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-4 py-2 text-[#c8ffe8] outline-none focus:border-[#00ff9d] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={signUp}
            disabled={loading}
            className="w-full bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] text-[#00ff9d] py-3 rounded uppercase tracking-widest hover:bg-[rgba(0,255,157,0.2)] transition-all disabled:opacity-50 mt-4 font-bold"
          >
            {loading ? "Processing..." : "Execute Registration"}
          </button>

          <div className="text-center mt-6 text-[11px] text-[rgba(200,255,232,0.45)] uppercase tracking-wider">
            Already registered? <Link href="/auth/sign-in" className="text-[#00ff9d] hover:underline">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
