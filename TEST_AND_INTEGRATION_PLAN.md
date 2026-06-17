# Compass — Test, Fix & Google Integration Plan

## Overview

This plan covers three sequential phases:
1. **Test all existing logic** (auth, routing, data hooks, UI)
2. **Fix missing/stub pages** (pages that are placeholders)
3. **Wire up Google OAuth** via Supabase

---

## Phase 1 — Test All Logic

### 1.1 Auth Flow (Mock + Live)

| Test | How | Expected |
|------|-----|----------|
| Mock login (`VITE_USE_MOCK_AUTH=true`) | Set env, run dev server, go to `/login`, submit any credentials | Redirects to `/dashboard`, user shows "Mock User" |
| Mock sign-up | Go to `/register`, fill form | Creates mock session, redirects `/dashboard` |
| Mock logout | Click sign out in navbar | Session cleared, redirected to `/` or `/login` |
| Protected route guard | Logged out, navigate to `/dashboard` directly | Redirected to `/login` (check `ProtectedRoute.jsx`) |
| Live login | Set `VITE_USE_MOCK_AUTH=false`, use real Supabase credentials | Real session created, profile loaded from `profiles` table |
| Live register + profile upsert | Register new account | Supabase trigger creates `profiles` row; `RegisterPage` then UPDATEs `display_name` + `first_name` |
| Email confirmation handling | Register with Supabase email-confirm ON | Shows "check your email" message instead of redirecting |

### 1.2 Routing

| Test | Expected |
|------|----------|
| `/` → LandingPage | Renders with PublicNavbar + Footer |
| `/about` | Renders AboutPage |
| `/pricing` | Renders PricingPage |
| `/login` | Renders LoginPage with form + Google button |
| `/register` | Renders RegisterPage |
| `/forgot-password` | Renders ForgotPasswordPage (currently stub — see Phase 2) |
| `/dashboard` (authenticated) | Renders DashboardPage |
| `/alerts` (authenticated) | Renders AlertsPage with live stats |
| `/statements/upload` or `/upload` | Renders UploadPage |
| `/transactions` | Renders TransactionsPage (stub — see Phase 2) |
| `/insights` | Renders InsightsPage (stub — see Phase 2) |
| `/profile` | Renders ProfilePage (stub — see Phase 2) |
| `/settings` | Renders SettingsPage (stub — see Phase 2) |
| `/anything-else` | Renders NotFoundPage |

### 1.3 Data Hooks (live Supabase only)

Test each hook with real data. Enable `VITE_USE_MOCK_AUTH=false` and log in with a seeded account.

| Hook | File | What to verify |
|------|------|----------------|
| `useAccounts` | `src/hooks/useAccounts.js` | Returns accounts for the logged-in user; KPI totals on Dashboard match |
| `useTransactions` | `src/hooks/useTransactions.js` | Transactions list renders with merchant names and category tags |
| `useAlerts` | `src/hooks/useAlerts.js` | Alert count badge in navbar + stats banner on AlertsPage are accurate |
| `useChartData` | `src/hooks/useChartData.js` | Charts on Dashboard render without errors |

**RLS sanity check**: Log in as User A and confirm you cannot see User B's data (use two accounts).

### 1.4 UI Components Smoke Test

Run the dev server and manually navigate to every page. Check:
- [ ] No console errors
- [ ] Fonts (Manrope) load correctly
- [ ] CSS variables resolve (dark navy background, lime green accents)
- [ ] `LoadingSpinner` appears while data hooks are fetching
- [ ] Empty states render when no data exists
- [ ] `ToastNotification` fires for success/error events
- [ ] `Modal` opens and closes correctly
- [ ] `AlertsPage` filter chips filter the alerts list

---

## Phase 2 — Fix Missing / Stub Pages

The following pages are stubs (render a heading + placeholder text). Each needs to be built out based on the wireframes and design system.

### 2.1 `ForgotPasswordPage` (`/forgot-password`)

**What's needed:**
- Email input field (reuse `Input` component)
- "Send Reset Link" button (reuse `Button` variant="primary")
- Call `supabase.auth.resetPasswordForEmail(email)` on submit
- Success state: "Check your email for a password reset link."
- Error state: surface Supabase error message

**Reference:** `src/pages/LoginPage/LoginPage.jsx` — follow the same card + glassmorphism layout.

### 2.2 `TransactionsPage` (`/transactions`)

**What's needed:**
- `PageHeaderSection` with title "Transactions" and date range filter
- `useTransactions` hook already exists — wire it up
- Full-page transactions table (reuse `TransactionListItem` + `PaginationSection`)
- Search/filter bar using `Input` + `FilterChip` components
- Empty state for no transactions

**Reference:** wireframe `02-dashboard.html` (transactions section) and the existing `RecentTransactionsSection` component on Dashboard.

### 2.3 `InsightsPage` (`/insights`)

**What's needed:**
- `PageHeaderSection` with title "Insights"
- Summary cards with spending trends (reuse `KPICard` / `StatsCard`)
- Expense chart (reuse `ExpenseChartSection`)
- Category breakdown (reuse `ChartsRowSection`)

