/**
 * Pill-shaped GitHub authentication button for RIT Winter of Code.
 *
 * Signed-out state links to the sign-in page. Signed-in state shows the
 * authenticated user's avatar or name and links to the dashboard.
 *
 * No fake authentication is implemented: `user` must come from a real
 * session. To wire Supabase Auth, resolve the session in a Server
 * Component (browser/server clients colocated with `lib/auth-config.ts`)
 * and pass the authenticated user here as the `user` prop.
 */

import Link from "next/link";

export interface WocSessionUser {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

interface AuthButtonProps {
  user?: WocSessionUser | null;
  compact?: boolean;
}

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

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "•";
}

export default function AuthButton({ user, compact }: AuthButtonProps) {
  if (user && (user.name || user.avatarUrl)) {
    return (
      <Link
        href="/dashboard"
        aria-label={
          user.name ? `Open ${user.name}'s dashboard` : "Open your dashboard"
        }
        className={`inline-flex items-center gap-2 rounded-full bg-zinc-900 font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white ${
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
        }`}
      >
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 font-mono text-[11px] font-semibold dark:bg-zinc-900/10"
          >
            {getInitial(user.name ?? "")}
          </span>
        )}
        <span className="max-w-28 truncate">{user.name ?? "Dashboard"}</span>
      </Link>
    );
  }

  return (
    <Link
      href="/auth/sign-in"
      className={`inline-flex items-center gap-2 rounded-full bg-zinc-900 font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      <GitHubMark />
      Sign in with GitHub
    </Link>
  );
}
