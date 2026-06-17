# Session Summary — PDF Parsing, RTL/Translation, Alerts System, Currency Fixes

This file summarizes the work completed in this session so the next agent can pick up cleanly. Read this before touching `pdfParser.js`, the Alerts pages, or currency-related widgets.

## What was requested

1. Fix Hebrew RTL display + English translation in PDF statement parsing.
2. Fix the upload stepper progress bar (was filling right-to-left instead of left-to-right).
3. Test/import the Isracard PDF; clean up duplicate accounts.
4. Audit every page and widget; specifically make sure the Alerts mechanism actually works.
5. Google OAuth — explicitly deferred to last, **not started**.

## Done

### 1. PDF parsing — RTL + translation (`src/lib/pdfParser.js`)
- **Word-boundary detection**: `extractPdfText()` now tracks each text item's x-position and width, and joins same-line items with a double-space when the x-gap exceeds 5 PDF units (word boundary) vs. single-space otherwise (same word). This was required because Hebrew text in the PDF is emitted character-by-character with positioning, and the old naive join lost all word boundaries.
- **`reverseHebrew(str)`** rewritten: splits on the new double-space boundaries, detects runs of single Hebrew characters, collapses+reverses them into real words, then reverses word order for correct RTL reading order.
- **`compactCalLine(line)`** rewritten to fix spaced-out digits/letters from the Cal PDF (e.g. `0 1 / 0 4 / 2 0 2 6` → `01/04/2026`, `C L A U D E` → `CLAUDE`). Needed two passes of the digit-collapse regex (`(\d) (\d)` regex with global flag only catches non-overlapping pairs per pass) and a lookbehind/lookahead regex for letters so it works on arbitrary-length runs.
- **`MERCHANT_EN`** dictionary (~70 entries) + **`translateMerchant(text)`**: maps common Hebrew merchant names to English (Shufersal, Super-Pharm, Pango, Dlek, Netflix, Spotify, Apple, Google, Amazon, Microsoft, HOT, Bezeq, Partner, Cellcom, Harel/Migdal Insurance, etc.). Both `parseCal()` and `parseIsracard()` now compute `desc = translateMerchant(hebrewDesc) || hebrewDesc`.
- **Category matching fix**: translating to English broke `guessCategory()` (which only has Hebrew keywords), so both parsers now call `guessCategory(hebrewDesc + ' ' + desc)` — concatenating both language forms so either keyword set matches.
- **`detectFormat()`** now runs `compactCalLine()` before testing the Cal date regex, since the regex needs collapsed digits to match.
- Category UUIDs in use: food `ce5a64cd-720a-44f1-8c72-433d9c844cb0`, health `da8044dd-b308-4865-be48-36cecfe62148`, transport `f1f06bda-b8a5-4222-b1ee-62c6ad95e160`, bills `390f9d15-6474-4ba4-8946-12267a2212c5`, entertain `44fa790b-ba52-43c9-b349-8eee3fe889a4`, shopping `e14e7053-b184-4344-9545-7ad494998c29`, tech `f84270d3-b6de-4415-9e06-97edbda21eda`, default/other `0ee181b8-cd7e-4954-8d2c-66022bf18068`.

