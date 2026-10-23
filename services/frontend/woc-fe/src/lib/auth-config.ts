/**
 * Authentication preparation for RIT Winter of Code.
 *
 * Intended method: GitHub OAuth via Supabase. The Supabase client
 * libraries are installed and the browser/server clients plus the
 * `/auth/callback` route exist — what is still missing are the project
 * credentials:
 *
 * 1. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *    (see .env.example) — values come from the Supabase dashboard.
 * 2. Enable the GitHub OAuth provider in Supabase Auth and set the callback
 *    URL to `<app-url>/auth/callback`.
 * 3. Confirm with the backend teammate how the session token is sent with
 *    protected API requests (e.g. `Authorization: Bearer <token>`).
 *
 * No fake authentication is implemented — the sign-in UI stays in a
 * clearly-labeled placeholder state until the above is done.
 */

export const REQUIRED_SUPABASE_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function getSupabaseConfigStatus(): {
  configured: boolean;
  missing: string[];
} {
  const missing = REQUIRED_SUPABASE_ENV_VARS.filter((name) => {
    const value = process.env[name];
    return !value || value.trim().length === 0;
  });
  return { configured: missing.length === 0, missing: [...missing] };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfigStatus().configured;
}
