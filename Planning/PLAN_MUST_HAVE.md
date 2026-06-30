# Compass — Road to Production

Last updated: 2026-06-28

---

## Status Legend
- ✅ Done
- 🔄 In progress
- ⬜ Not started

---

## Already Shipped
- ✅ Landing page, About, Pricing, Privacy, Terms, Contact
- ✅ Email + Google SSO auth
- ✅ CSV / Excel / PDF statement upload with column mapping
- ✅ AI-powered statement parsing (OpenAI, server-side via Edge Function)
- ✅ Manual transaction entry
- ✅ Transaction table with filters
- ✅ Alerts center (DB alerts + client-generated: duplicates, large charges, high category spending)
- ✅ Alert review modal + dismiss with localStorage persistence
- ✅ Notification bell with dropdown
- ✅ AI chat assistant (Compass AI floating widget)
- ✅ Pro / Free tier gating with ProGate component
- ✅ 14-day free trial (auto-derived from signup date)
- ✅ Trial banner with countdown
- ✅ Full EN / HE i18n with RTL support
- ✅ Upgrade flow (Stripe)

---

## Must-Have — Feature Completeness

### 1. Onboarding Flow
**Priority: Critical** | ⬜ Not started

New users land on an empty dashboard with no guidance. Without onboarding, activation will be low.

**Steps:**
- Step 1 — Welcome: explain upload → analyze → insights
- Step 2 — Add first account (name + type)
- Step 3 — Upload first statement (links to /upload)
- Step 4 — Done: redirect to dashboard

**Implementation:**
- Add `onboarding_complete` boolean to `profiles` table
- New route `/onboarding` — full-page wizard, not in AppLayout navbar
- `ProtectedRoute` redirects new users to `/onboarding` when flag is false
- Skip button at each step

**Files:**
- `src/pages/OnboardingPage/OnboardingPage.jsx` (new)
- `src/components/routing/ProtectedRoute.jsx` — add onboarding redirect
- `supabase/migrations/add_onboarding_complete_to_profiles.sql`

---

### 2. Wire Spending Trend Chart
**Priority: Critical** | ⬜ Not started

The dashboard trend chart shows "no data yet" even when transactions exist. First thing users see after login.

**Features:**
- Last 6 months of debits per month as a bar chart
- Separate income vs expense bars
- Tooltip with month + total
- Fallback only when zero transactions exist

**Files:**
- `src/hooks/useChartData.js` — wire to real transactions
- `src/components/ExpenseChartSection/ExpenseChartSection.jsx`
- `src/components/ChartsRowSection/ChartsRowSection.jsx`

---

### 3. Budget Setting
**Priority: High** | ⬜ Not started

Without budgets, alerts have no target and the app feels passive.

**Features:**
- Per-category monthly budget (e.g. Food: ₪2,000/month)
- Budget progress bars on Insights page
- Auto-alert when spending exceeds 80% of budget

**Implementation:**
- New `budgets` table: `id, user_id, category_id, monthly_limit, created_at` + RLS
- Budget management UI on Settings page
- `alertGenerator.js`: add over-budget alert rule

**Files:**
- `supabase/migrations/create_budgets_table.sql`
- `src/hooks/useBudgets.js` (new)
- `src/components/BudgetProgressSection/BudgetProgressSection.jsx` (new)
- `src/lib/alertGenerator.js` — add budget rule
- `src/pages/SettingsPage/SettingsPage.jsx` — budget section

---

### 4. Settings Page
**Priority: High** | ⬜ Not started

Currently a placeholder. Users need control over their preferences.

**Sections:**
- **Budgets** — inline with item #3
- **Notifications** — toggle email alerts for Critical / Warning severity
- **Display** — default currency (ILS / USD / EUR), language (sync to DB)
- **Danger zone** — delete account

**Implementation:**
- Add to `profiles`: `notify_critical`, `notify_warning`, `preferred_currency`
- Delete account: Edge Function `delete-account` that anonymizes data then calls `auth.admin.deleteUser`

**Files:**
- `src/pages/SettingsPage/SettingsPage.jsx` — full implementation (new)
- `src/pages/SettingsPage/SettingsPage.module.css` (new)
- `supabase/migrations/add_settings_to_profiles.sql`
- `supabase/functions/delete-account/index.ts` (new)

---

### 5. Profile Page
**Priority: Medium** | ⬜ Not started

**Features:**
- Display name edit
- Avatar upload → Supabase Storage `avatars` bucket
- Password change (email accounts only, hidden for OAuth)
- Plan badge (Free / Trial / Pro) with upgrade CTA

