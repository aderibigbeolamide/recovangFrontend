# Recovang — Frontend

> Recover. Earn. Sustain. — a sustainability platform that turns waste into instant cash across Africa, starting in Nigeria.

## Overview

This is the frontend (UI) of the Recovang platform, built as a single React + TypeScript + Vite SPA.

- **Public site** — Home (with real human imagery), About, How it works, Waste categories, Find a hub, Contact, FAQ, Blog (wired to `/api/v1/blog` with mock fallback), Terms, Privacy
- **Auth** — Single sign-in form (role detected from token), unified 3-step registration (account → role → verify), Forgot password, Reset password (6-digit OTP)
- **Collector portal** — Dashboard, Submit, History, Withdraw, Leaderboard, Badges, Referrals, Streaks, Disputes, Notifications, Settings
- **Agent portal** — Dashboard, Verify, Hub, Reports, XP & earnings, Location, Settings
- **Logistics portal** — Dashboard, Pickups, Fleet, Profile, Settings
- **Admin portal** — Dashboard, Management, Logistics, Fraud, Audit logs, Settings
- **Brand portal** — Dashboard, Compliance, Payments, Impact reports, Brand profile, Settings
- **Factory portal** — Dashboard, Marketplace, Orders, Shipments, Receipts, Plant profile, Settings

When a user is signed in, every public page exposes an "Open dashboard" button + avatar in the header that takes them straight back to `/{role}/dashboard`.

### API integration

All API calls live in `src/services/*.service.ts`. They default to mock data when `VITE_USE_MOCK !== "false"` so the UI works end-to-end without a backend. Setting `VITE_USE_MOCK=false` and `VITE_API_URL` switches to the real Recovang REST API documented in `attached_assets/Pasted-Recovang-API-*.txt`.

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
