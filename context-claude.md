# Compass - Project Context for New Agent

> **Purpose**: This document provides complete context for a new agent picking up the Compass personal finance management application project. It covers everything from initial planning through Supabase database implementation.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Product Definition](#product-definition)
4. [Site Map](#site-map)
5. [User Flow](#user-flow)
6. [Wireframes](#wireframes)
7. [Design System](#design-system)
8. [Component Architecture](#component-architecture)
9. [React Routing](#react-routing)
10. [Database Design (ERD)](#database-design-erd)
11. [CRUD Matrix](#crud-matrix)
12. [Authorization & Roles](#authorization--roles)
13. [Supabase Implementation](#supabase-implementation)
14. [Project Files & Directory Structure](#project-files--directory-structure)
15. [Outstanding Work & Next Steps](#outstanding-work--next-steps)
16. [Conventions & Working Style](#conventions--working-style)

---

## Project Overview

**Compass** is a Hebrew RTL personal finance management web application. The product helps users (primarily individuals and small business owners) take control of their finances by:

- Aggregating all financial documents in one place (manual upload, not Open Banking)
- Automatically extracting transactions via AI from uploaded PDFs/CSVs
- Surfacing actionable alerts: unusual charges, duplicate billings, savings opportunities
- Providing a unified dashboard with KPIs, charts, and recent transactions

**Killer Feature**: Smart Alerts Center - proactively notifies users of anomalies and optimization opportunities they would otherwise miss.

**Pivot history**: Originally planned to use Open Banking integration, then pivoted to manual file upload for MVP simplicity and broader institution support.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React (JSX, not TSX yet) |
| Routing | React Router DOM |
| Styling | Tailwind CSS + CSS Custom Properties |
| RTL | `dir="rtl"` on html element, Hebrew/Manrope/Heebo fonts |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| Deployment | Vercel (frontend) + Supabase Cloud (backend) |
| AI Processing | TBD - likely OpenAI/Claude API via Supabase Edge Functions |
| Diagrams | Eraser.io (ERD, flow diagrams) |

---

## Product Definition

### Target Personas

1. **Individual Consumer** - manages personal accounts, wants to track spending
2. **Small Business Owner** - manages business accounts, needs duplicate detection and tax-readiness
3. **Pro Investor** - manages investment portfolio, wants yield optimization alerts

### Subscription Tiers

- **Free**: Up to 2 accounts, 5 statement uploads/month, basic alerts
- **Pro (Compass Pro)**: Unlimited accounts/uploads, Yield Optimization alerts, custom categories, merchant merge

### Key User Goals

- See total financial position at a glance
- Get warned about suspicious or duplicate charges
- Discover savings/yield opportunities
- Maintain audit trail of financial documents

---

## Site Map

The full app contains **59 screens** organized by access level:

### Public (Guest)
- Landing/Home
- About
- Pricing
- Login
- Register
- Forgot Password
- 404/Not Found

### Protected (Authenticated User)
- Dashboard
- Transactions (List, Detail, Categories)
- Alerts Center (List, Detail, Settings)
- Statements (List, Upload, Detail)
- Insights
- Profile
- Settings (Account, Notifications, Privacy, Billing)
- Help/Support

### Admin
- User Management
- Institution Management
- Document Type Management
- Alert Category Management
- Quick Action Management

---

## User Flow

The user flow diagram was specified for **Eraser.io** with labeled arrows indicating user actions. Key flows:

- **Happy Path**: Landing → Register → Verify Email → Onboarding → Add Account → Upload Statement → AI Processing → Review Transactions → Dashboard
- **Failure Path**: Login → Wrong Password → Forgot Password → Reset Email → Set New Password → Login
- **Decision Points**: Authentication check, file format validation, AI extraction confidence

---

## Wireframes

### Status: B&W Low-Fidelity Wireframes Complete

The user explicitly rejected the first wireframe attempt for being too styled. The current wireframes are TRUE low-fidelity black & white skeletons with `[placeholder]` brackets - no colors except black/white/gray, no emojis.

### Wireframes Location

`/sessions/gifted-nice-pascal/mnt/LastWork/wireframes/`

Files:
- `styles.css` - shared B&W skeleton CSS
- `index.html` - navigation page to all wireframes
- `01-login.html`
- `02-dashboard.html`
- `03-upload.html`
- `04-alerts.html`

### High-Fidelity Mockups Location

`/sessions/gifted-nice-pascal/mnt/LastWork/compass-frontend/`

Files (created via Google Stitch):
- `landing-page.html` (actually the Login page despite the name)
- `dashboard.html`
- `data-upload.html`
- `AlertsCenter.html`

Each has a corresponding `.png` screenshot.

---

## Design System

Based on Dribbble's "Soni Financial App" aesthetic - modern dark fintech with lime accents.

### Colors

```css
--color-primary: #1A1A2E;        /* Deep Navy */
--color-secondary: #D4F35C;      /* Soft Lime/Mint */
--color-accent: #6C5CE7;         /* Electric Purple */
--color-bg: #F5F5F0;             /* Off-White (light mode) */
--color-bg-dark: #0C141F;        /* Background (dark mode - used in mockups) */
--color-card: #FFFFFF;
--color-text: #0F0F1A;
--color-text-secondary: #6B7280;
--color-text-muted: #9CA3AF;
--color-border: #E5E7EB;
--color-error: #EF4444;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-info: #3B82F6;
```

### Typography

- **Primary Font**: Manrope (English) + Heebo/Assistant (Hebrew)
- **Scale**: 12px (caption) -> 16px (body) -> 20px (h3) -> 28px (h2) -> 36px (h1) -> 56px (display KPI)

### Spacing (4px base unit)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
```

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

---

## Component Architecture

Components are organized into three categories: **Shared**, **Reusable**, **Section**.

### Shared Components (appear on all pages)

- `PublicNavbar` - minimal navbar for public pages
- `AppNavbar` - full navbar with menu, notifications, user avatar
- `Footer`
- `Breadcrumb`
- `ToastNotification`
- `Modal`
- `LoadingSpinner`

### Reusable Components (atomic UI)

- `Button` (variants: primary, secondary, ghost; sizes: sm, md, lg)
- `Input` (text, email, password, search)
- `Card` (base wrapper)
- `Tag` / `Chip`
- `Checkbox`
- `Divider`
- `Avatar`
- `Tooltip`
- `Dropdown`
- `ProgressBar`
- `StepIndicator`
- `KPICard` / `StatsCard`
- `TransactionListItem`
- `AlertItem` (composed of AlertSeverityTag, AlertStatusTag, AlertActionButton)
- `DocTypeCard`
- `InstitutionButton`
- `FilterChip`
- `AlertBanner`

### Section Components (per-page blocks)

**Login Page:**
- `LoginHeroSection` (contains SSOButtonsSection + LoginFormSection + LoginFooterLinksSection)

**Dashboard:**
- `WelcomeHeaderSection`
- `AlertsBannerSection`
- `KPIStatsSection` (uses KPICard)
- `ChartsRowSection` (uses ExpenseChartSection + RecentTransactionsSection)
- `QuickActionsSection`

**Upload Statement:**
- `PageHeaderSection`
- `StepperSection`
- `DocumentTypeSection` (uses DocTypeCard)
- `InstitutionSelectorSection`
- `FileUploadSection`
- `TipsSection`
- `FormActionsSection`

**Alerts Center:**
- `PageHeaderSection`
- `AlertStatsSection` (uses StatsCard)
- `AlertsFilterBarSection` (uses FilterChip)
- `AlertsListSection` (uses AlertItem)
- `PaginationSection`

### Recommended Folder Structure

```
src/
  components/
    shared/         # Navbar, Footer, Breadcrumb
    ui/             # Button, Input, Card, Tag (atomic)
    reusable/       # KPICard, AlertItem, TransactionListItem
    sections/
      login/
      dashboard/
      upload/
      alerts/
  pages/
    LoginPage.jsx
    DashboardPage.jsx
    UploadPage.jsx
    AlertsPage.jsx
  layouts/
    PublicLayout.jsx
    AppLayout.jsx
  styles/
    globals.css
```

---

## React Routing

### Routes

**Public:**
- `/` -> LandingPage
- `/about` -> AboutPage
- `/pricing` -> PricingPage
- `/login` -> LoginPage
- `/register` -> RegisterPage
- `/forgot-password` -> ForgotPasswordPage

**Protected (auth required):**
- `/dashboard` -> DashboardPage
- `/transactions` -> TransactionsPage
- `/alerts` -> AlertsPage
- `/statements/upload` -> UploadPage
- `/insights` -> InsightsPage
- `/profile` -> ProfilePage
- `/settings` -> SettingsPage

**Catch-all:**
- `*` -> NotFoundPage (404)

### Architecture

- `PublicLayout` wraps public pages (PublicNavbar + Footer)
- `AppLayout` wraps protected pages (AppNavbar + Footer)
- `ProtectedRoute` wrapper checks Supabase auth state, redirects to `/login` if not authenticated
- All navigation uses `<Link>` / `<NavLink>` from React Router (NOT `<a>` tags)
- RTL direction maintained on all pages

---

## Database Design (ERD)

### Entities (16 total)

| Entity | Description |
|---|---|
| **User** (`profiles`) | Application user, extends auth.users |
| **Session** | Login session history |
| **Account** | User's financial account |
| **Institution** | Financial institution (lookup) |
| **Transaction** | Financial transaction record |
| **Category** | Transaction category (global + custom) |
| **Merchant** | Vendor/payee in transactions |
| **Statement** | Uploaded financial document |
| **DocumentType** | Type of statement (lookup) |
| **UploadJob** | Statement processing workflow |
| **Alert** | System-generated notification |
| **AlertCategory** | Type of alert (lookup) |
| **AlertAction** | User action taken on alert (audit log) |
| **ChartDataPoint** | Aggregated data for dashboard charts |
| **QuickAction** | Dashboard quick action button (lookup) |
| **ActivityLog** | Full audit trail of user actions |

### Junction Tables (M:N)

- `user_institutions` - User <-> Institution
- `statement_alerts` - Statement <-> Alert
- `duplicate_transactions` - Transaction <-> Transaction (duplicate detection)

### Key Design Decisions

1. **Merchant as separate entity** - enables duplicate detection (killer feature) and logo/category defaults
2. **QuickAction as global lookup** - simpler for MVP; per-user customization deferred
3. **AlertAction as separate table (not JSON)** - immutable audit trail, queryable for analytics
4. **ActivityLog separate from Session** - Session = login window, ActivityLog = every meaningful action

### Data Type Mapping (simplified)

| Database Type | Simplified Type |
|---|---|
| UUID, VARCHAR, TEXT, ENUM | Text |
| DECIMAL, NUMERIC, INT | Number |
| BOOLEAN | Boolean |
| TIMESTAMP, DATE | Date |
| TEXT (file_url, avatar_url, logo_url, route) | URL |

### Relationships Summary

- **User** is central: 1:N with Accounts, Statements, Alerts, Sessions, ActivityLogs
- **Account** -> Transactions (1:N), ChartDataPoints (1:N), Alerts (1:N)
- **Statement** -> Transactions (1:N), UploadJob (1:1)
- **Transaction** -> Alerts (1:N) - for unusual/duplicate detection
- **Alert** -> AlertActions (1:N) - audit trail of user responses

---

## CRUD Matrix

Summary of what each entity supports:

| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| User | Self-signup (Guest only) | Own profile only | Own profile (name, password, avatar); tier via System/Admin | Soft Delete (self) / Hard Delete (Admin) |
| Session | Auto on login | Own sessions / All (Admin) | Immutable | Sign Out (self) |
| Account | User adds (Free: max 2, Pro: unlimited) | Own only (RLS) | Display name, icon, status | Soft Delete (archive) |
| Institution | Admin only | Public read | Admin only | Admin only (with dependency check) |
| Transaction | Manual (User) or Auto (System via AI) | Own only | Category, description, notes (not amount/date) | Soft Delete or mark as Excluded |
| Category | Global (Admin) or Custom (Pro only) | Global + own custom | Own custom only | Own custom only |
| Merchant | Auto (System) or Manual (User) | Authenticated read | Pro can merge duplicates | Admin only |
| Statement | User uploads (Free: 5/mo, Pro: unlimited) | Own only | Metadata only | Own (with cascade warning) |
| DocumentType | Admin only | Public read | Admin only | Admin only |
| UploadJob | Auto (System on upload start) | Own (via statement) | Step (System only) | Cancel (deletes file) |
| Alert | Auto (System AI/Rules) | Own only | Status (Mark Read / Save / Resolve) | Dismiss (Soft Delete) |
| AlertCategory | Admin only | Public read | Admin only | Admin only |
| AlertAction | Auto on button click | Own / All (Admin) | Immutable | Immutable |
| ChartDataPoint | Auto (System computed) | Own (via account) | System only | System auto on parent delete |
| QuickAction | Admin only | Public read | Admin only | Admin only |
| ActivityLog | Auto (System) | Own / All (Admin) | Immutable | Auto after 12 months retention |

---

## Authorization & Roles

### Roles

| Role | Symbol | Description |
|---|---|---|
| Guest | (none) | Not logged in |
| User | Free | Authenticated, free tier |
| Pro User | Pro | Authenticated, premium tier |
| Admin | Admin | System administrator |
| System | Auto | Automated processes (AI, cron) |

### Key Security Principles

1. **Row Level Security (RLS)** enforced on all user-owned tables via Supabase
2. **Soft Delete** for User, Account, Statement, Alert - 30-day recovery window
3. **Audit Trail Immutable** - ActivityLog, AlertAction, Session cannot be updated/deleted
4. **Principle of Least Privilege** - each role gets only required permissions
5. **Admin does NOT see financial data** of users (only metadata for support)
6. **Pro Feature Gating** at API level (middleware), not just UI

### Pro-Only Features

- Unlimited accounts and uploads
- Custom category creation
- Yield Optimization alerts
- Merchant merge capability
- Advanced analytics

---

## Supabase Implementation

### Status: Schema Complete

Full SQL schema has been provided to the user for execution in Supabase SQL Editor. Includes:

1. **ENUMs** - 9 custom types (user_tier, account_type, transaction_status, etc.)
2. **Tables** - 19 tables total (16 entities + 3 junction tables)
3. **Indexes** - performance indexes on all FK columns and frequently queried fields
4. **RLS Policies** - row-level security on all tables
5. **Seed Data** - institutions, document_types, alert_categories, global categories, quick_actions
6. **Triggers** - auto-update `updated_at`, auto-update account balance on transaction insert/delete, auto-create profile on signup

### Files to Reference

The full SQL was provided in chat (not committed to a `.sql` file yet). Sections:

1. **Part 1**: ENUMs + Core Tables (with `auth.users` integration via `profiles` table)
2. **Part 2**: Performance Indexes
3. **Part 3**: RLS Policies
4. **Part 4**: Seed Data
5. **Part 5**: Triggers & Helper Functions

### Storage Setup (Pending)

Need to create Supabase Storage bucket named `statements` for PDF/CSV/JPG/PNG uploads with appropriate RLS policies.

### auth.users Integration

- Supabase Auth handles authentication (email/password + Google SSO)
- `public.profiles` table extends `auth.users` via FK
- Trigger `on_auth_user_created` auto-creates profile row on signup

---

## Project Files & Directory Structure

```
/sessions/gifted-nice-pascal/mnt/LastWork/
|-- wireframes/                          # B&W low-fi wireframes
|   |-- styles.css
|   |-- index.html
|   |-- 01-login.html
|   |-- 02-dashboard.html
|   |-- 03-upload.html
|   `-- 04-alerts.html
|
|-- compass-frontend/                    # React app + high-fi mockups
|   |-- src/                             # React source (in progress)
|   |-- node_modules/
|   |-- dist/
|   |-- index.html                       # Vite entry
|   |-- vite.config.js
|   |-- package.json
|   |-- DESIGN.md
|   |-- landing-page.html                # High-fi Login mockup (Stitch)
|   |-- landing-page.png
|   |-- dashboard.html                   # High-fi Dashboard mockup
|   |-- dashboard.png
|   |-- data-upload.html                 # High-fi Upload mockup
|   |-- data-upload.png
|   |-- AlertsCenter.html                # High-fi Alerts mockup
|   |-- AlertsCenter.png
|   `-- .env.local
|
|-- stitch_compass_statement_upload_portal/  # Additional Stitch output
|
`-- context-claude.md                    # THIS FILE
```

### Notes on `compass-frontend/`

- This is the active React/Vite project
- Tailwind config is inline in each HTML mockup (not yet extracted to global config)
- `.env.local` exists for Supabase credentials
- Git initialized

---

## Outstanding Work & Next Steps

### Immediate Next Tasks

1. **Run Supabase SQL** - user needs to execute the SQL schema in Supabase SQL Editor
2. **Create Storage Bucket** - `statements` bucket with RLS for uploaded files
3. **Wire up Supabase Auth** in React app (email/password + Google SSO)
4. **Build base UI components** - Button, Input, Card, Tag, Divider (in `src/components/ui/`)
5. **Build shared layout** - PublicLayout, AppLayout, Navbars, Footer
6. **Translate HTML mockups to React** - using the per-page prompts already provided
7. **Set up React Router** with public/protected route separation

### Medium-term

- AI integration for statement processing (Supabase Edge Function + OpenAI/Claude)
- Alert generation engine (rules + AI)
- Hebrew localization (currently mockups are in English, need Hebrew translation)
- Test data seeding for development
- TypeScript migration (currently JSX)

### Deferred

- Mobile responsive refinement
- Onboarding flow
- Settings/Profile pages
- Admin panel
- Billing integration (Stripe/Paddle)

---

## Conventions & Working Style

### User Preferences (Important!)

1. **Hebrew responses with English technical terms** - the user (Elad) communicates in Hebrew but expects technical content in English
2. **Direct and structured output** - prefers tables, bullet lists, numbered steps
3. **TRUE low-fidelity wireframes when requested** - no styling, no colors, no emojis. Use `[placeholder]` brackets
4. **Documentation in chat, not in HTML files** - when wireframing, explain purpose/user actions/UI components/navigation IN the chat, not embedded in code
5. **Per-prompt format consistency** - when user shows example format, match it exactly
6. **No emojis in code/files** unless explicitly requested
7. **Prefers comprehensive deliverables** over piecemeal answers

### Communication Patterns

- User often shows an example and asks to apply the same pattern
- User wants both the "what" and the "why" - explain decisions briefly
- User is comfortable with technical depth (SQL, React, RLS policies)
- User reviews and gives critical feedback when something is off-target

### Critical User Feedback Examples

- "This is not low-fidelity wireframe" - rejected initial styled wireframes, demanded pure B&W skeletons
- "The directory changed to LastWork" - user manages their own file organization
- "Recommend yourself" - prefers agent to make decisions rather than ask too many questions

### Tools Used Throughout

- **Eraser.io** - flow diagrams, ERD
- **Google Stitch** - high-fidelity HTML/CSS mockups
- **Dribbble** - design inspiration (Soni Financial App)
- **Adobe Color / Coolors** - color extraction (recommended to user)
- **Supabase** - backend (Postgres + Auth + Storage)

---

## Quick Reference: Where to Find Things

| Need | Location |
|---|---|
| Wireframes (B&W) | `LastWork/wireframes/` |
| High-fi mockups | `LastWork/compass-frontend/*.html` |
| React source | `LastWork/compass-frontend/src/` |
| Design system colors | This file, "Design System" section |
| Database schema SQL | This file, "Supabase Implementation" + chat history |
| Component breakdown | This file, "Component Architecture" |
| Routing setup | This file, "React Routing" |
| Authorization rules | This file, "Authorization & Roles" |
| CRUD permissions | This file, "CRUD Matrix" |

---

## Final Notes for New Agent

- The user has invested significant time in planning and design - **respect prior decisions** before suggesting changes
- The user is building this as part of a school project ("עבודה מסכמת אפליקציה" - capstone application work)
- **Keep responses in Hebrew with English technical terms** unless user switches to English
- **Always check existing files** in `LastWork/` before creating new ones
- The `compass-frontend/` is the active development directory
- When in doubt about a design choice, refer to the high-fi mockups in `compass-frontend/*.html` - they represent the most current visual direction
- The user values **practical, actionable output** - SQL ready to run, prompts ready to paste, code ready to use

---

**End of Context Document**
