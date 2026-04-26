# Recovang — Frontend

> Recover. Earn. Sustain. — a sustainability platform that turns waste into instant naira across Nigeria.

## Overview

This is the frontend (UI) of the Recovang platform, built as a single React + TypeScript + Vite SPA. It implements the full sitemap from the product brief:

- **Public site** — Home, About, How it works, Waste categories, Find a hub, Contact, FAQ, Blog, Terms, Privacy
- **Auth** — Unified registration (2-step: account → role-specific onboarding) + login
- **Collector portal** — Dashboard, Submit, History, Withdraw, Leaderboard, Badges, Referrals, Streaks, Disputes, Notifications
- **Agent portal** — Dashboard, Verify, Hub, Reports, XP & earnings, Location
- **Logistics portal** — Dashboard, Pickups, Fleet, Profile
- **Admin portal** — Dashboard, Management, Logistics, Fraud, Audit logs

UI follows the brand system from the project bible: Primary Green `#1A6B3C`, Accent Gold `#D4A017`, Dark Charcoal `#1C1C2E`, Plus Jakarta Sans / Lato / JetBrains Mono.

## Tech Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS** with custom Recovang theme (`tailwind.config.js`)
- **React Router v6** for routing
- **Zustand** for auth/global state (`src/store/auth.ts`)
- **TanStack Query** for data fetching/caching (provider wired in `src/main.tsx`)
- **React Hook Form** + **Zod** for forms (available, used as data evolves)
- **Framer Motion** for hero animations
- **Lucide React** for icons
- **Axios** for API calls (ready for the backend integration)

## Project Layout

```
src/
  main.tsx              # entry, providers
  App.tsx               # all routes
  index.css             # tailwind layers + design tokens
  components/
    Logo.tsx            # brand mark + wordmark
    PublicLayout.tsx    # marketing site shell
    PortalShell.tsx     # shared sidebar/header for all portals
    ui.tsx              # PageHeader, StatCard, Section, StatusPill, Empty
  lib/cn.ts             # clsx + naira/kg formatters
  store/auth.ts         # Zustand auth store (persist)
  pages/
    public/             # marketing pages
    auth/               # login + multi-step register
    collector/          # collector portal pages
    agent/              # agent portal pages
    logistics/          # logistics portal pages
    admin/              # admin portal pages
```

## Replit Setup

- **Workflow:** `Start application` runs `npm run dev` on **port 5000** (webview).
- **Vite config:** `host: "0.0.0.0"`, `port: 5000`, `allowedHosts: true` so the Replit proxy iframe is trusted.
- **Deployment:** static deploy — `npm run build` outputs to `dist/`, configured via `deployConfig`.

## Notes for the Backend Integration

All sample data is currently in-component for design fidelity. To wire to the real API:

1. Create `src/lib/api.ts` — Axios instance with the JWT interceptor (handle 401 → `/api/v1/auth/refresh`).
2. Add per-resource hooks in `src/hooks/` using TanStack Query that call the endpoints listed in the API guide (`/api/v1/auth/*`, `/api/v1/collector/*`, etc.).
3. Replace the inline mock arrays in each page with the `useQuery` results.
4. For offline-first submissions, add Dexie.js + a sync queue keyed off `useNetwork`.

Auth flow already navigates to the role-specific dashboard after login/register — just replace the `setUser`/`setToken` calls with the real API responses.
