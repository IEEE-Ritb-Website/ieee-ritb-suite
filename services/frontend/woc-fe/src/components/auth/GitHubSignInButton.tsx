/**
 * GitHub sign-in button.
 *
 * Active OAuth is gated on two things that do not exist yet: Supabase
 * project credentials AND the installed Supabase client libraries
 * (see `src/lib/auth-session.ts` — they cannot be installed from a shell
 * without symlink privilege). Until both land, this renders an honest
 * disabled placeholder and never fabricates a session. Once wired, this
 * becomes a `"use client"` component calling:
 *   supabase.auth.signInWithOAuth({ provider: "github",
 *     options: { redirectTo: `${window.location.origin}/auth/callback?next=${returnTo ?? "/dashboard"}` } })
 * with loading and error states around the call. The callback route must
 * validate `next` (relative path only) and redirect there post-exchange.
 */

import { isSupabaseConfigured } from "@/lib/auth-config";

export default function GitHubSignInButton({ returnTo }: { returnTo?: string }) {
  if (!isSupabaseConfigured()) {
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
          OAuth once the project credentials and client libraries are in
          place.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled
        aria-describedby="github-signin-pending"
        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 bg-zinc-900/10 px-6 py-3 text-sm font-medium text-zinc-500 dark:bg-zinc-100/10 dark:text-zinc-500"
      >
        Continue with GitHub
      </button>
      <p
        id="github-signin-pending"
        className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
      >
        Credentials are present but the Supabase client libraries are not
        installed yet — OAuth activation is pending. No demo session is
        faked in the meantime.
        {returnTo && (
          <> Your destination ({returnTo}) is preserved for after sign-in.</>
        )}
      </p>
    </div>
  );
}
