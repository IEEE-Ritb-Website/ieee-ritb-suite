import type { Metadata } from "next";
import GitHubSignInButton from "@/components/auth/GitHubSignInButton";
import { getSupabaseConfigStatus } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to RIT Winter of Code with GitHub.",
};

interface SignInPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

/**
 * Error codes produced by `app/auth/callback/route.ts` (see
 * `src/lib/auth-session.ts` for the activation checklist):
 * - `access_denied`: user cancelled GitHub authorization.
 * - `no_code`: callback reached without an authorization code.
 * - `exchange_failed`: code-for-session exchange failed.
 */
function getErrorMessage(code: string | undefined): string | null {
  switch (code) {
    case "access_denied":
      return "GitHub authorization was cancelled. Try again when you're ready.";
    case "no_code":
      return "The sign-in callback arrived without an authorization code. Please start again.";
    case "exchange_failed":
      return "Could not complete sign-in just now. Please try again.";
    case undefined:
    case "":
      return null;
    default:
      return "Something went wrong during sign-in. Please try again.";
  }
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const supabaseStatus = getSupabaseConfigStatus();
  const { error, next } = await searchParams;
  const errorMessage = getErrorMessage(error);
  // Only honor relative in-app return paths — never external URLs.
  const returnTo = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <div className="border border-zinc-900/10 bg-white p-8 dark:border-zinc-100/10 dark:bg-zinc-950">
        <p className="font-mono text-xs font-medium tracking-[0.3em] text-blue-700 uppercase dark:text-blue-400">
          Sign in
        </p>
        <h1 className="mt-3 font-mono text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Welcome to RIT Winter of Code
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Sign in with your GitHub account to submit proposals and track your
          progress.
        </p>
        {errorMessage && (
          <div
            role="alert"
            className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            {errorMessage}
          </div>
        )}
        <div className="mt-6">
          <GitHubSignInButton returnTo={returnTo} configured={supabaseStatus.configured} />
        </div>
        {!supabaseStatus.configured && (
          <div className="mt-6 border border-zinc-900/10 bg-[#FAF9F6] px-4 py-3 dark:border-zinc-100/10 dark:bg-zinc-900">
            <p className="font-mono text-xs font-medium tracking-[0.25em] text-zinc-700 uppercase dark:text-zinc-300">
              Setup pending
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              GitHub OAuth via Supabase needs these environment variables —
              values come from the Supabase dashboard, never invent them:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {supabaseStatus.missing.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