**Reference:** `src/components/ChartsRowSection/` and `src/components/ExpenseChartSection/` already built for Dashboard — compose them here.

### 2.4 `ProfilePage` (`/profile`)

**What's needed:**
- Avatar + user name/email from `useAuth()` context
- Edit form for `display_name`, `first_name` (reuse `Input` + `Button`)
- On save: `supabase.from('profiles').update(...)` then call `fetchProfile()` from context
- Success toast on save

### 2.5 `SettingsPage` (`/settings`)

**What's needed:**
- Sections for: Notifications, Security, Appearance
- Toggle for email notification preferences
- Change password form (call `supabase.auth.updateUser({ password })`)
- Language switcher (RTL/LTR — already built in `Footer/LanguageSwitcher.jsx`)
- Danger Zone: Delete account (guarded by confirmation modal)

---

## Phase 3 — Google OAuth Integration

The "Continue with Google" button exists on both `LoginPage` and `RegisterPage` (IDs: `google-signin-btn`, `google-signup-btn`) but has no handler. Here is the full integration plan.

### 3.1 Supabase Console Setup

1. Go to **Supabase Dashboard → Authentication → Providers → Google**
2. Enable the Google provider
3. Copy the **Supabase Callback URL** (format: `https://<project-ref>.supabase.co/auth/v1/callback`)
4. Go to **Google Cloud Console → APIs & Services → OAuth 2.0 Credentials**
5. Create an OAuth 2.0 Client ID (Web application type)
6. Add the Supabase callback URL as an **Authorized Redirect URI**
7. Copy the **Client ID** and **Client Secret** back into Supabase Google provider settings

### 3.2 Code Changes

#### `src/lib/auth.js` — add `signInWithGoogle`

```js
async signInWithGoogle() {
  if (USE_MOCK_AUTH) {
    // Simulate a Google sign-in in mock mode
    const session = {
      user: { id: 'mock-google-user', email: 'google@example.com' },
      access_token: 'mock-google-token',
    }
    setMockSession(session)
    return { data: { session }, error: null }
  }
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
},
```

#### `src/pages/LoginPage/LoginPage.jsx` — wire the button

```jsx
async function handleGoogleSignIn() {
  const { error } = await auth.signInWithGoogle()
  if (error) setError(error.message)
}

// On the button:
<button
  type="button"
  className={styles.socialBtn}
  id="google-signin-btn"
  onClick={handleGoogleSignIn}
>
```

#### `src/pages/RegisterPage/RegisterPage.jsx` — same pattern

```jsx
async function handleGoogleSignUp() {
  const { error } = await auth.signInWithGoogle()
  if (error) setError(error.message)
}
```

#### `src/context/AuthContext.jsx` — handle OAuth callback

The `onAuthStateChange` listener already fires on OAuth return — no changes needed. Supabase automatically creates a session after the redirect. However, for OAuth users the `profiles` row may not have `display_name`. Add a guard:

```js
// In fetchProfile, after getting data:
if (data && !data.display_name && session?.user?.user_metadata?.full_name) {
  const fullName = session.user.user_metadata.full_name
  await supabase.from('profiles').update({
    display_name: fullName,
    first_name: fullName.split(' ')[0],
  }).eq('user_id', userId)
  setProfile({ ...data, display_name: fullName, first_name: fullName.split(' ')[0] })
}
```

### 3.3 Verify End-to-End

1. Start dev server (`npm run dev`)
2. Navigate to `/login`
3. Click "Continue with Google"
4. Complete Google's consent screen
5. Confirm redirect lands on `/dashboard`
6. Confirm the navbar avatar and welcome header show the user's Google name
7. Confirm `profiles` table in Supabase has the correct row

### 3.4 Mock Auth Compatibility

When `VITE_USE_MOCK_AUTH=true`, the Google button should use the mock session defined in step 3.2 above — no browser redirect, instant mock session. This lets UI testing continue without a live Google account.

---

## Execution Order

```
Phase 1 → Run and smoke-test everything that's already built
Phase 2 → Build out stub pages one at a time, re-test after each
Phase 3 → Add Google OAuth (Supabase config first, then code changes)
```

## Files That Will Change

| File | Change |
|------|--------|
| `src/lib/auth.js` | Add `signInWithGoogle` method |
| `src/pages/LoginPage/LoginPage.jsx` | Wire Google button `onClick` |
| `src/pages/RegisterPage/RegisterPage.jsx` | Wire Google button `onClick` |
| `src/context/AuthContext.jsx` | Guard for OAuth user profile display name |
| `src/pages/ForgotPasswordPage/ForgotPasswordPage.jsx` | Full implementation |
| `src/pages/TransactionsPage/TransactionsPage.jsx` | Full implementation |
| `src/pages/InsightsPage/InsightsPage.jsx` | Full implementation |
| `src/pages/ProfilePage/ProfilePage.jsx` | Full implementation |
| `src/pages/SettingsPage/SettingsPage.jsx` | Full implementation |
