import Link from "next/link";
import { SITE_NAME } from "@/lib/program";

/**
 * Official IEEE RIT-B links, sourced from the in-repo ieee-links registry
 * (`services/frontend/ieee-links/src/configs/config.tsx`). No social or
 * contact URLs are invented here.
 */
const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/timeline", label: "Timeline" },
  { href: "/projects", label: "Problem Statements" },
  { href: "/organizations", label: "Organizations" },
];

const PROGRAM_LINKS = [
  { href: "/auth/sign-in", label: "Sign in" },
  { href: "/dashboard", label: "Dashboard" },
];

const IEEE_RITB_LINKS = [
  { href: "https://ieee.ritb.in", label: "Website" },
  { href: "https://github.com/ieee-ritb", label: "GitHub" },
  { href: "https://www.linkedin.com/in/ieee-ritb/", label: "LinkedIn" },
  { href: "https://www.instagram.com/ieeeritb", label: "Instagram" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900/10 dark:border-zinc-100/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="font-mono text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {SITE_NAME}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            A winter-long open-source program where students take on real
            problem statements from participating organizations.
          </p>
          <p className="mt-4 font-mono text-xs leading-5 text-zinc-500 dark:text-zinc-500">
            Submission · Oct 15 – Oct 31
            <br />
            Coding · Nov 01 – Dec 31
          </p>
        </div>
        <nav aria-label="Explore">
          <p className="font-mono text-xs font-medium tracking-[0.25em] text-zinc-500 uppercase dark:text-zinc-400">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded text-sm text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Program">
          <p className="font-mono text-xs font-medium tracking-[0.25em] text-zinc-500 uppercase dark:text-zinc-400">
            Program
          </p>
          <ul className="mt-4 space-y-2.5">
            {PROGRAM_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded text-sm text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="IEEE RIT-B">
          <p className="font-mono text-xs font-medium tracking-[0.25em] text-zinc-500 uppercase dark:text-zinc-400">
            IEEE RIT-B
          </p>
          <ul className="mt-4 space-y-2.5">
            {IEEE_RITB_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded text-sm text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-zinc-900/10 dark:border-zinc-100/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-zinc-500 sm:px-6 dark:text-zinc-500">
          © {year} {SITE_NAME} · IEEE RIT-B.
        </p>
      </div>
    </footer>
  );
}
