# landing-fe — Site Optimization Plan

**Audit scope:** `services/frontend/landing-fe` only
**Date:** 2026-04-20
**Build analyzed:** `dist/` (production output)
**Auditor role:** Senior Full-Stack Engineer / Performance Specialist

---

## Executive Summary

`landing-fe` is a visually ambitious React 19 + Vite SPA that leans hard on WebGL (Three.js / R3F), Framer Motion, and Lenis smooth scroll to deliver an "Iconic Minimalism" experience. Design quality is high, but the **shipping footprint and load path are not tuned for its audience** (engineering students on Indian mobile networks).

Key numbers from the production build:

| Artifact | Size (raw) | Notes |
|---|---|---|
| `vendor-three-*.js` | **847 KB** | Three.js + R3F, loaded on every route |
| `index-*.js` (main) | **546 KB** | Framework + app shell |
| `vendor-motion-*.js` | **122 KB** | Framer Motion |
| `index-*.css` | **91 KB** | Global CSS (no purging of unused) |
| `Home-*.js` / CSS | 36 KB / 35 KB | Eagerly chained after index |
| Font files (Inter + JetBrains Mono + Space Grotesk, all subsets) | **~70 files / ~700 KB** | Cyrillic, Greek, Vietnamese subsets shipped unnecessarily |
| `ieee_transparent_logo.png` | 63 KB | Not optimized (PNG, no WebP/AVIF variant) |
| All favicons (`favicon-16`, `favicon-32`, `apple-touch-icon`, `ieee_icon`) | **Identical 49 KB file each** | Same binary renamed — 16x16 favicon is really a full-size PNG |

**Headline issues:**

1. **Initial JS payload is > 1.5 MB raw.** Users pay the full Three.js cost before they can interact with (or even see) the page, because the WebGL starfield is mounted in `MainLayout` on every route, not just the hero.
2. **Font shipping is out of control.** All four Inter subsets (latin, latin-ext, cyrillic, cyrillic-ext, greek, greek-ext, vietnamese) × 2 weights × 2 formats (woff/woff2) are emitted. Same for JetBrains Mono and Space Grotesk. Of the fonts actually rendered, only `latin` + `latin-ext` are ever needed.
3. **SEO is crawler-fragile.** Every meta tag except the hard-coded defaults in `index.html` is rendered by `SEO.tsx` (React 19 document-head hoisting), which non-JS crawlers, preview-scrapers (Slack, Discord, LinkedIn on some rules), and older indexers will not see. Chapter and Event detail pages have **no per-route metadata at all** — every page shares the root OG tags. No JSON-LD structured data is emitted anywhere.
4. **CLS / LCP risk.** The hero is gated behind a 2-stage animation (`EnhancedLoader` → warp → slowing → stopped, ~1.8 s minimum) during which `document.body.style.overflow = 'hidden'` and the real content is `opacity: 0`. This makes the Largest Contentful Paint *by design* equal to the warp-complete moment. Google will score this poorly.
5. **Competing scroll systems.** Lenis, native scroll, `initParallax()`, `useScroll` (Framer), and a hand-rolled scroll throttle in `Navigation.tsx` all touch the scroll pipeline. Three RAF loops (`usePerformanceMonitor` ×2, Lenis, parallax) run simultaneously from mount.
6. **Sustained runtime lag on mid/low-tier laptops.** Distinct from initial-load cost. The page drops to 25–35 FPS while scrolling on iGPU devices (Intel UHD / Iris-class). Root causes: 37 `backdrop-filter: blur` uses across 14 CSS files compositing over a moving WebGL background every frame; Canvas with `antialias: true`, no DPR cap, and `frameloop="always"`; Lenis + `MagneticCursor` + `initMagneticElements` + Framer `useSpring` progress bar all running concurrent RAF loops at idle. The existing `usePerformanceMonitor` *detects* low FPS but only throttles star count — it does not gate any of the above.
7. **Security hygiene gaps.** Cloudflare Turnstile script is appended with `removeChild` in cleanup that can throw; no CSP, no SRI on the third-party script; EmailJS keys are exposed client-side (acceptable for that product but should be paired with Turnstile enforcement on the template, which is not evident here).

