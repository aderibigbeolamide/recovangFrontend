# Recovang — Frontend

> Recover. Earn. Sustain. — a sustainability platform that turns waste into instant cash across Africa, starting in Nigeria.

## Overview

This is the frontend (UI) of the Recovang platform, built as a single React + TypeScript + Vite SPA.

- **Public site** — Home (cinematic hero + scroll animations), About, How it works, Waste categories, Find a hub, Contact, FAQ, Blog, Terms, Privacy
- **Auth** — Split-screen login with real photo panel (Framer Motion entrance animations), unified 3-step registration (account → role → verify), Forgot password, Reset password (6-digit OTP)
- **Collector portal** — Dashboard (animated KPI cards, achievement badges, weekly goal ring), Submit, History, Withdraw, Leaderboard, Badges, Referrals, Streaks, Disputes, Notifications, Settings
- **Agent portal** — Dashboard (live queue, capacity ring, hourly bar chart), Verify, Hub, Reports, XP & earnings, Location, Settings
- **Logistics portal** — Dashboard (live truck tracker, route analysis, fleet utilisation ring), Pickups, Fleet, Profile, Settings
- **Admin portal** — Dashboard (regional throughput chart, alert cards, permission matrix), Management, Logistics, Fraud, Audit logs, Settings
- **Brand portal** — Dashboard (EPR compliance ring, recovery by category, certificate preview), Compliance, Payments, Impact reports, Brand profile, Settings
- **Factory portal** — Dashboard (intake chart, supplier rankings, order table, receipt queue), Marketplace, Orders, Shipments, Receipts, Plant profile, Settings

### Design System (fully redesigned 2026)

- **Primary Green** `#1A6B3C` | **Accent Gold** `#D4A017` | **Charcoal** `#1C1C2E` | **Cream** `#FBF9F4`
- **Fonts:** Plus Jakarta Sans (display), Lato (body), JetBrains Mono (numbers)
- **Card classes:** `.card`, `.card-dark`, `.card-primary`, `.card-gold`, `.glass`, `.glass-dark`
- **Button classes:** `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-gold`, `.btn-lg`, `.btn-sm`
- **Framer Motion** used on: all dashboard KPI cards (staggered), scroll-triggered public sections, sidebar mobile drawer (spring), auth page split-screen, HowItWorks alternating steps
- **Tailwind v3 note:** Only standard opacity values (5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100) work in `@apply` directives. Non-standard values like `/6`, `/8`, `/12` cause PostCSS errors.

### API integration

All API calls live in `src/services/*.service.ts`. They default to mock data when `VITE_USE_MOCK !== "false"` so the UI works end-to-end without a backend. Setting `VITE_USE_MOCK=false` and `VITE_API_URL` switches to the real Recovang REST API.

## Tech Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS v3** with custom Recovang theme (`tailwind.config.js`)
- **React Router v6** for routing
- **Zustand** for auth/global state (`src/store/auth.ts`)
- **TanStack Query** for data fetching/caching
- **Framer Motion** for all animations (scroll triggers, entrance, spring transitions)
- **Lucide React** for icons
- **Recharts** for charts (via wrapper components in `src/components/charts.tsx`)
- **Axios** for API calls

## Project Layout

```
src/
  main.tsx              # entry, providers
  App.tsx               # all routes
  index.css             # tailwind layers + design tokens + keyframes
  tailwind.config.js    # brand colors, shadows, fonts, gradients
  components/
    Logo.tsx            # brand mark + wordmark
    PublicLayout.tsx    # marketing site shell (glass nav + mega footer)
    PortalShell.tsx     # shared sidebar/header for all portals
    ui.tsx              # KPICard, PageHeader, StatusPill, DashboardSkeleton, Avatar, Empty
    illustrations.tsx   # Blob, GridOverlay, CategoryIcon, PhoneMockup
    charts.tsx          # AreaChart, BarChart, Donut, ProgressRing, Sparkline, ProgressBar
  lib/cn.ts             # clsx + naira/kg/number formatters
  store/auth.ts         # Zustand auth store (persist)
  pages/
    public/             # Home, About, HowItWorks, FindHub, Categories, Blog, FAQ
    auth/               # Login (AuthShell export), Register
    collector/          # collector portal pages
    agent/              # agent portal pages
    logistics/          # logistics portal pages
    admin/              # admin portal pages
    brand/              # brand portal pages
    factory/            # factory portal pages
    super-admin/        # super-admin portal pages
    _shared/            # Settings (role-aware)
```

## Replit Setup

- **Workflow:** `Start application` runs `npm run dev` on **port 5000** (webview).
- **Vite config:** `host: "0.0.0.0"`, `port: 5000`, `allowedHosts: true`
- **Deployment:** static deploy — `npm run build` → `dist/`

## Auth & Demo Accounts

Demo credentials (password `demo-pass` for all):
- `adaeze@example.com` — Collector
- `emeka@example.com` — Agent
- `chidi@example.com` — Logistics
- `admin@example.com` — Admin
- `superadmin@example.com` — Super Admin
- `brand@example.com` — Brand
- `factory@example.com` — Factory

## Notes for Backend Integration

1. Create `src/lib/api.ts` — Axios instance with JWT interceptor (handle 401 → `/api/v1/auth/refresh`)
2. Add per-resource hooks in `src/hooks/` using TanStack Query
3. Replace inline mock arrays in each page with `useQuery` results
4. For offline-first submissions, add Dexie.js + sync queue keyed off `useNetwork`

Auth flow already navigates to the role-specific dashboard after login/register.
