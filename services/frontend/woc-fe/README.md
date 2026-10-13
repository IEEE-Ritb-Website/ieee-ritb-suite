# woc-fe — RIT Winter of Code frontend

Next.js + TypeScript + Tailwind CSS v4 frontend for RIT Winter of Code
(IEEE RIT-B Suite).

## Getting Started

### Run in Development
From the monorepo root:
```bash
pnpm --filter woc-fe dev
```
Needs `woc-service` running (see its README) and `.env.local`
(see `.env.example`).

## Pages
- `/` — landing (WinterHero + program sections)
- `/projects`, `/projects/[id]`, `/projects/[id]/register`
- `/organizations`, `/timeline`, `/dashboard`
- `/auth/sign-in`, `/auth/callback` (OAuth code exchange)

## Data
Reads `woc-service` through `src/lib/woc-api.ts` (typed adapter) with
`src/lib/woc-data.ts` snapshots. Without `NEXT_PUBLIC_WOC_API_BASE_URL`,
pages render clearly-labeled preview data instead.

## Tech Stack
- Next.js (App Router)
- React 19
- Tailwind CSS v4
- TypeScript
- Supabase Auth (GitHub OAuth) + Supabase Storage (proposal docs)

## Authentication (Supabase GitHub OAuth)

Active — no fake sessions exist. Flow: sign-in button starts GitHub
OAuth → `/auth/callback` exchanges the code for a session (cookies) →
`getSessionUser()` validates it per request → dashboard/register pages
render by session. Registration submits attach the access token as
`Authorization: Bearer`, which `woc-service` re-verifies.

Setup:
1. Copy `.env.example` to `.env.local`; fill `NEXT_PUBLIC_SUPABASE_URL`
   and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase dashboard.
   Never invent values.
2. In Supabase Auth, enable the GitHub provider (via a GitHub OAuth App
   whose redirect URI is `<supabase-url>/auth/v1/callback`).
3. In Supabase Auth → URL Configuration, register
   `<app-origin>/auth/callback` as a redirect URL.
4. Assign mentor/admin roles in Supabase dashboard → Users →
   `app_metadata: {"role": "mentor"}` (default role is `participant`).

## Proposal documents
Applicants may attach a PDF/DOCX (< 15 MB) on the register form.
Files upload to the public `proposal-docs` Storage bucket
(`proposals/<projectId>/<unique-name>`); the backend accepts only URLs
inside its own bucket. Bucket + policies are created in the Supabase
dashboard (see Storage → New bucket, then the two RLS policies for
authenticated inserts and public reads).