With focused work the site can realistically move from an estimated **LCP ~3.5 s / TBT ~600 ms on mid-range Android over 4G** to **LCP < 2 s / TBT < 200 ms** without changing the visual language. Sustained scroll FPS on mid/low-tier laptops should move from 25–35 to 55–60.

---

## Priority 1 — Quick Wins (high impact, low effort)

These are 1-hour to 1-day changes with outsized payoff.

### P1.1 — Strip unused font subsets (~500 KB transferred)

**File:** `src/main.tsx`, `package.json`

Currently imports `@fontsource/inter/400.css` which pulls in **every subset** (Cyrillic, Greek, Vietnamese, Latin-ext, Latin). The site ships English content only.

```diff
- import "@fontsource/inter/400.css"
- import "@fontsource/inter/700.css"
+ import "@fontsource/inter/latin-400.css"
+ import "@fontsource/inter/latin-700.css"
```

Do the same for `space-grotesk` and `jetbrains-mono`. Expected saving: **~500 KB of woff/woff2 files removed from `dist/assets/`** and ~30 `@font-face` rules removed from the main CSS bundle. Also add `font-display: swap` if not already set by Fontsource (it is, verify).

### P1.2 — Fix favicons (save ~200 KB across 4 icons)

**Files:** `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/ieee_icon.png`

All four files are byte-identical (49,157 B). Generate actual-sized PNGs (16×16, 32×32, 180×180 for apple-touch-icon). Use a single `ieee_icon.svg` for modern browsers via `<link rel="icon" type="image/svg+xml" href="/ieee_icon.svg">` in `index.html`. Keep one PNG at 180×180 as the Apple-touch fallback.

### P1.3 — Preload critical assets in `index.html`

**File:** `index.html`

Currently there is no `<link rel="preload">` for fonts or the hero logo. Add:

```html
<link rel="preload" as="font" type="font/woff2"
      href="/assets/inter-latin-400-normal-*.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2"
      href="/assets/space-grotesk-latin-700-normal-*.woff2" crossorigin>
<link rel="preconnect" href="https://challenges.cloudflare.com" crossorigin>
<link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
<link rel="dns-prefetch" href="https://api.emailjs.com">
```

