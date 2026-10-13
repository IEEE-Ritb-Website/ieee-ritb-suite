/**
 * GitHub sign-in button.
 *
 * Starts Supabase GitHub OAuth and returns to `returnTo` (relative in-app
 * path only) after the `/auth/callback` code exchange. Until Supabase
 * credentials exist, this renders an honest disabled placeholder and never
 * fabricates a session.
 */

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

function GitHubMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export default function GitHubSignInButton({
  returnTo,
  configured,
}: {
  returnTo?: string;
  // Passed from the server page (single source of truth). The button must
  // NOT read env itself — server and client bundles can disagree on env
  // during development, which crashes hydration.
  configured: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!configured) {
    return (
      <div>
        <button
          type="button"
          disabled
          aria-describedby="github-signin-note"
          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 bg-zinc-900/10 px-6 py-3 text-sm font-medium text-zinc-500 dark:bg-zinc-100/10 dark:text-zinc-500"
        >
          Continue with GitHub
        </button>
        <p
          id="github-signin-note"
          className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
        >
          GitHub sign-in is not enabled yet. It will be wired to Supabase
          OAuth once the project credentials are in place.
        </p>
      </div>
    );
  }

  const handleSignIn = async () => {
    if (pending) return;
    setPending(true);
    setFailed(false);
    try {
      const supabase = createClient();
      const redirectTo =
        returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`
          : `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo },
      });
      if (error) setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        <GitHubMark />
        {pending ? "Redirecting to GitHub…" : "Continue with GitHub"}
      </button>
      {failed && (
        <p role="alert" className="mt-3 text-sm leading-6 text-red-700 dark:text-red-400">
          Could not start GitHub sign-in. Check your connection and try again.
        </p>
      )}
    </div>
  );
}
