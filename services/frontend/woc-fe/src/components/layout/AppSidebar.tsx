"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import AuthButton, { type WocSessionUser } from "@/components/auth/AuthButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/timeline", label: "Timeline" },
  { href: "/projects", label: "Problem Statements" },
  { href: "/organizations", label: "Organizations" },
];

function HamburgerIcon() {
  return (
    <span aria-hidden="true" className="flex flex-col items-center gap-1.5">
      <span className="block h-px w-5 bg-current" />
      <span className="block h-px w-5 bg-current" />
      <span className="block h-px w-3.5 self-start bg-current" />
    </span>
  );
}

export default function AppSidebar({ user }: { user?: WocSessionUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const navId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-900/10 bg-[#FAF9F6]/95 px-4 backdrop-blur md:hidden dark:border-zinc-100/10 dark:bg-zinc-950/95">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? navId : undefined}
            aria-label="Open navigation menu"
            className="rounded p-2 text-zinc-900 transition-colors hover:bg-zinc-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
          >
            <HamburgerIcon />
          </button>
          <Link
            href="/"
            className="rounded font-mono text-sm font-semibold tracking-tight text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-50"
          >
            RIT Winter of Code
          </Link>
        </div>
        <AuthButton compact user={user} />
      </div>

      <aside
        aria-label="Site sidebar"
        className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col items-center border-r border-zinc-900/10 bg-[#FAF9F6] py-5 md:flex dark:border-zinc-100/10 dark:bg-zinc-950"
      >
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? navId : undefined}
          aria-label="Open navigation menu"
          className="rounded p-2 text-zinc-900 transition-colors hover:bg-zinc-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
        >
          <HamburgerIcon />
        </button>
        <Link
          href="/"
          aria-label="RIT Winter of Code — home"
          className="mt-5 flex h-10 w-10 items-center justify-center rounded-sm bg-zinc-900 font-mono text-lg font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          W
        </Link>
        <p
          aria-hidden="true"
          className="mt-6 mb-2 flex-1 font-mono text-[11px] font-medium tracking-[0.25em] text-zinc-500 uppercase [writing-mode:vertical-rl] dark:text-zinc-500"
        >
          <span className="block rotate-180">RIT Winter of Code</span>
        </p>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 cursor-default bg-zinc-950/30"
          />
          <nav
            id={navId}
            aria-label="Site"
            className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col border-r border-zinc-900/10 bg-[#FAF9F6] md:left-16 dark:border-zinc-100/10 dark:bg-zinc-950"
          >
            <div className="flex h-14 items-center justify-between border-b border-zinc-900/10 px-5 md:h-16 dark:border-zinc-100/10">
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                Menu
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="rounded px-3 py-2 font-mono text-xs font-medium tracking-widest text-zinc-700 uppercase transition-colors hover:bg-zinc-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-100/10"
              >
                Close
              </button>
            </div>
            <ul className="flex flex-col px-3 py-4">
              {NAV_LINKS.map((link, index) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-baseline gap-4 rounded-sm px-3 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                        isActive
                          ? "bg-zinc-900/[0.04] text-zinc-900 dark:bg-zinc-100/[0.07] dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-900/[0.04] hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-100/[0.07] dark:hover:text-zinc-100"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs text-blue-700 dark:text-blue-400"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-base tracking-tight ${isActive ? "font-semibold" : "font-normal"}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto border-t border-zinc-900/10 px-5 py-5 dark:border-zinc-100/10">
              <AuthButton user={user} />
              <p className="mt-4 font-mono text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                Submission · Oct 15 – Oct 31
                <br />
                Coding · Nov 01 – Dec 31
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
