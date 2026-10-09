/**
 * Session resolution seam for RIT Winter of Code.
 *
 * Returns the currently authenticated user, or `null` when signed out.
 * This is NOT fake authentication: it never returns a user without a
 * verified session — it reads the Supabase session over cookies and
 * validates it with `supabase.auth.getUser()`.
 *
 * BACKEND COORDINATION (still open): do NOT assume a Supabase session
 * authorizes backend resource access. Confirm how the frontend must
 * present identity (e.g. `Authorization: Bearer <access_token>` from
 * `supabase.auth.getSession()`) and how the backend validates it before
 * calling any protected endpoint. No protected calls are made until
 * that contract is agreed.
 */

import type { WocSessionUser } from "@/components/auth/AuthButton";
import { isSupabaseConfigured } from "./auth-config";
import { createClient } from "./supabase/server";

export async function getSessionUser(): Promise<WocSessionUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const fullName = user.user_metadata?.full_name;
  const avatarUrl = user.user_metadata?.avatar_url;
  return {
    name:
      (typeof fullName === "string" && fullName.length > 0
        ? fullName
        : undefined) ??
      user.email ??
      undefined,
    email: user.email ?? undefined,
    avatarUrl:
      typeof avatarUrl === "string" && avatarUrl.length > 0
        ? avatarUrl
        : undefined,
  };
}