**Files:**
- `src/pages/ProfilePage/ProfilePage.jsx` (new — currently empty)
- `src/pages/ProfilePage/ProfilePage.module.css` (new)

---

### 6. Export to CSV
**Priority: Medium** | ⬜ Not started

Data portability is a trust signal and legally expected.

**Features:**
- Export button on Transactions page
- Respects active filters
- Columns: Date, Description, Amount, Direction, Category, Account

**Implementation:** Pure client-side using `papaparse` (already installed).

**Files:**
- `src/lib/exportCsv.js` (new)
- `src/pages/TransactionsPage/TransactionsPage.jsx` — add export button

---

## Must-Have — Production Readiness

These are non-feature items that must be in place before real users and real money are involved.

### 7. Error Boundaries
**Priority: Critical** | ⬜ Not started

Currently a crash in any component takes down the whole page with a blank screen.

- Add React `ErrorBoundary` wrapper around major sections (Dashboard, Alerts, ChatWidget, Upload)
- Show a friendly "Something went wrong" fallback with a reload button
- Log errors to console (or Sentry if added)

**Files:**
- `src/components/ErrorBoundary/ErrorBoundary.jsx` (new)
- Wrap sections in `src/layouts/AppLayout.jsx` and key pages

---

### 8. Loading & Empty States
**Priority: High** | ⬜ Partially done

Several sections show nothing (no spinner, no message) while data loads or when empty.

- Dashboard: skeleton cards while KPIs load
- Transactions: spinner + "No transactions yet. Upload a statement." empty state
- Alerts: "You're all clear" empty state when no alerts
- Insights: explicit "Upload data to unlock insights" when no transactions

---

### 9. Environment Configuration for Production
**Priority: Critical** | ⬜ Not started

Currently the app runs on a single Supabase project with no separation.

- Create a **production** Supabase project (separate from dev)
- Set production env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Disable Supabase email confirmations in dev; enable + configure SMTP in prod
- Set `OPENAI_API_KEY` secret on the production Supabase project
- Set Stripe keys for production in Supabase secrets
- Add `VITE_STRIPE_PUBLISHABLE_KEY` for prod

---

### 10. Domain & Hosting
**Priority: Critical** | ⬜ Not started

- Deploy frontend to Vercel / Netlify / Cloudflare Pages
- Point custom domain (e.g. `compass-finance.app`)
- Set Supabase `Site URL` and `Redirect URLs` to production domain
- Enable HTTPS (automatic on all above platforms)
- Set `Content-Security-Policy` headers

---

### 11. Rate Limiting on Edge Functions
**Priority: High** | ⬜ Not started

`ai-chat` and `parse-statement` have no rate limiting — a single user could exhaust the OpenAI budget.

- Add per-user rate limit: max 20 AI chat messages / hour
- Add per-user rate limit: max 10 parse-statement calls / day
- Implement using Supabase DB counter + timestamp check at the top of each function

**Files:**
- `supabase/functions/ai-chat/index.ts` — add rate limit check
- `supabase/functions/parse-statement/index.ts` — add rate limit check
- `supabase/migrations/create_rate_limits_table.sql`

---

### 12. RLS Audit
**Priority: Critical** | ⬜ Not started

Every table must have RLS policies verified before production.

- Run through all tables: `transactions`, `accounts`, `categories`, `alerts`, `chat_messages`, `profiles`, `budgets`
- Verify no table allows cross-user data access
- Test with two different user sessions to confirm isolation
- Check that service-role key is never used client-side

---

### 13. Stripe Webhook Verification
**Priority: High** | ⬜ Not started

The Stripe webhook that upgrades users to Pro must verify the `Stripe-Signature` header to prevent spoofed upgrade requests.

- Verify the existing Stripe Edge Function uses `stripe.webhooks.constructEvent()`
- Add `STRIPE_WEBHOOK_SECRET` to Supabase secrets

---

## Backlog (post-launch)

- **Email alerts** — Resend + Supabase Edge Function, triggered when Critical alert fires
- **Recurring/subscription detection** — same merchant + similar amount monthly = subscription tag
- **Multi-month insights** — date range picker on Insights page
- **Admin panel** — institution management, user management
- **Soft delete + audit trail** — `deleted_at` columns, `audit_log` table
- **PWA / mobile** — service worker, install prompt, offline support
- **Sentry / error monitoring** — capture runtime errors in production
- **Analytics** — PostHog or Mixpanel for funnel tracking (signup → upload → insight)