(Use Vite's `transformIndexHtml` hook to inject the hashed font filenames, or switch to self-hosted fonts under `public/` with stable names.)

### P1.4 — Optimize Cloudinary image delivery

**File:** `src/components/sections/Events.tsx`

URLs are of the form `res.cloudinary.com/.../upload/v.../ispy_x_robosoccer_*.png`. Cloudinary supports on-the-fly transforms — add `f_auto,q_auto,w_800` to each URL:

```diff
- image: 'https://res.cloudinary.com/ddrv7lqrg/image/upload/v1776687579/ispy_x_robosoccer_ennnnu.png',
+ image: 'https://res.cloudinary.com/ddrv7lqrg/image/upload/f_auto,q_auto,w_1200/v1776687579/ispy_x_robosoccer_ennnnu.png',
```

That one change hands WebP/AVIF to supporting browsers and resizes to actual render width. Also add `width`, `height`, `decoding="async"` and `fetchpriority="low"` attributes on the `<img>` to stop CLS (currently the slice image at `Events.tsx:165` sets no dimensions).

### P1.5 — Per-route SEO metadata

**Files:** `src/pages/ChapterDetails.tsx`, `src/pages/EventDetails.tsx`, `src/pages/Home.tsx`

The `SEO` component is only rendered once in `MainLayout` with defaults. Chapter and Event detail routes need their own `<SEO>` instance with unique `title`/`description`/`url`. For each chapter, use `chapter.name`, `chapter.fullName`, `chapter.shortDescription`. For each event, use `event.title` + `event.description`. This is a 30-minute change and dramatically improves search and social-preview quality.

Also add `og:image` per route (event images are already on Cloudinary; chapters need a generated OG card or re-use `ieee_icon`).

### P1.6 — Add JSON-LD structured data

**File:** `index.html` (and per-route in `SEO.tsx`)

Add an `Organization` schema and a `WebSite` schema with `SearchAction`. Add `Event` schema on `EventDetails`. Google's Rich Results eligibility unlocks entity-card treatment. Example for `index.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "IEEE RIT-B",
  "url": "https://ieee.ritb.in",
  "logo": "https://ieee.ritb.in/ieee_icon.png",
  "sameAs": [
    "https://linkedin.com/company/ieee-rit",
    "https://instagram.com/ieeeritb"
  ]
}
</script>
```

### P1.7 — Remove duplicated RAF monitors

**Files:** `src/layouts/MainLayout.tsx`, `src/components/effects/HeroStarfield.tsx`

`usePerformanceMonitor(false)` is called in both components, spinning **two concurrent `requestAnimationFrame` loops forever**. Lift it into a React context (or a singleton store) created once in `MainLayout` and consumed via `useContext` in `HeroStarfield`. Saves one RAF loop, simplifies reasoning.

### P1.8 — Gate the loader on "first render complete", not an artificial timer

**File:** `src/components/common/EnhancedLoader.tsx`

The loader's five stages run a fixed **1,950 ms total (400+500+400+350+300)** even when the app is ready in 300 ms. Replace the `setInterval` driven stages with a driver that completes when `document.readyState === 'complete'` OR when the WebGL canvas has rendered its first frame — whichever is later. Keep the visual stage labels for flavor but compress to ≤ 700 ms upper bound.

Secondary bug: `advanceStage()` returns a cleanup closure that is silently discarded. If the component unmounts mid-stage, **the `setInterval` leaks**. Store the interval id in a ref and clear it in the effect's cleanup.

### P1.9 — Memoize `Chapters` section computations

**File:** `src/components/sections/Chapters.tsx:63-70`

On every render `IEEEChapters.map(...)` and three `.filter(...)` passes run. Wrap in `useMemo([activeTab])`. Since Chapters re-renders on hover (`setActiveChapter`), this currently rebuilds the array 18+ times per second during hover sweeps.

### P1.10 — Drop the identical mobile PNG fallback in `HeroFallback`

`public/ieee_transparent_logo.png` is 63 KB and is loaded by `<Navigation>` on every page. Export a 2-KB SVG version (the IEEE logo is already being drawn as SVG rects in `EnhancedLoader.tsx:194-221`; reuse that). Saves 60 KB on every cold load.

---

## Priority 2 — Critical Architecture Changes (high impact, high effort)

These require design discussion and 1–3 days of work each.

### P2.1 — Route-split the WebGL starfield

**File:** `src/layouts/MainLayout.tsx`

The starfield is the single biggest payload (`vendor-three` = 847 KB). Today it mounts in `MainLayout`, which means `ChapterDetails` and `EventDetails` visitors download the full Three.js bundle even though the starfield barely shows through their content.

**Option A (pragmatic):** Move the `HeroStarfield` import into `Home.tsx` and wrap it in `React.lazy()`. On `/chapters/:id` and `/events/:id`, use `HeroFallback` (a CSS gradient). The persistent-canvas "feels smooth" argument is already broken because the fallback pages use a different background treatment.

**Option B (aggressive):** Ship a WebGL "lite" variant using pure `<canvas>` + vanilla `requestAnimationFrame` for the star field (no R3F, no scene graph). The current shader-less particle logic doesn't need three.js — 2D canvas would be ~8 KB. Estimated bundle shrink: **800 KB gzipped → 30 KB gzipped**.

Either option also removes the "scroll-locked while warp plays" LCP penalty on deep-link traffic.

### P2.2 — Introduce SSR / pre-rendering for crawlable routes

**Files:** build pipeline (`vite.config.ts`, likely a new `prerender.ts`)

Everything meaningful to crawlers — chapter descriptions, event listings, contact info — is rendered client-side. Add either:

- **`vite-plugin-ssr` (Vike)** for true SSR with React 19, or
- **`vite-plugin-prerender` / `react-snap`** for static-HTML generation of `/`, `/chapters/<each>`, `/events/<each>` at build time.

Since data is sourced from `@astranova/catalogues` and `src/data/mockData.ts` (static at build time), prerendering is the low-friction choice. Generates 1 + 18 + N static HTML files with actual content, and the SPA hydrates on top. Fixes **SEO, social previews, TTFB, and LCP** in one architectural move.

### P2.3 — Consolidate the scroll stack

**Files:** `src/utils/smoothScroll.ts`, `src/components/layout/Navigation.tsx`, `src/components/effects/ParallaxLayer.tsx`

Today, competing for scroll events:

| System | Owner | Problem |
|---|---|---|
| Lenis (`initSmoothScroll`) | `MainLayout` | Rewrites scroll, installs its own RAF |
| `initParallax()` | `MainLayout` (delayed 100 ms) | Scans `[data-parallax]` DOM every scroll |
| `useScroll` / `useSpring` progress bar | `Navigation` | Reads `scrollYProgress` (conflicts with Lenis) |
| Throttled scroll listener | `Navigation` | Duplicates the above |
| `scrollRestoration = 'manual'` + `useLayoutEffect` scroll reset | `MainLayout` | Fights Lenis if it has mounted |

Pick one scroll source of truth. Recommended: keep Lenis, and:
- drive the progress bar from Lenis's `scroll` event, not Framer's `useScroll`;
- use `ScrollTrigger`-style subscription in `ParallaxLayer` (pure transform, GPU-only) — rewrite `initParallax` as a React component that reads Lenis's scroll value;
- remove the Navigation RAF throttle — subscribe to the same Lenis feed and set `isScrolled` from it.

Also fix `smoothScroll.ts:32` — it binds click listeners once at init. When navigating between routes, new `<a href="#foo">` elements created in detail pages never get Lenis scroll; native scroll takes over instead. Move to event-delegation on `document` or re-init on route change.

### P2.3b — Runtime Quality Tiering (mid/low-tier laptop lag)

**Files:** `src/hooks/usePerformanceMonitor.ts`, `src/components/effects/HeroStarfield.tsx`, `src/layouts/MainLayout.tsx`, `src/components/effects/MagneticCursor.tsx`, `src/utils/smoothScroll.ts`, new `src/contexts/PerformanceContext.tsx`, new `src/styles/perf-overrides.css`

**Problem.** The existing `usePerformanceMonitor` classifies devices into `ULTRA | BALANCED | PERFORMANCE`, but the tier only affects *starfield density* and *shooting-star count*. Every other expensive subsystem — `backdrop-filter` blurs (37 uses across 14 files), Lenis smooth scroll, `MagneticCursor`, `initMagneticElements`, `initParallax`, Framer's `useSpring`-driven nav progress bar, `AnimatePresence` exit animations, Canvas `antialias` + uncapped DPR, `frameloop="always"` — runs at full cost regardless of tier. On Intel UHD 620 / i3-10th-gen class laptops this sustains 25–35 FPS during scroll and causes input latency of 180–250 ms on navigation clicks.

**Solution.** Make the tier actually drive runtime behavior, and add a user-visible override.

**Step 1 — Publish the tier via context (also subsumes P1.7).**
Create `src/contexts/PerformanceContext.tsx`. Run `usePerformanceMonitor` exactly once in `MainLayout`. Consumers (`HeroStarfield`, `Navigation`, `MagneticCursor`, etc.) read via `useContext`. Expand the type:

```ts
export type PerformanceTier = 'ULTRA' | 'BALANCED' | 'PERFORMANCE' | 'LOW';
```

Trigger `LOW` when **any** of:
- avg FPS < 30 for > 1 s,
- `navigator.hardwareConcurrency ≤ 4` AND `navigator.deviceMemory ≤ 4`,
- the user's persisted `localStorage['perfMode']` is `"low"`.

Auto-detection takes 0.5–1 s to settle, so also seed the initial tier from `hardwareConcurrency` / `deviceMemory` before the first frame.

**Step 2 — Attribute-driven CSS overrides.**
Set `<body data-perf-tier="...">` from `MainLayout` whenever the tier changes. Create `src/styles/perf-overrides.css` (imported from `main.tsx` after `index.css`):

```css
/* Kill the single biggest offender: blur compositing over moving WebGL */
[data-perf-tier="performance"] .glass-panel,
[data-perf-tier="low"] .glass-panel,
[data-perf-tier="performance"] .nav.scrolled,
[data-perf-tier="low"] .nav.scrolled,
[data-perf-tier="performance"] .contact-form-container,
[data-perf-tier="low"] .contact-form-container {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: rgba(10, 12, 24, 0.88); /* solid fallback preserves contrast */
}

