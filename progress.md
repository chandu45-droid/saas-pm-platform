# TaskFlow — Build Progress

**Last updated:** 2026-06-27
**Status:** V1 Backend complete, Web Dashboard built, Auth + Deployment pending

---

## Project Overview

TaskFlow is a WhatsApp Personal Assistant that turns chat into organized life — tasks, reminders, expenses, financial insights. India-first, Hinglish-supported, zero setup.

- **Tech stack:** Next.js 16.2.9 (App Router), Drizzle ORM, Neon serverless PostgreSQL, Tailwind CSS 4, Zod 4, Upstash Redis
- **Repo:** https://github.com/chandu45-droid/saas-pm-platform
- **Branch:** master

---

## Build History (Git Log)

| Commit | What |
|---|---|
| `d10af5b` | Build web dashboard: landing page, dashboard UI, and REST APIs |
| `5ca5da2` | Push the latest changes |
| `dc110e6` | Build steps 5-6: DB queries, response builder, webhook handler |
| `0ab96f4` | Build steps 1-4: DB schema, core engine, WhatsApp client, intent parser |
| `eb4d001` | Initialize TaskFlow Next.js project with dependencies |
| `d316e8f` | Fix 6 doc inconsistencies found in architecture review |
| `7431d0e` | Add complete architecture documentation (7 docs) |
| `5e2f1d1` | Finalize all 7 scope decisions in v1-scope.md |
| `deef2a7` | Merge financial-wellness-app into TaskFlow as unified product |
| `34a9415` | Add market research and visual scope review for V1 |

---

## What's Built (Complete)

### 1. Database Layer
- **Schema** (`src/db/schema.ts`) — 5 tables with proper indexes:
  - `users` — phone-based identity, tier, monthly income (paise), timezone, morning brief time
  - `tasks` — title, status (pending/done/skipped), due/remind dates, category, source
  - `expenses` — amount in paise, category, merchant, transaction date, source
  - `messages` — audit log of all WhatsApp messages (inbound + outbound), intent, parsed data
  - `web_sessions` — magic link auth tokens for web dashboard
- **Connection** (`src/db/index.ts`) — Neon serverless via Drizzle ORM, lazy proxy (builds without DATABASE_URL)
- **Queries:**
  - `queries/tasks.ts` — createTask, getTasksByUser (today/pending/overdue/all), findTaskByQuery, markTaskDone, markTaskSkipped, updateTask, deleteTask, countPendingTasks
  - `queries/expenses.ts` — createExpense, getExpensesByUser (today/week/month + category filter), getTotalExpenses, getExpensesByCategory, updateExpense, deleteExpense
  - `queries/messages.ts` — message logging
  - `queries/users.ts` — user CRUD, find/create by phone

### 2. WhatsApp Bot (Complete Pipeline)
- **Webhook** (`src/app/api/webhook/whatsapp/route.ts`):
  - GET: Meta webhook verification challenge
  - POST: Receive messages, verify HMAC signature, process async
  - Full pipeline: extract message -> dedup -> mark read -> find/create user -> log -> parse intent -> execute -> respond
  - `executeIntent()`: Handles task_create, expense_log, task_done, task_skip, query_tasks, query_expenses, query_summary, set_profile, help, unknown
- **WhatsApp client** (`src/lib/whatsapp/`):
  - `client.ts` — sendTextMessage, markAsRead via Meta Cloud API
  - `verify.ts` — HMAC-SHA256 signature validation
  - `templates.ts` — message template helpers
  - `index.ts` — barrel export

### 3. Intent Parser (2-Layer System)
- **Entry** (`src/lib/parser/index.ts`) — Tries rules first, falls back to LLM if confidence not "high"
- **Rule-based** (`src/lib/parser/rules.ts`, ~265 lines):
  - Help, profile setting, expense logging, done/skip patterns, queries, task creation
  - Amount parsing with K/L/Cr shortcuts
  - Date/time signal detection (kal, aaj, parso, etc.)
  - 100+ India merchants auto-recognized (Swiggy, Zomato, BigBasket, Ola, etc.)
  - Hinglish support: "kharcha", "baaki", "bhool", "kal", "aaj", etc.
