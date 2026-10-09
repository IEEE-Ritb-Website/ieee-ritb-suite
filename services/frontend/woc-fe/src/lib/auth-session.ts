/**
 * Session resolution seam for RIT Winter of Code.
 *
 * Returns the currently authenticated user, or `null` when signed out.
 * This is NOT fake authentication: it never returns a user without a
 * verified session — right now there is no session to verify, so it
 * always returns `null` and every consumer renders its signed-out state.
 *
 * To activate real GitHub OAuth via Supabase (all values from the Supabase
 * dashboard — never invent credentials):
 *
 * 1. From a shell WITH symlink privilege (Windows Developer Mode or an
 *    elevated prompt — plain shells fail with EPERM on link), run:
 *      pnpm --filter woc-fe add @supabase/ssr @supabase/supabase-js
 * 2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *    (see `.env.example`) and enable the GitHub provider in Supabase Auth
 *    with redirect URL `<app-origin>/auth/callback`.
 * 3. Add `lib/supabase/browser.ts` (createBrowserClient) and
 *    `lib/supabase/server.ts` (createServerClient over `next/headers`
 *    cookies), plus `app/auth/callback/route.ts` exchanging the OAuth code
 *    via `supabase.auth.exchangeCodeForSession(code)` and redirecting to
 *    `next` (default `/dashboard`) or `/auth/sign-in?error=<code>`.
 * 4. Implement this function with the server client:
 *      const supabase = createServerClient();
 *      const { data: { user } } = await supabase.auth.getUser();
 *      if (!user) return null;
 *      return {
 *        name: (user.user_metadata?.full_name as string | undefined)
 *          ?? user.email ?? undefined,
 *        email: user.email ?? undefined,
 *        avatarUrl: (user.user_metadata?.avatar_url as string | undefined)
 *          ?? undefined,
 *      };
 * 5. Sign-out (dashboard) uses the browser client:
 *      await supabase.auth.signOut();
 *      router.push("/"); router.refresh();
 *
 * BACKEND COORDINATION (open item for the backend teammate): do NOT assume
 * a Supabase session authorizes backend resource access. Confirm how the
 * frontend must present identity (e.g. `Authorization: Bearer <access_token>`
 * from `supabase.auth.getSession()`) and how the backend validates it
 * before calling any protected endpoint. No protected calls are made until
 * that contract is agreed.
 */

import type { WocSessionUser } from "@/components/auth/AuthButton";

export async function getSessionUser(): Promise<WocSessionUser | null> {
  return null;
}