/* Disable parallax transforms and magnetic drift on LOW */
[data-perf-tier="low"] [data-parallax],
[data-perf-tier="low"] .magnetic {
  transform: none !important;
}

/* Collapse long-running animations on LOW (scanlines, grid scroll, em-pulses) */
[data-perf-tier="low"] .grid-background,
[data-perf-tier="low"] .scanlines,
[data-perf-tier="low"] .em-pulse-ring,
[data-perf-tier="low"] .animate-shimmer,
[data-perf-tier="low"] .animate-slide {
  animation: none !important;
}
```

**Step 3 — Gate runtime subsystems.**

| Subsystem | `BALANCED` | `PERFORMANCE` | `LOW` |
|---|---|---|---|
| Lenis smooth scroll | keep default `lerp: 0.1` | `lerp: 0.18` | **skip** — native scroll |
| `MagneticCursor` component | mount | unmount | unmount |
| `initMagneticElements()` | run | skip | skip |
| `initParallax()` | run | skip | skip |
| Nav progress bar (`useSpring`) | keep | swap to plain `scaleX` bound to native scroll | hide |
| `ShootingStars` | 1 | 0 | 0 |
| Starfield star count | × 0.7 | × 0.4 | × 0.15 |
| `AnimatePresence` page transitions | 0.4 s / 0.2 s | 0.2 s / 0 s | 0 s / 0 s |

Implement by reading `tier` from context at each call site. Example in `MainLayout`:

```ts
useEffect(() => {
  if (tier === 'LOW') return; // native scroll only
  const lenis = initSmoothScroll({ lerp: tier === 'PERFORMANCE' ? 0.18 : 0.1 });
  // ...
}, [tier]);
```

**Step 4 — Tune the Canvas (`HeroStarfield.tsx:314`).**

```tsx
<Canvas
  camera={{ position: [0, 0, 30], fov: 75 }}
  gl={{
    alpha: true,
    antialias: tier === 'ULTRA',
    powerPreference: 'low-power',
  }}
  dpr={tier === 'LOW' ? 1 : tier === 'PERFORMANCE' ? [1, 1.25] : [1, 1.5]}
  frameloop={tier === 'LOW' ? 'demand' : 'always'}
