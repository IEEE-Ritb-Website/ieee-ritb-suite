import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthButton from "@/components/auth/AuthButton";
import AppSidebar from "@/components/layout/AppSidebar";
import SiteFooter from "@/components/layout/SiteFooter";
import { getSessionUser } from "@/lib/auth-session";
import { SITE_NAME } from "@/lib/program";
import "./globals.css";
import "@/components/winter-hero/winter-hero-theme.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "RIT Winter of Code is a winter-long open-source program where students build real solutions for participating organizations.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const sessionUser = await getSessionUser();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="bg-[#FAF9F6] text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <AppSidebar user={sessionUser} />
        <div className="flex min-h-screen flex-col pt-14 md:pt-0 md:pl-16">
          <div className="sticky top-0 z-30 hidden h-16 items-center justify-end border-b border-zinc-900/10 bg-[#FAF9F6]/90 px-6 backdrop-blur md:flex dark:border-zinc-100/10 dark:bg-zinc-950/90">
            <AuthButton user={sessionUser} />
          </div>
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
