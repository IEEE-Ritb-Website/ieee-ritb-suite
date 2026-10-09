"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    if (pending) return;
    setPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="inline-flex items-center justify-center border border-zinc-900/20 px-8 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-900/5 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-100/20 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