- **LLM fallback** (`src/lib/parser/llm.ts`) — Claude Haiku for complex/ambiguous messages
- **Helpers:**
  - `amount.ts` — Amount parsing utilities
  - `hinglish.ts` — Hinglish keyword maps
  - `types.ts` — Intent types and parser result interfaces

### 4. Response Builder
- **Builder** (`src/lib/response/builder.ts`) — Formats action results into WhatsApp messages:
  - TaskCreated, ExpenseLogged, TaskDone, TaskSkipped, TaskNotFound
  - TaskList, ExpenseList, Summary
  - ProfileUpdated, Error
  - buildHelpMessage() with examples
  - buildUnknownMessage() fallback
- **Formatter** (`src/lib/response/format.ts`) — Text formatting utilities

### 5. Financial Core Engine (Migrated from financial-wellness-app)
- `src/core/categorizer.ts` — 100+ India merchant categorization rules
- `src/core/evaluate.ts` — Financial health score (0-100)
- `src/core/benchmarks.ts` — Budget thresholds by income band
- `src/core/habits.ts` — Habit cost projections
- `src/core/money.ts` — Paise math utilities (Rs 200 = 20000 paise)
- `src/core/necessity-checker.ts` — Impulse spend flagging
- `src/core/types.ts` — Transaction, Bucket, ExpenseCategory data model
- `src/core/index.ts` — Barrel export

### 6. Web Dashboard (Just Built)
- **Landing Page** (`src/app/page.tsx`):
  - Premium marketing page with WhatsApp-themed design
  - Hero section with live chat preview showing real conversation examples
  - 3-step "How it works" section
  - 6 feature cards (Tasks, Expenses, Reminders, Dashboard, Hinglish, Privacy)
  - WhatsApp CTA buttons (green, branded)
  - Footer with financial disclaimer
- **Dashboard** (`src/app/dashboard/page.tsx`):
  - 4 stat cards: pending tasks, done tasks, overdue tasks, total spent
  - Task list with filter tabs (Pending / Today / All)
  - Task items with status badges, due dates, categories, source indicator (WA/Web)
  - Expense panel with period selector (Today / Week / Month)
  - Category breakdown bar chart with color-coded categories
  - Recent expenses list with merchant, category, amount
  - Quick tip card for WhatsApp usage
  - Financial disclaimer footer
