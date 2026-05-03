# Recovang: Platform Integration & Feature Guide

This document provides a comprehensive overview of the Recovang ecosystem, detailing the frontend features and the API endpoints required for integration.

---

## 1. Core Platform Vision
Recovang is a circular economy platform designed to digitize waste management in Nigeria. It connects individual collectors, collection hubs (agents), logistics partners, brands (EPR compliance), and factories (recyclers) into a single, transparent data-driven ecosystem.

---

## 2. Frontend Feature Overview

The frontend is structured into several role-based portals, each tailored to a specific user group:

### A. Collector Portal
*   **Dashboard**: Real-time view of earnings, total waste collected, and current streaks.
*   **Wallet & Payouts**: View balance, itemized earnings history, and withdraw funds to bank accounts or purchase utilities (airtime, data, bills).
*   **Waste Submission**: Create collection requests, select nearby hubs via GPS, and generate QR codes for agent verification.
*   **Gamification**: Leaderboards (rankings), milestone badges, and streak tracking to incentivize consistent collection.
*   **Referral System**: Share referral codes to earn bonuses when new collectors join and drop waste.

### B. Agent Portal (Hub Management)
*   **Verification Engine**: Physical verification of collector submissions using weight input and photo evidence.
*   **Hub Operations**: Monitor current hub load vs. total capacity. Update operational status.
*   **Reports**: Access daily and weekly performance summaries for the assigned hub.

### C. Admin & Super Admin Portal
*   **Ecosystem Control**: Manage all users (Collectors, Agents, Admins), hubs, and partners.
*   **Financial Engine**: Set regional waste pricing (factory buying vs. collector payout) and bulk-approve pending withdrawals.
*   **Security & Fraud**: Review flagged submissions, monitor audit logs, and manage account suspensions.
*   **Analytics**: High-level dashboards for growth trends, revenue distribution, and waste volume by category.

### D. Brand & Factory Portals
*   **Brand (Compliance)**: Track EPR (Extended Producer Responsibility) targets, view recovery progress by category/region, and download official impact reports.
*   **Factory (Marketplace)**: View available waste supply across the platform, place purchase orders, and confirm receipt of shipments.

---

## 3. API Integration Catalog

The backend uses a **Clean Architecture** pattern. All API responses follow a standard format:
`{ "status": "success", "data": { ... }, "message": "..." }`

### 1. Authentication & Onboarding
Recovang uses a **Unified Registration** flow followed by role-specific onboarding.

| Endpoint | Method | Description | Integration Tip |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Step 1: Basic account creation | Returns `accessToken`. Use for Step 2. |
| `/auth/onboard/collector` | `POST` | Step 2: Collector-specific data | Required for full access. |
| `/auth/onboard/business` | `POST` | Step 2: Brand/Factory data | Required for company verification. |
| `/auth/login` | `POST` | Unified login for all roles | Returns JWT token and user role. |
| `/auth/me` | `GET` | Get current user profile | Use on app mount to restore session. |

### 2. Collector Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/collector/dashboard` | `GET` | Stats for the home screen. |
| `/collector/submissions` | `POST` | Submit waste collection request. |
| `/collector/hubs/nearby` | `GET` | Find hubs using `lat` and `lng` query params. |
| `/collector/utilities/purchase` | `POST` | Pay bills/airtime using wallet balance. |

### 3. Agent Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/agent/submissions/pending`| `GET` | List waiting collectors at the hub. |
| `/agent/submissions/:id/verify`| `POST` | Confirm weight and trigger payout. |
| `/agent/hub/load` | `PUT` | Update hub utilization percentage. |

### 4. Admin Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/admin/payments/bulk-approve`| `POST` | Process pending withdrawal requests. |
| `/admin/pricing` | `POST` | Update the naira-per-kg rates globally/regionally. |
| `/admin/hubs` | `POST` | Create new physical collection points. |

---

## 4. Technical Architecture (Frontend)

*   **State Management**: `Zustand` for lightweight, global store (Auth, UI states).
*   **Data Fetching**: `React Query` (TanStack Query) for caching, background synchronization, and automatic retries.
*   **Services Layer**: Found in `src/services/`. Each file (e.g., `collector.ts`) contains the Axios calls mapped to backend routes.
*   **Type Safety**: Comprehensive TypeScript interfaces in `src/@types/` ensure data consistency across the frontend.
*   **Interceptors**: The `api.ts` service automatically attaches the `Authorization: Bearer <token>` header to every request if the user is logged in.

---

## 5. Development Roadmap Notes
*   **Swagger Docs**: Available at `/api-docs` when the backend is running.
*   **Testing**: Use the seeded accounts (password: `Password123!`) to explore each portal's specific functionality.