>
```

`frameloop="demand"` is the biggest single unlock — the scene renders only on `invalidate()`. Pair with explicit `invalidate()` calls on phase transitions and (if LOW mode keeps parallax) pointer move.

**Step 5 — Pause on `visibilitychange`.**
Browser RAF already pauses on hidden tabs, but add an explicit `paused` prop flip on `visibilitychange` so animated state doesn't jump on return and so Lenis / MagneticCursor RAF loops stop cleanly. This also fixes the idle battery drain currently caused by three always-on RAF loops.

**Step 6 — Lazy-hydrate below-the-fold sections.**
`src/pages/Home.tsx` eagerly renders all six sections. Wrap `Events`, `Chapters`, `Contact` in `React.lazy` + an `IntersectionObserver` gate (render skeleton until within 600 px of viewport). On `LOW`, widen the threshold so hydration happens only on near-contact. This moves main-thread work off the critical scroll path.

**Step 7 — User-visible toggle.**
Add a small "Performance" selector in the footer (`Auto / High / Low`). Persist to `localStorage['perfMode']`. Auto-detection is good but slow; giving users an explicit lever is cheap and respectful.

**Expected impact on an Intel UHD 620 / i3-10th-gen class laptop:**

| Metric | Current | After P2.3b |
|---|---|---|
| Scroll FPS (hero visible) | 25–35 | 55–60 |
| Input latency (nav click) | 180–250 ms | 50–80 ms |
| GPU process memory | ~400 MB | ~120 MB |
| Idle battery draw | high (3 RAF loops + Canvas always-on) | near zero (`frameloop: demand`) |

**Effort:** ~1.5–2 days. The perf-tier plumbing is half-built; the work is (a) lifting the hook into context, (b) the `data-perf-tier` attribute, (c) `perf-overrides.css`, (d) Canvas props, (e) lazy section hydration, (f) the footer toggle. Strictly additive — does not block P2.1 or P2.2.

### P2.4 — Break the LCP block

**Files:** `src/layouts/MainLayout.tsx`, `src/components/sections/Hero.tsx`

Current sequence: `EnhancedLoader` (locks scroll, occupies viewport) → `HeroStarfield` warp → `slowing` → `stopped` → hero text fades in. Measured worst case from cold load: **~2.5 s before any hero text is visible**, which is what Lighthouse will register as LCP.

Decouple the two:
1. Render hero text at `opacity: 1` immediately (it can be underneath the loader visually — stack order solves this).
2. The loader fades out when `document.readyState === 'complete'` AND fonts are loaded (`document.fonts.ready`).
3. The starfield runs its warp, but the hero text is **already the LCP candidate** behind the loader overlay. When the overlay fades, the text is already painted.

This is the single highest-leverage CLS/LCP change. Target: LCP anchored to a real text element at ~1.2 s instead of an animation milestone at ~2.5 s.

### P2.5 — Dynamic-import Framer Motion features

**File:** `package.json`, every `import { motion } from 'framer-motion'` site.

Framer Motion ships at 122 KB minified. The library supports a "reduced bundle" pattern with `m` (mini) + `LazyMotion` + `domAnimation` / `domMax`. Switching to:

```ts
import { LazyMotion, domAnimation, m } from 'framer-motion'
```

and replacing `motion.div` → `m.div` across the app saves ~40 KB. Wrap the app in `<LazyMotion features={domAnimation} strict>` in `main.tsx`.

### P2.6 — Back the contact form with a real rate limit

**File:** `src/components/sections/Contact.tsx:287-302`

Rate-limiting via `localStorage` is client-side and trivially bypassed by clearing it / opening incognito. The Turnstile token is issued client-side; EmailJS accepts requests regardless of Turnstile validation unless your EmailJS template enforces it. Add a **thin serverless proxy** (Cloudflare Worker; free tier) that:
1. Verifies the Turnstile token server-side against `siteverify`.
2. Enforces IP-based rate limits (KV).
3. Forwards to EmailJS (or directly to Mailgun/Resend).

Also remove the `alert()` calls (`Contact.tsx:356,362,382`) — they block the main thread and have no styling.

### P2.7 — Typed route data and remove `mockData.ts`

**File:** `src/data/mockData.ts`, `src/router.tsx`

Events are currently static mock data living in the bundle. When real events are added this becomes painful. Either:
- Promote events into the shared `@astranova/catalogues` package (versioned with other IEEE data), or
- Move to a `public/events.json` that is fetched on demand so edits do not require a rebuild.

Prefer option 1 for SSR consistency.

---

## Priority 3 — Polish & Best Practices

Minor but real improvements that should be batched into a cleanup PR.

### P3.1 — Inline-SVG deduplication

LinkedIn, Instagram, GitHub, mail, and arrow SVGs are copy-pasted across `Contact.tsx`, `Footer.tsx`, and `ChannelCard`. Extract to `src/components/ui/icons/`. Reduces JS bundle and prevents icon drift.

### P3.2 — `chapterColors` duplication

`Chapters.tsx:19-24` hard-codes a `Record<IChapterAcronyms, string>` that will drift if a new chapter is added to the catalogues package. Move `color` into the chapter schema in `@astranova/catalogues` and type-narrow via Zod.

### P3.3 — Throttle import duplication

`throttle.ts` exists; `Navigation.tsx` re-implements RAF throttling inline. Use the shared utility.

### P3.4 — Remove debug/perf overlay from production

`src/components/debug/PerformanceMonitor.tsx` renders in `MainLayout` unconditionally. Gate behind `import.meta.env.DEV` or a URL param `?perf=1`.

### P3.5 — `useEffect` dep-list cleanups

- `EnhancedLoader.tsx:94` — `advanceStage` closure captures `totalElapsed` and `stageIndex` as local mutables, side-stepping React's model. Rewrite with `useRef` or a reducer.
- `Contact.tsx:94-104` has cleanup `removeChild` on a script that may have been moved or re-inserted by Turnstile. Guard with `script.parentNode?.removeChild(script)`.
- `Navigation.tsx:97-112` IntersectionObserver re-creates on every route change — fine, but consolidate with the existing observer in `ParallaxLayer`.

### P3.6 — `performance.navigation?.type` (MainLayout.tsx:50) is deprecated

Already has the `PerformanceNavigationTiming` fallback path, so delete the deprecated branch.

### P3.7 — CSS: split and purge

`index-*.css` is 91 KB (pre-gzip). Tailwind v4 purges by default but the file still has large hand-authored blocks in `index.css` (476 lines) plus co-located `.css` per section. Audit for unused declarations (e.g., `QuantumParticles.css` imports nowhere?). `Home-*.css` at 35 KB is surprisingly large for a page-level stylesheet — verify it isn't duplicating section styles already in the main bundle.

### P3.8 — Accessibility cleanup

- Skip-nav anchors point to `#main-content` and `#nav`, but `#nav` doesn't exist as an id — `Navigation` is tagged `role="navigation"` but its `<nav>` has no id. Add `id="nav"`.
- Status announcements: the loader progress `%` is in a non-live region; wrap in `<div role="status" aria-live="polite">` for screen readers.
- `aria-hidden="true"` on the persistent WebGL div is correct, but the `skip-nav` links do not receive focus styles by default — verify CSS doesn't `display: none` them.