- **Design System** (`src/app/globals.css`):
  - Teal primary (#0d9488) / Amber accent (#f59e0b) palette
  - Full dark mode support via prefers-color-scheme
  - WhatsApp-style chat bubbles (in/out)
  - Custom scrollbar, smooth transitions
  - Tailwind CSS 4 @theme integration
- **Layout** (`src/app/layout.tsx`):
  - Geist Sans + Mono fonts
  - SEO metadata (title, description, keywords)
  - Viewport with theme color

### 7. Web API Routes
- **Dashboard API** (`src/app/api/dashboard/route.ts`):
  - GET — aggregated dashboard data (tasks + expenses + stats in one call)
  - Accepts taskFilter and expensePeriod query params
  - Returns: tasks[], expenses[], stats { pendingTasks, doneTasks, overdueTasks, totalSpentPaise, expenseCount, categoryBreakdown[] }
  - Returns empty state when no userId (unauthenticated/demo)
- **Tasks API** (`src/app/api/tasks/route.ts`):
  - GET — list tasks with filter (pending/today/overdue/all)
  - POST — create task from web (source: "web")
  - PATCH — mark task done or skipped
- **Expenses API** (`src/app/api/expenses/route.ts`):
  - GET — list expenses with period + category filter, includes totals + category breakdown
  - POST — log expense from web (source: "web")

### 8. Architecture Documentation
- `docs/architecture/01-tech-stack.md` — Tech choices and rationale
- `docs/architecture/02-db-schema.md` — Full schema design
- `docs/architecture/03-whatsapp-flow.md` — Message processing pipeline
- `docs/architecture/04-intent-parser.md` — 2-layer parsing architecture
- `docs/architecture/05-api-routes.md` — API design
- `docs/architecture/06-background-jobs.md` — Cron/queue job specs
- `docs/architecture/07-project-structure.md` — Folder structure
- `docs/v1-scope.md` — V1 scope with 7 locked decisions
- `docs/finance-integration.md` — Financial engine migration plan

---

## Full File Tree

```
taskflow/src/
├── app/
│   ├── api/
│   │   ├── dashboard/route.ts        ← Aggregated dashboard endpoint
│   │   ├── expenses/route.ts         ← Expense CRUD API
│   │   ├── tasks/route.ts            ← Task CRUD API
│   │   └── webhook/whatsapp/route.ts ← WhatsApp webhook (Meta Cloud API)
│   ├── dashboard/page.tsx            ← Dashboard UI (tasks + expenses)
│   ├── globals.css                   ← Design system (teal/amber, dark mode)
│   ├── layout.tsx                    ← Root layout (fonts, metadata)
│   └── page.tsx                      ← Landing page (marketing)
├── core/
│   ├── benchmarks.ts                 ← Budget thresholds by income band
│   ├── categorizer.ts                ← 100+ India merchant rules
│   ├── evaluate.ts                   ← Financial health score (0-100)
│   ├── habits.ts                     ← Habit cost projections
│   ├── index.ts                      ← Barrel export
│   ├── money.ts                      ← Paise math utilities
│   ├── necessity-checker.ts          ← Impulse spend flagging
│   └── types.ts                      ← Transaction, Bucket types
├── db/
│   ├── index.ts                      ← Neon connection (lazy proxy)
│   ├── queries/
│   │   ├── expenses.ts               ← Expense queries (CRUD + aggregation)
│   │   ├── messages.ts               ← Message audit log
│   │   ├── tasks.ts                  ← Task queries (CRUD + filters)
│   │   └── users.ts                  ← User CRUD (phone-based)
│   └── schema.ts                     ← 5 tables (users, tasks, expenses, messages, web_sessions)
├── lib/
│   ├── auth/                         ← (empty — not yet implemented)
│   ├── jobs/                         ← (empty — not yet implemented)
│   ├── parser/
│   │   ├── amount.ts                 ← Amount parsing (K/L/Cr shortcuts)
│   │   ├── hinglish.ts               ← Hinglish keyword maps
│   │   ├── index.ts                  ← Parser entry (rules -> LLM fallback)
│   │   ├── llm.ts                    ← Claude Haiku fallback parser
│   │   ├── rules.ts                  ← Rule-based parser (~265 lines, 80% coverage)
│   │   └── types.ts                  ← Intent types
│   ├── response/
│   │   ├── builder.ts                ← WhatsApp response formatter
│   │   └── format.ts                 ← Text formatting utils
│   ├── utils/                        ← (empty — not yet implemented)
│   └── whatsapp/
│       ├── client.ts                 ← Meta Cloud API client (send, markRead)
│       ├── index.ts                  ← Barrel export
│       ├── templates.ts              ← Message template helpers
│       └── verify.ts                 ← HMAC-SHA256 signature validation
└── types/                            ← (empty — not yet implemented)
```

---

## What's NOT Built Yet

### Critical for Launch
1. **Web Auth** (`src/lib/auth/`) — Magic link flow: user requests login via WhatsApp -> bot sends link with token -> web_sessions table validates -> JWT cookie set. Schema exists (`web_sessions` table), code doesn't.
2. **Database Migration** — Need to run `drizzle-kit push` against a real Neon database to create tables.
3. **Environment Setup** — Need real values for: DATABASE_URL, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WEBHOOK_VERIFY_TOKEN, WHATSAPP_APP_SECRET, JWT_SECRET, ANTHROPIC_API_KEY
4. **Meta App Setup** — Create Meta/Facebook app, get WhatsApp Business API access, configure webhook URL, verify domain.
5. **Vercel Deployment** — Deploy Next.js app, set env vars, configure custom domain.

### Important but Not Blocking
6. **Background Jobs** (`src/lib/jobs/`) — Morning briefs, reminder delivery, overdue nudges, daily wrap-ups. Architecture documented in `docs/architecture/06-background-jobs.md`. Would use QStash/Upstash for cron.
7. **Rate Limiting** — Upstash Redis rate limiter (dependency installed, not wired up).
8. **Dashboard Auth Guard** — Dashboard page currently fetches without auth. Needs: check JWT cookie -> redirect to login if absent.
9. **Task/Expense creation from Web UI** — API routes exist (POST), but the dashboard UI has no "add" forms yet. Currently display-only.

### Nice-to-Have (V1.5)
10. **Expense Charts** — Proper time-series charts (daily/weekly spending trends). Currently just category bar chart.
11. **Task Calendar View** — Visual calendar with tasks plotted by due date.
12. **Spending Alerts** — Proactive WhatsApp messages when spending exceeds thresholds.
13. **AI Planning** — Claude-powered daily planning, task prioritization suggestions.
14. **Financial Health Score** — Core engine exists (`evaluate.ts`), needs UI + WhatsApp integration.
15. **Budget Setting** — Let users set category budgets, alert on overspend.

---

## Build Order Recommendation (Next Sessions)

### Session N+1: Make it Real
1. Create Neon database, run `drizzle-kit push`
2. Set up Meta WhatsApp Business API app
3. Deploy to Vercel with all env vars
4. Test full WhatsApp flow end-to-end (send message -> bot responds)

### Session N+2: Web Auth + Polish
1. Implement magic link auth (WhatsApp -> web_sessions -> JWT)
2. Add auth guard to dashboard route
3. Wire dashboard to real user data
4. Add task/expense creation forms to web UI

### Session N+3: Proactive Features
1. Implement background jobs (morning brief, reminders, overdue nudges)
2. Wire up Upstash rate limiting
3. Add spending alerts
4. Test full proactive flow

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Phone = identity | WhatsApp phone number | Zero signup friction, WhatsApp-native |
| Money in paise | Integer math (Rs 200 = 20000) | No floating point errors |
| 2-layer parser | Rules first (80%), LLM fallback (20%) | Cost optimization — most messages are simple |
| Lazy DB proxy | Proxy object wrapping Drizzle | Allows `next build` without DATABASE_URL |
| Source tracking | "whatsapp" vs "web" on tasks/expenses | Know which channel originated each item |
| Hinglish-first | Native keyword maps in parser | India-first UX, no translation API needed |
| Financial compliance | No advice, no securities, no money movement | Avoid SEBI/RBI regulatory issues |

---

## Environment Variables Required

```env
# Database (Neon)
DATABASE_URL=postgresql://...@...neon.tech/taskflow

# WhatsApp (Meta Cloud API)
WHATSAPP_TOKEN=EAA...
WHATSAPP_PHONE_NUMBER_ID=1234567890
WEBHOOK_VERIFY_TOKEN=your-secret-verify-token
WHATSAPP_APP_SECRET=your-app-secret

# Auth
JWT_SECRET=your-jwt-secret

# AI (for LLM fallback parser)
ANTHROPIC_API_KEY=sk-ant-...

# Background Jobs (optional for V1)
CRON_SECRET=your-cron-secret
QSTASH_TOKEN=...
QSTASH_CURRENT_SIGNING_KEY=...
QSTASH_NEXT_SIGNING_KEY=...

# Rate Limiting (optional for V1)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```
