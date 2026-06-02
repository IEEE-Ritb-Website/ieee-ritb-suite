# ADR 0006: CI/CD and Deployment Strategy

## Status

Accepted

## Context

The IEEE RIT-B Suite contains multiple backend services and frontend applications with different runtime requirements. We needed a deployment strategy that balanced cost (free tier), ease of use, and the specific needs of each service type.

## Decision

We use a **multi-provider deployment strategy**, choosing the platform best suited to each service's characteristics.

## Deployment Targets

| Service | Platform | Type | Reason |
|---------|----------|------|--------|
| Backend services (admin, common-app, form, root) | [Render](https://render.com) | Web Services | Free tier supports Node.js, auto-deploys from Git, handles SSL |
| `landing-fe`, `common-app-fe`, `ieee-links` | [Vercel](https://vercel.com) | Static + Serverless | Best DX for Vite/Next.js, automatic preview deployments, generous free tier |
| `profile-fe` (Next.js) | [Vercel](https://vercel.com) | Next.js SSR | Native Next.js support, ISR, Edge Functions, automatic SSL |
| Additional frontends | [Netlify](https://netlify.com) / [Cloudflare Pages](https://pages.cloudflare.com) | Static sites | Alternative free-tier options depending on project needs |

> Each service's specific deployment URL and platform is documented in its own `README.md`.

## Options Considered

### Single platform for everything
- Easier to manage (one dashboard, one config)
- Does not optimise for each service's strengths
- Render is not optimised for static/SSR frontends; Vercel is not ideal for persistent backend processes

### Self-hosted (VPS)
- Full control but high operational overhead
- No free tier — ongoing server costs
- Requires manual SSL, reverse proxy, monitoring setup

## Rationale

1. **Render for backends**: Render's free tier supports persistent Node.js web services with automatic SSL, Git-based deploys, and a simple dashboard. The spin-down-after-inactivity behaviour is acceptable when combined with the cron-job pinging strategy (see ADR 0005).

2. **Vercel for frontends**: Vercel provides the best developer experience for React and Next.js applications — automatic preview deployments per branch, ISR for profile pages, Edge Functions for low-latency responses, and a generous free tier.

3. **Netlify / Cloudflare as alternatives**: Some frontends may be better suited to Netlify's form handling or Cloudflare's global edge network. Using multiple providers avoids vendor lock-in.

4. **Cost**: All chosen platforms offer free tiers sufficient for a student club's traffic levels. No service requires a paid plan.

## Account Setup Note

All platform accounts (Render, Vercel, Netlify, Cloudflare) are configured using the official IEEE RIT Bangalore email address. Team members should log in using the credentials received at the start of their term, or via Google / GitHub OAuth where available, to access deployment dashboards and settings.

## Consequences

- Developers must be familiar with multiple deployment platforms
- Environment variables must be kept in sync across platforms
- Each service's `README.md` documents its specific deployment target and setup steps
- CI/CD pipelines are configured per-service via platform-specific Git integrations (most platforms auto-deploy from the `main` branch)
