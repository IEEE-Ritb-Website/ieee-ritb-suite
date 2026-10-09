# woc-fe

Next.js + TypeScript + Tailwind CSS v4 frontend for the IEEE RIT-B Suite.

## Getting Started

### Run in Development
From the monorepo root:
```bash
pnpm --filter woc-fe dev
```

## Tech Stack
- Next.js (App Router)
- React 19
- Tailwind CSS v4
- TypeScript

## Authentication (Supabase GitHub OAuth)

Intended method only — no fake sessions exist. Until the checklist below
is done, sign-in UI renders honest disabled/setup states and the dashboard
renders its signed-out views.

1. Create a Supabase project; copy the project URL and anon key from the
   dashboard into `.env.local` (see `.env.example`). Never invent values.
2. Install the client libraries from a shell **with** symlink privilege
   (Windows Developer Mode or elevated prompt):
   `pnpm --filter woc-fe add @supabase/ssr @supabase/supabase-js`
3. In Supabase Auth, enable the GitHub provider (via a GitHub OAuth App)
   and register redirect URL `<app-origin>/auth/callback`.
4. Follow the activation checklist in `src/lib/auth-session.ts`:
   browser/server clients, `app/auth/callback/route.ts` (code exchange,
   `?error=` contract already handled by the sign-in page), session
   middleware, `getSessionUser()`, dashboard sign-out.

Backend coordination (open, owned by backend teammate): a Supabase session
does NOT automatically authorize backend resource access. Agree first how
the frontend presents identity (e.g. `Authorization: Bearer <access_token>`)
and how the backend validates it. No protected backend calls until then.
