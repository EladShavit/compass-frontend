# Feature Plan — AI Chat & Extended Data Entry

---

## Feature 1: AI Financial Chat

### Overview
A floating chat interface that lets users ask natural-language questions about their own financial data (transactions, spending, trends, alerts). The AI has read access to the user's data via a Supabase Edge Function and responds with answers grounded in real numbers, not hallucinations.

**Examples of questions users can ask:**
- "How much did I spend on food this month?"
- "What were my biggest expenses in April?"
- "Am I spending more than last month?"
- "Show me all charges from Shufersal"
- "What's my average monthly spending?"

---

### Architecture

```
User types message
      ↓
ChatWidget (React) — sends message + user context
      ↓
Supabase Edge Function: ai-chat
      ↓
  1. Authenticate user via JWT (supabase.auth.getUser)
  2. Fetch relevant data from DB (transactions, accounts, chart_data_points)
  3. Build system prompt with user's data summary
  4. Call OpenAI gpt-4o-mini with conversation history
  5. Return assistant response
      ↓
ChatWidget renders streamed or full response
```

**Why Edge Function?** — The OpenAI key stays server-side (already a Supabase secret). User data is fetched server-side so the client never sends raw transaction data to an LLM — only the question goes over the wire.

---

### Database Changes

Add a `chat_messages` table to persist conversation history per user:

```sql
CREATE TABLE chat_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role         text NOT NULL CHECK (role IN ('user', 'assistant')),
  content      text NOT NULL,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX ON chat_messages(user_id, created_at DESC);
```

Conversation history is limited to the last 20 messages in each API call to control token usage.

---

### Edge Function: `ai-chat`

**Input:**
```json
{
  "message": "How much did I spend on food last month?"
}
```

**What it does:**
1. Extracts user from JWT (`Authorization` header)
2. Queries the DB for:
   - Last 200 transactions (date, amount, description, category, direction)
   - Account balances
   - Monthly chart totals (last 6 months)
3. Builds a system prompt containing a structured data summary
4. Appends last 20 `chat_messages` as conversation history
5. Calls `gpt-4o-mini` with the full context
6. Saves both the user message and assistant response to `chat_messages`
7. Returns the assistant response

**System prompt structure:**
```
You are a personal finance assistant for Compass. You only answer questions
about the user's own financial data. Always cite specific numbers from the data.
Be concise. Format amounts in ₪.

USER DATA SUMMARY:
Accounts: [...]
Last 6 months spending: [...]
Recent transactions (last 200): [...]
```

---

### Frontend

**New files:**
```
src/components/ChatWidget/
  ChatWidget.jsx          — floating button + chat panel
  ChatWidget.module.css
  ChatMessage.jsx         — individual message bubble
  ChatMessage.module.css

src/hooks/useChat.js      — send message, fetch history, loading state

src/lib/chat.js           — callChatEdgeFunction()
```

**ChatWidget behavior:**
- Floating button (bottom-right corner, lime-green) visible on all authenticated pages
- Clicking opens a slide-up panel (400px wide, 560px tall on desktop; full-screen on mobile)
- Message input at the bottom, conversation history scrolls above
- Loading indicator (typing dots) while waiting for response
- "Clear chat" button in panel header
- Pro users only — Free tier sees a blur + upgrade CTA (consistent with ProGate pattern)

**Integration point:** Added once in `AppLayout.jsx` so it appears on every authenticated page without touching individual pages.

---

### Tier Gating
- **Free** — Chat widget visible but blurred with "Upgrade to Pro to ask your AI assistant" CTA
- **Pro** — Full access, unlimited questions

---

### Estimated Effort
| Task | Complexity |
|------|-----------|
| `chat_messages` migration + RLS | Low |
| `ai-chat` Edge Function | Medium |
| `ChatWidget` component + CSS | Medium |
| `useChat` hook | Low |
| ProGate integration | Low |
| **Total** | **~2–3 days** |

---

---

## Feature 2: Extended Data Entry (CSV/Excel + Manual)

### Overview
Expand the current upload flow (PDF only) to support three input methods:
1. **PDF** — existing flow, unchanged
2. **CSV / Excel (.xlsx)** — parse column headers, map to transaction fields, import
3. **Manual entry** — a form to add individual transactions one at a time

All three methods produce the same output: rows in the `transactions` table, attached to a user account. The existing upload wizard steps (account select → upload → review → confirm) are reused and extended.

---

### Method 2A: CSV / Excel Import

