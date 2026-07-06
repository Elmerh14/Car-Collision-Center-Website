# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page + CMS-style admin panel for Car Collision Center, an automotive repair shop. The full planned architecture is documented in `ARCHITECTURE.md`. The user is building this themselves — provide guidance and explain concepts rather than generating full implementations unprompted.

## Planned Monorepo Structure

```
Car-Collision-Center-Website/
├── frontend/
│   ├── main-site/       ← React landing page (currently ccr-frontend/)
│   └── admin-panel/     ← React admin app (not yet created)
├── backend/
│   ├── auth-service/    ← Spring Boot DGS subgraph
│   ├── content-service/ ← Spring Boot DGS subgraph
│   ├── media-service/   ← Spring Boot DGS subgraph
│   └── estimate-service/← Spring Boot DGS subgraph
├── gateway/
│   └── router.yaml      ← Apollo Router supergraph config
├── docker-compose.yml
└── ARCHITECTURE.md      ← full architectural decisions and build order
```

> The repo is currently in transition. `ccr-frontend/` will be renamed to `frontend/main-site/`; the rest of the structure does not exist yet.

## Current Frontend (`ccr-frontend/`)

All commands run from `ccr-frontend/`:

```bash
npm run dev      # Vite dev server with HMR
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # serve production build locally
```

No tests are configured yet.

**Stack:** React 19, TypeScript 5.9 (strict), Vite 7, Tailwind CSS 4 (via `@tailwindcss/vite` — no separate config file), `hamburger-react` for mobile nav toggle.

**What exists:** `NavBar.tsx` (mobile view only — desktop view is a stub), `Logo.tsx`. `App.tsx` renders only `<NavBar />`. No routing, no pages, no backend connection.

## Backend Stack (to be built)

- **Java 21**, Spring Boot 3.x, **Lombok** for boilerplate
- **Netflix DGS** (`com.netflix.graphql.dgs:graphql-dgs-spring-graphql-starter`) — each service is a GraphQL Federation v2 subgraph
- **Apollo Router** (`ghcr.io/apollographql/router`) federates all 4 subgraphs into one endpoint
- **Spring Security + JJWT** for JWT auth in `auth-service`; Router validates tokens and injects `x-admin-user-id` header downstream
- **Spring Data JPA** + PostgreSQL driver; **NeonDB** in production (one project, separate schemas per service)

## Key Architectural Decisions

- **GraphQL only** — all APIs are GraphQL over HTTP via the Apollo Router gateway (single endpoint for both frontend apps)
- **Image uploads** use presigned Cloudflare R2 URLs — browser uploads directly to R2, server only stores metadata
- **JWT auth** (not OAuth2) — short-lived access tokens (15 min) + refresh tokens (7 days, stored in DB), set as httpOnly cookies
- **Admin panel** is a separate React app deployed to a different subdomain (e.g. `admin.carcollisioncenter.com`)
- **Email notifications** (estimate form submissions) via Spring Mail + Resend SMTP relay

## Build Order

See `ARCHITECTURE.md` → "Build Order Recommendation" section for the recommended sequence.
