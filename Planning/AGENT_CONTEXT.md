# Compass Financial Dashboard - Agent Context

> [!IMPORTANT]  
> **Hello Fellow Agents!** This document serves as the central context file for the Compass project. It outlines the repository structure, architectural decisions, and a historical log of all major work completed up to this point. Review this document before making systemic changes to the codebase.

## 📁 Repository Structure

This is a **React + Vite** single-page application (SPA) built with Vanilla CSS modules.

```text
compass-frontend/
├── index.html                 # Entry point
├── package.json               # Dependencies (React, React Router, Supabase-js)
├── DESIGN.md                  # Critical design system tokens (colors, spacing, fonts)
├── .env.local                 # Environment variables (VITE_SUPABASE_URL, VITE_USE_MOCK_AUTH)
└── src/
    ├── App.jsx                # Application routing (Public vs. Protected routes)
    ├── main.jsx               # React DOM rendering, Context Providers
    ├── components/            # Reusable UI components (Vanilla CSS Modules)
    │   ├── shared/            # Shared components (Navbar, Sidebar)
    │   ├── routing/           # Routing components (ProtectedRoute)
    │   └── ...
    ├── context/               # Global state contexts
    │   └── AuthContext.jsx    # Manages Supabase session and User Profile state
    ├── hooks/                 # Custom React hooks for data fetching
    │   ├── useAccounts.js     # Fetches connected financial accounts
    │   ├── useAlerts.js       # Fetches user alerts and notifications
    │   ├── useChartData.js    # Fetches aggregated data for charts
    │   └── useTransactions.js # Fetches enriched transaction data
    ├── lib/                   # Utility libraries and API clients
    │   ├── supabase.js        # Core Supabase client initialization
    │   └── auth.js            # Auth Abstraction Layer (Mock vs. Live)
    ├── pages/                 # Top-level Page components mapped to routes
    └── styles/                # Global CSS
        └── globals.css        # Root CSS variables derived from DESIGN.md
```

---

## 🛠️ Architectural Guidelines & Decisions

1.  **Styling**: We strictly use Vanilla CSS modules (`*.module.css`) and global CSS variables. **Do not use TailwindCSS**. All tokens (colors, fonts, etc.) MUST come from `DESIGN.md`. 
2.  **Auth Abstraction**: The project uses an Auth Abstraction layer in `src/lib/auth.js`. This allows the developer to toggle `VITE_USE_MOCK_AUTH=true` in `.env.local` to test the UI without hitting Supabase rate limits. 
3.  **Supabase Backend**: The app uses Supabase for Authentication and PostgreSQL database. We rely heavily on Supabase features like **Row Level Security (RLS)** to secure data per user, and **Database Triggers** (e.g., auto-updating account balances upon new transactions) to keep complex logic off the frontend.
4.  **Data Fetching**: Database calls are encapsulated inside custom React hooks (`src/hooks/`). Components should NOT make direct calls to `supabase.from()`—they should consume these hooks.

---

## 🚀 Work History / Jobs Completed

### Phase 1: Prototype & Design System Validation
*   Initial project scaffolding with Vite + React.
*   Implemented global CSS variables based on `DESIGN.md`.
*   Built the core UI components (Buttons, Inputs, Navigation) and static pages (Dashboard, Alerts, Landing Page) using hardcoded mock data.
*   Verified visual fidelity against provided design reference HTML files.

### Phase 2: Supabase Authentication Integration
*   Integrated `@supabase/supabase-js`.
*   Built the Auth Abstraction Layer (`auth.js`) to seamlessly toggle between mock and live authentication to avoid IP rate-limiting during heavy development.
*   Set up public and protected routing architectures (`ProtectedRoute.jsx`).
*   Configured the `RegisterPage` to clean emails (trim, lowercase) and handle "Email Confirmation Required" states correctly.

### Phase 3: Global State & User Profiles
*   Created `AuthContext.jsx` to globally manage the active session.
*   Added logic to `AuthContext` to automatically query the `public.profiles` database table immediately after login.
*   Updated `RegisterPage.jsx` to manually update the `public.profiles` row with the user's explicit `full_name` right after signup.
*   Updated UI elements (like the Dashboard Header and Navbar Avatar) to dynamically render the active user's actual name.

### Phase 4: Live Data Migration (Replacing Mock Data)
*   **Database Schema Established**: The Supabase schema was finalized, including tables for: `profiles`, `accounts`, `institutions`, `transactions`, `merchants`, `categories`, `alerts`, `alert_categories`, and `chart_data_points`.
*   **Data Hooks Created**: Implemented custom hooks (`useAccounts`, `useTransactions`, `useAlerts`, `useChartData`) to pull real data securely via RLS.
*   **Dashboard Wiring**: Removed all mock data from `DashboardPage.jsx` and its child components. 
    *   Wired the KPI stats to calculate totals directly from the `useAccounts` live balances.
    *   Wired the transactions list to dynamically render enriched transaction data (merchants & categories).
    *   Added empty states and loading spinners.
*   **Alerts Page Wiring**: Fully connected `AlertsPage.jsx` to the database. The stats banner on the page now accurately calculates alert counts and sums the `estimated_impact` directly from the database rows.