#### Parsing approach
- **CSV** — parsed client-side using a lightweight parser (e.g. `papaparse`, already a common dep)
- **Excel (.xlsx)** — parsed client-side using `xlsx` (SheetJS, ~200kb, reads `.xls` and `.xlsx`)
- After parsing, show a **column mapping UI** where the user maps their file's columns to Compass fields (Date, Amount, Description, Direction)
- Smart defaults: auto-detect common column names (`תאריך`, `סכום`, `date`, `amount`, `credit`, `debit`, `description`, `פירוט`)

#### Column Mapping UI
```
Your file columns:    →    Compass field
─────────────────────────────────────────
תאריך                →    [ Date       ▾ ]
סכום חיוב            →    [ Amount     ▾ ]
פירוט                →    [ Description▾ ]
זכות/חובה           →    [ Direction  ▾ ]
[Skip column]        →    [ —          ▾ ]
```

After mapping, the existing review/confirm step (already built) shows the parsed rows for approval before saving.

#### No AI needed for structured files
CSV/Excel rows already have structured data. AI is not called — parsing is 100% client-side and free.

---

### Method 2B: Manual Entry

A simple form to add one transaction at a time, accessible from:
- The upload wizard (new tab: "Manual Entry")
- A "+ Add Transaction" button on the Transactions page

#### Form fields
| Field | Type | Notes |
|-------|------|-------|
| Date | Date picker | Defaults to today |
| Amount | Number input | Positive number |
| Direction | Toggle | Debit / Credit |
| Description | Text | Merchant / payee name |
| Category | Select | Dropdown of existing categories |
| Account | Select | User's accounts |

After submit → inserts directly into `transactions` table → shows in dashboard immediately.

---

### Frontend Changes

#### Upload Wizard — new input method selector (Step 1)

Replace the current single drag-drop zone with a method picker:

```
┌──────────────┬──────────────┬──────────────┐
│  📄 PDF      │  📊 CSV/XLS  │  ✏️ Manual   │
│  Bank        │  Spreadsheet │  One by one  │
│  statement   │  export      │              │
└──────────────┴──────────────┴──────────────┘
```

Steps adapt based on selection:
- **PDF** → existing flow (unchanged)
- **CSV/XLS** → File upload → Column mapping → Review → Confirm
- **Manual** → Inline form (no wizard steps needed, save directly)

#### New files
```
src/components/UploadMethodSelector/
  UploadMethodSelector.jsx
  UploadMethodSelector.module.css

src/components/CsvColumnMapper/
  CsvColumnMapper.jsx         — column mapping UI
  CsvColumnMapper.module.css

src/components/ManualEntryForm/
  ManualEntryForm.jsx         — single transaction form
  ManualEntryForm.module.css

src/lib/csvParser.js          — papaparse wrapper + auto-detect columns
src/lib/xlsxParser.js         — SheetJS wrapper → normalised rows
```

#### Transactions page — quick add button
Add a `+ Add Transaction` button to the page header that opens `ManualEntryForm` in a modal (reuses existing `Modal` component).

---

### Database Changes

No schema changes required — manual and CSV transactions insert into the existing `transactions` table with the same shape as PDF-parsed transactions. The `source` field (if not already present) is worth adding as a nullable column for observability:

```sql
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS source text
  CHECK (source IN ('pdf', 'csv', 'manual'));
```

---

### New Dependencies
| Package | Size | Purpose |
|---------|------|---------|
| `papaparse` | ~50kb | CSV parsing |
| `xlsx` (SheetJS) | ~200kb | Excel parsing |

Both are pure client-side — no server changes needed.

---

### Tier Gating

| Feature | Free | Pro |
|---------|------|-----|
| PDF upload | 3 total | Unlimited |
| CSV/Excel import | 1 total | Unlimited |
| Manual entry | Unlimited | Unlimited |

The existing `useTier` hook and upload count check already handle the PDF gate — the same logic is extended for CSV.

---

### Estimated Effort
| Task | Complexity |
|------|-----------|
| `UploadMethodSelector` component | Low |
| CSV parser + auto column detection | Medium |
| Excel parser (SheetJS) | Low |
| Column mapping UI | Medium |
| Manual entry form + modal | Low |
| Transactions page "+ Add" button | Low |
| `source` column migration | Low |
| Tier gating for CSV | Low |
| **Total** | **~2–3 days** |

---

## Implementation Order (suggested)

| Priority | Feature | Why first |
|----------|---------|-----------|
| 1 | CSV/Excel import | Highest user value, no new infrastructure needed |
| 2 | Manual entry | Small effort, completes the data entry story |
| 3 | AI Chat | Requires new Edge Function + DB table, more moving parts |
