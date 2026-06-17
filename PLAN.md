# Compass — Fix/Build Plan

Ordered task list for closing the gaps found against `AGENT_CONTEXT.md` / `context-claude.md`.

---

## 1. Pricing page (real content)
- Replace the one-paragraph stub at `src/pages/PricingPage/PricingPage.jsx` with an actual Free vs Pro comparison table.
- Use copy from `context-claude.md`'s "Subscription Tiers" section (Free: 2 accounts / 5 uploads/mo / basic alerts; Pro: unlimited + Yield Optimization alerts + custom categories + merchant merge).
- Match existing design tokens/components (no new dependencies).

## 2. About page (real content)
- Replace the stub at `src/pages/AboutPage/AboutPage.jsx` with real product story: mission, the "Killer Feature" (Smart Alerts Center), target personas.
- Static content, no backend changes.

## 3. Fix Hebrew/English language button (footer)
- `src/components/shared/Footer/LanguageSwitcher.jsx` currently only flips local `useState` — doesn't translate anything or apply `dir="rtl"`.
- Make it functional: introduce a `LanguageContext` (or extend an existing context) that stores the selected language, persists it (localStorage), and applies `dir="rtl"`/`dir="ltr"` on `<html>`.
- Translate at minimum the navbar, page titles, and button labels — full i18n of every string is a stretch goal, not a blocker for "functional."
- Acceptance: clicking "עב" actually flips text direction and key labels to Hebrew; reload preserves the choice.

## 4. Google SSO
- Supabase Dashboard (manual, you'll need to do this part): enable Google provider under Auth → Providers, add OAuth client ID/secret from Google Cloud Console, set the redirect URL.
- `src/lib/auth.js`: add `signInWithGoogle()` calling `supabase.auth.signInWithOAuth({ provider: 'google' })`, respecting the existing mock/live auth toggle.
- `src/pages/LoginPage/LoginPage.jsx` (and `RegisterPage.jsx` if it has the same button): wire the currently-dead "Continue with Google" button's `onClick` to this function, with loading/error state.
- Verify: full OAuth redirect round-trip in the browser; confirm a `profiles` row gets created via the existing `on_auth_user_created` trigger.

## 5. OpenAI integration for AI-driven data
- **Blocked on you**: need an OpenAI API key before this can be built — will ask for it when this task starts.
- Today `src/lib/pdfParser.js` is 100% regex/string matching (`parseIsracard`, `parseCal`) and `guessCategory()` is keyword-rule-based; no AI exists anywhere in the app despite the docs calling for it.
- Build a Supabase Edge Function (so the key never reaches the client) that takes extracted statement text and returns structured transactions + categories via OpenAI.
- `parsePdfFile()` keeps the existing regex parsers as a fast-path for known formats (Isracard/Cal), and routes through the new Edge Function for unrecognized formats or to replace `guessCategory()`'s output with AI-classified categories.
- Set the key as a Supabase Edge Function secret (never committed to the repo or `.env.local`).

## 6. Pro/Free tier gating
- `src/context/AuthContext.jsx` currently hardcodes `tier: 'Free'` — read the real value from `profiles` instead.
- Add a `useTierLimits` hook exposing `{ tier, maxAccounts, maxUploadsPerMonth, canUseCustomCategories, canMergeMerchants }`.
- Enforce at the actual action points: `NewAccountForm` (max 2 accounts on Free), Upload flow (max 5 statements/month on Free).
- Add a reusable "upgrade prompt" UI linking to `/pricing`.
- Note: client-side gating is UX only — true enforcement needs a server-side check (RLS/trigger) as a follow-up if time allows.

## 7. Admin role/panel
- Add `role` (or extend `tier`) enum value `'Admin'` on `profiles` (manual SQL, run by you — there's no self-serve path to create an Admin).
- Expose `isAdmin` from `AuthContext`; add an `AdminRoute` guard parallel to `ProtectedRoute`.
- Build a minimal Admin page for Institution Management (list/create/edit/delete `institutions` rows) — this directly unblocks the RLS wall hit earlier when trying to add Israeli banks by hand.
- Document Type / Alert Category management are the same CRUD shape — lower priority, build only if time allows.
- Needs a decision before building: how Admin bypasses RLS — a Postgres `is_admin()` helper used in policies, vs. a service-role Edge Function for admin writes.

## 8. Soft delete / audit trail
- DB migration (run by you in SQL editor): add `deleted_at timestamptz` to `profiles`, `accounts`, `alerts`; add an `activity_log` table (`user_id, action, entity, entity_id, created_at`).
- Update `SELECT` RLS policies on those tables to filter `deleted_at IS NULL` by default.
- Replace existing hard-delete calls (account archive, alert dismiss) with `update({ deleted_at: now() })`.
- Add a lightweight `logActivity()` helper called from key mutations (account create, statement upload, alert dismiss).
- Admin panel (#7) gets a simple read-only Activity Log viewer.

## 9. End-to-end test of all components (last)
- Walk every route in `src/App.jsx` live in the browser as a fresh, then an existing, user: Landing, About, Pricing, Login, Register, Forgot Password, Dashboard, Transactions, Alerts, Upload (both account-creation and existing-account paths), Insights, Profile, Settings, 404.
- Specifically re-verify the two previously-fixed bugs (empty chart for new users, account creation unblocking upload) and everything fixed in this plan (Pricing/About content, language switch, Google SSO, OpenAI parsing, tier limits, Admin panel, soft delete) still works together with no regressions.
- Check console/network for errors on each page via Preview tools.