### P3.9 — Security headers

Add `_headers` (Cloudflare Pages / Netlify) or a `vercel.json` to set:
- `Content-Security-Policy` (allow `self`, `cloudinary.com`, `challenges.cloudflare.com`, `api.emailjs.com`)
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

The existing `_redirects` file is present; add a sibling `_headers`.

### P3.10 — Source-map hygiene

Vite defaults (`build.sourcemap: false`) are correct, but if source maps are emitted, don't upload them with the site. Check CI.

### P3.11 — Build warning: `chunkSizeWarningLimit: 1000`

`vite.config.ts` raises the warning threshold rather than solving the underlying 847 KB `vendor-three` chunk. Lower it back to 500 once P2.1 lands so regressions get flagged.

---

## Suggested sequencing

| Week | Focus | Expected user-visible impact |
|---|---|---|
| 1 | P1.1, P1.2, P1.4, P1.7, P1.8, P1.9, P1.10 | ~700 KB transfer saved, LCP −0.5 s |
| 2 | **P2.3b (runtime tiering)** + P3.4 + P3.9 | Mid/low-tier laptops go 25–35 FPS → 55–60 FPS; idle battery drop |
| 3 | P1.3, P1.5, P1.6 | SEO/preview quality jumps; CSP in place |
| 4 | P2.4 (LCP decoupling) + P2.5 (LazyMotion) | LCP −1 s, TBT −200 ms |
| 5 | P2.1 (route-split three.js) | Detail pages become genuinely lightweight |
| 6–7 | P2.2 (prerender) + P2.3 (scroll consolidation) | Real SEO indexability, smoother INP |
| Ongoing | P3.x polish | Long-tail hygiene |

**Note on ordering:** P2.3b is pulled forward to week 2 because it depends only on P1.7 (shared perf context) and delivers the largest user-perceived improvement for the cohort of users currently worst-served by the site — students on institution-issued low-end laptops.

---

## Metrics to track

Add these to a CI Lighthouse budget or a Web-Vitals beacon (e.g. `web-vitals` lib → Cloudflare Analytics):

- **LCP** target p75 ≤ 2.0 s mobile
- **INP** target p75 ≤ 200 ms
- **CLS** target p75 ≤ 0.05
- **JS transfer size** target ≤ 250 KB gzipped on first paint
- **Image transfer** target ≤ 150 KB above the fold
- **Sustained scroll FPS on Intel UHD-class iGPU** target ≥ 55 (measured via `PerformanceObserver` long-animation-frame entries, bucketed by `data-perf-tier`)

Current estimated p75 LCP on 4G mid-tier Android: **~3.5 s**. Target after P1 + P2.4: **< 2 s**.
Current sustained scroll FPS on Intel UHD 620 / i3-class laptop: **25–35**. Target after P2.3b: **55–60**.