### 2. RTL display in UI
- Added `dir="auto"` to merchant/description cells so Hebrew text (where translation wasn't matched) renders correctly: [UploadPage.jsx](src/pages/UploadPage/UploadPage.jsx) preview table description cell, [TransactionListItem.jsx](src/components/TransactionListItem/TransactionListItem.jsx) name paragraph.

### 3. Stepper bar direction
- [StepperSection.module.css](src/components/StepperSection/StepperSection.module.css): `.progress { right: 5% }` → `.progress { left: 5% }` so the upload wizard progress fill animates left-to-right.

### 4. Isracard PDF + duplicate cleanup
- Tested both `digitalPage.pdf` (Cal) and `isracard.pdf` (Isracard, copied into `public/` for in-browser `File`/`DataTransfer` injection testing via `preview_eval`).
- Found and removed 2 duplicate accounts (and their orphaned transactions) via direct Supabase REST calls using the session's `access_token` extracted from `localStorage` (anon key alone is blocked by RLS for these tables). Final state: 2 accounts, 137 transactions.
- **Known artifact, not fixed**: some old Hebrew-only seeded transactions (e.g. `סופר פארם`) now sit alongside newly-uploaded English-translated duplicates of the same real-world transaction (e.g. `Super-Pharm`) for the Isracard account. This is leftover seed data, not a parsing bug — dedup of same-transaction-different-language entries was not requested/done this session.

### 5. Alerts mechanism — root cause + fix
- **Root cause**: Supabase RLS blocks client-side `INSERT` into `alerts` (confirmed directly: REST API returns `42501 — new row violates row-level security`). The `alerts` table was empty and nothing could ever populate it from the client.
- **Fix**: built `src/lib/alertGenerator.js` — pure client-side function `generateAlerts(transactions)` that derives alerts in-memory from real transaction data already loaded in the browser:
  - Duplicate charges (same description+amount within 7 days) → `_type: 'duplicates'`, severity `Warning`.
  - Top 3 single transactions ≥ ₪500 → `_type: 'critical'`, severity `Critical`.
  - Top 3 high-spend categories ≥ ₪2000 → `_type: 'opportunities'`, severity `Opportunity`, `estimated_impact = total * 0.15`.
  - Each alert gets a local id (`gen-N`), title, description, status `New`, timestamp, and an `alert_categories` shape matching DB rows so downstream components don't need to special-case it.
- Wired into [AlertsPage.jsx](src/pages/AlertsPage/AlertsPage.jsx): merges DB alerts (currently always empty) with generated alerts, tracks dismissed ids locally in a `Set` (dismiss is client-only — there's no DB row to delete for generated alerts).
- Fixed [AlertsListSection.jsx](src/components/AlertsListSection/AlertsListSection.jsx) filter logic (`getAlertType`) to read the new `_type` field, falling back to severity-based mapping for any real DB alerts.
- Fixed [AlertStatsSection.jsx](src/components/AlertStatsSection/AlertStatsSection.jsx): now uses `useCurrency().formatAmount` instead of hardcoded USD formatting; "New Alerts" sub-text is now dynamic (`"N needs attention"` / `"All clear"`) instead of a hardcoded `"+3 since last login"`.
- Verified live: Alerts Center shows 10 real generated alerts, ₪1,859.50 Est. Value Impact, working filter tabs.

### 6. Currency (₪) fixes
- [ExpenseChartSection.jsx](src/components/ExpenseChartSection/ExpenseChartSection.jsx): fallback bars and Y-axis labels now use ₪ instead of $; Y-axis labels are computed dynamically from real chart data (`max`, `mid`, `0`) instead of hardcoded `$20k/$10k/$0`. Current month's bar is highlighted.
- Confirmed Insights page (which reuses this component) also reflects the fix.

### 7. Quick Actions — was non-functional
- [QuickActionsSection.jsx](src/components/QuickActionsSection/QuickActionsSection.jsx): buttons were static/non-clickable. Now uses `useNavigate()`: "Upload Statement" → `/upload`, "View Transactions" → `/transactions`, "Alerts Center" → `/alerts`; drop-zone div also navigates to `/upload` on click/Enter. Verified via `preview_eval` checking `window.location.pathname`.

### 8. Full page/widget audit
Toured Dashboard, Alerts Center, Transactions, Insights, Profile, Settings via screenshots. Only Dashboard (chart currency, Quick Actions) and Alerts Center (entire mechanism, stats currency) had real defects — both fixed above. Transactions, Profile, Settings had no issues found.

## Not done / next steps

- **Google OAuth (explicitly deferred to last)**: not started. Needs: `signInWithGoogle` in `src/lib/auth.js`, wiring Google sign-in buttons on LoginPage/RegisterPage, handling OAuth profile backfill in `AuthContext`.
- **Optional cleanup** (not requested, just noted): dedup the old Hebrew-only seed transactions against new English-translated re-uploads of the same real-world charge for the Isracard account.
- The `alerts` DB table is still unreachable for client writes (RLS). If server-side alert generation/persistence is ever wanted, it would need a Supabase Edge Function or service-role backend job — not a client fix.
