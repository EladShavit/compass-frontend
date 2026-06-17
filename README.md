# Compass — Personal Finance Management Platform

Compass is a bilingual (Hebrew/English) personal finance management web application. Users upload bank statements, which are parsed by AI to extract transactions automatically. The app surfaces spending insights, alerts, and trends through a clean dashboard — without ever connecting directly to a bank.

---

## What the Application Does

| Feature | Description |
|---------|-------------|
| **Statement Upload** | 4-step wizard to upload PDF bank statements. AI extracts transactions automatically using OpenAI. |
| **Dashboard** | KPI cards (total balance, savings, monthly expenses with % badges), spending trends bar chart, and recent transactions table. |
| **Alerts Center** | Proactive alerts for unusual charges, duplicate billings, and optimization opportunities. Filterable by severity. |
| **Insights** | AI-powered spending breakdown — stat cards, 6-month trend chart, and category breakdown. Pro-tier only. |
| **Transactions** | Full searchable, filterable transaction list with merchant names, categories, dates, and amounts. |
| **Pro / Free Tiers** | Free users get limited accounts and uploads. Pro unlocks unlimited uploads, AI insights, and more via Stripe subscription. |
| **Bilingual UI** | Full Hebrew (RTL) and English (LTR) support across all pages, toggled from the footer. |
| **Auth** | Email/password and Google SSO via Supabase Auth. |

---

## Tech Stack & Third-Party Integrations

| Service / Library | Category | Purpose |
|-------------------|----------|---------|
| **React 18** | Frontend Framework | UI rendering, component model |
| **Vite 5** | Build Tool | Dev server, bundling, HMR |
| **React Router DOM v6** | Routing | Client-side SPA navigation |
| **Supabase** | Backend-as-a-Service | PostgreSQL database, Auth (email + Google SSO), Row-Level Security, Storage |
| **Supabase Edge Functions** | Serverless | Deno-based server-side functions for secrets and webhooks |
| **OpenAI (gpt-4o-mini)** | AI / ML | PDF statement parsing — extracts date, amount, description, direction from raw text |
| **Stripe** | Payments | Subscription checkout (Pro tier at ₪39.90/month), webhook for tier updates |
| **pdfjs-dist** | PDF Parsing | Client-side PDF text extraction before sending to AI |
| **Google OAuth** | Authentication | Sign in with Google via Supabase Auth provider |
| **Vercel** | Hosting / Deployment | Static hosting with SPA rewrite rules |
| **Material Symbols (Google Fonts)** | Icons | Icon set loaded via CDN |

---

## Project Structure

```
compass-frontend/
├── public/                        # Static assets
├── supabase/
│   └── functions/
│       ├── parse-statement/       # Edge Function: AI PDF parsing via OpenAI
│       ├── create-checkout-session/ # Edge Function: Stripe checkout session
│       └── stripe-webhook/        # Edge Function: Stripe webhook → tier update
├── src/
│   ├── App.jsx                    # Route definitions (public, protected, adaptive)
│   ├── main.jsx                   # React entry point
│   ├── styles/                    # Global CSS variables and tokens
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx       # Public navbar + footer (unauthenticated)
│   │   ├── AppLayout.jsx          # App navbar + footer (authenticated)
│   │   └── AdaptiveLayout.jsx     # Switches navbar based on auth state
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        # Session, user profile, tier state
│   │   ├── LanguageContext.jsx    # i18n — all EN/HE translations + t(), tCat(), tMonth()
│   │   └── CurrencyContext.jsx    # Currency formatting (ILS default)
│   │
│   ├── lib/
│   │   ├── supabase.js            # Supabase client
│   │   ├── auth.js                # Auth helpers (signIn, signOut, OAuth)
│   │   ├── stripe.js              # redirectToCheckout() via Edge Function
│   │   ├── pdfParser.js           # PDF → text → AI transaction extraction
│   │   └── alertGenerator.js      # Client-side alert generation logic
│   │
│   ├── hooks/
│   │   ├── useAccounts.js         # Fetch user accounts from Supabase
│   │   ├── useTransactions.js     # Fetch transactions with limit param
│   │   ├── useAlerts.js           # Fetch + dismiss alerts
│   │   ├── useChartData.js        # Fetch monthly chart_data_points
│   │   └── useTier.js             # isPro / isFree / limits from profile
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   ├── AppNavbar/         # Authenticated navbar with user avatar menu
│   │   │   ├── PublicNavbar/      # Marketing navbar (Home, About, Pricing)
│   │   │   └── Footer/            # Footer with language toggle + links
│   │   ├── KPICard/               # Dashboard metric card with badge + tooltip
│   │   ├── KPIStatsSection/       # Renders 3 KPI cards with computed metrics
│   │   ├── ExpenseChartSection/   # Bar chart — spending trends with avg line
│   │   ├── RecentTransactionsSection/ # Transaction table component
│   │   ├── AlertsBannerSection/   # Dismissable alert banners on dashboard
│   │   ├── AlertsListSection/     # Full alert list with filter/sort
│   │   ├── ProGate/               # Blurs content + upgrade CTA for Free users
│   │   └── ...                    # 40+ additional UI components
│   │
│   └── pages/
│       ├── LandingPage/           # Marketing homepage
│       ├── LoginPage/             # Email + Google SSO login
│       ├── RegisterPage/          # Sign up
│       ├── ForgotPasswordPage/    # Password reset
│       ├── DashboardPage/         # Main authenticated dashboard
│       ├── AlertsPage/            # Full alerts center
│       ├── InsightsPage/          # AI insights (Pro-gated)
│       ├── TransactionsPage/      # Full transaction list with search/filter
│       ├── UploadPage/            # 4-step statement upload wizard
│       ├── SettingsPage/          # Currency, notifications, security
│       ├── ProfilePage/           # User profile editor
│       ├── PricingPage/           # Free vs Pro plan comparison
│       ├── UpgradePage/           # Pro upgrade CTA → Stripe checkout
│       ├── AboutPage/             # Company/product info
│       ├── PrivacyPage/           # Privacy policy
│       ├── TermsPage/             # Terms of service
│       ├── ContactPage/           # Contact form
│       └── NotFoundPage/          # 404
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_USE_MOCK_AUTH=false
```

Supabase Edge Function secrets (set via Supabase dashboard → Settings → Secrets):

```
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Deployment

The app is deployed on **Vercel**. A `vercel.json` at the root rewrites all routes to `index.html` for SPA support:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

After deploying, add your Vercel URL to **Supabase → Authentication → URL Configuration** as both the Site URL and a redirect URL.
