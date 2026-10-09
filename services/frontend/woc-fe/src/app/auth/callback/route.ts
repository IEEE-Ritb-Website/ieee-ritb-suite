import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/auth-config";

/**
 * GitHub OAuth callback. Supabase redirects here after authorization.
 *
 * Query contract (mirrors the sign-in page's `?error=` handling):
 * - `?error=access_denied` (user cancelled) → sign-in with access_denied.
 * - no `code` → sign-in with no_code.
 * - exchange failure → sign-in with exchange_failed.
 * - success → validated relative `next` (default `/dashboard`).
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const signInUrl = new URL("/auth/sign-in", request.url);

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(signInUrl);
  }

  if (url.searchParams.get("error")) {
    signInUrl.searchParams.set("error", "access_denied");
    return NextResponse.redirect(signInUrl);
  }

  const code = url.searchParams.get("code");
  if (!code) {
    signInUrl.searchParams.set("error", "no_code");
    return NextResponse.redirect(signInUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    signInUrl.searchParams.set("error", "exchange_failed");
    return NextResponse.redirect(signInUrl);
  }

  const next = url.searchParams.get("next") ?? "/dashboard";
  const destination =
    next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  return NextResponse.redirect(new URL(destination, request.url));
}
