# Sortd — Build Progress

**Last updated:** 30 June 2026
**Status:** V1 Backend + Web Dashboard built. Demo mode live. Auth + Deployment + WhatsApp connection pending.
**Commits:** 24 total, latest activity June 30 (multi-expense parsing, parser hardening)

---

## Project Overview

Sortd (formerly TaskFlow) is a WhatsApp Personal Assistant that turns chat into organized life — tasks, reminders, expenses, financial insights. India-first, Hinglish-supported, zero setup.

- **Tech stack:** Next.js (App Router), Drizzle ORM, Neon serverless PostgreSQL, Tailwind CSS 4, Zod 4, Upstash Redis
- **Repo:** https://github.com/chandu45-droid/saas-pm-platform
- **Branch:** master

---

## Build History (Git Log)

| Commit | Date | What |
|---|---|---|
| `5162908` | 2026-06-30 | Multi-expense parsing, chat UX upgrade, parser hardening |
| `e7bd2d4` | 2026-06-30 | Amount parser handles 4+ digit numbers without commas |
| `7e82d40` | 2026-06-29 | Rename TaskFlow -> Sortd across all files, UI, and docs |
| `db70bfc` | 2026-06-29 | Premium landing page redesign with interactive demo + WhatsApp-coming-soon |
| `d862142` | 2026-06-29 | Zero-cost demo mode — fully functional chat + dashboard without paid services |
| `76504c5` | 2026-06-29 | Project README with architecture overview and feature documentation |
| `453210e` | 2026-06-29 | Clean up repo for public visibility |
| `8c5b0c4` | 2026-06-27 | Progress.md — full build status, file inventory, and next steps |
| `d10af5b` | 2026-06-27 | Web dashboard: landing page, dashboard UI, and REST APIs |
| `5ca5da2` | 2026-06-25 | Push the latest changes |

---

## What's Built (Complete)

### 1. Database Layer
- **Schema** (`src/db/schema.ts`) — 5 tables: users, tasks, expenses, messages, web_sessions
- **Connection** (`src/db/index.ts`) — Neon serverless via Drizzle ORM, lazy proxy (builds without DATABASE_URL)
- **Queries:** Full CRUD for tasks (create, get by filter, mark done/skipped, update, delete), expenses (create, get with period/category filter, totals, category breakdown), messages (audit log), users (CRUD, find/create by phone)

### 2. WhatsApp Bot (Complete Pipeline)
- **Webhook** (`src/app/api/webhook/whatsapp/route.ts`) — GET verification + POST message processing
- Full pipeline: extract message -> dedup -> mark read -> find/create user -> log -> parse intent -> execute -> respond
- `executeIntent()` handles: task_create, expense_log, task_done, task_skip, query_tasks, query_expenses, query_summary, set_profile, help, unknown
- **WhatsApp client** — sendTextMessage, markAsRead, HMAC-SHA256 signature validation, templates

### 3. Hybrid Intent Parser (2-Layer)
- **Rule-based** (`src/lib/parser/rules.ts`, ~265 lines) — covers ~80% of messages, free, ~1ms
  - Help, profile setting, expense logging, done/skip patterns, queries, task creation
  - Amount parsing with K/L/Cr shortcuts
  - 100+ India merchants auto-recognized (Swiggy, Zomato, BigBasket, Ola, etc.)
  - Hinglish: "kharcha", "baaki", "bhool", "kal", "aaj", "parso", etc.
- **LLM fallback** (`src/lib/parser/llm.ts`) — Claude Haiku for complex/ambiguous (~20%)
- **Multi-expense parsing** (`src/lib/parser/multi-expense.ts`) — "chai 50, lunch 200, uber 150" in one message
- **Amount parser** (`src/lib/parser/amount.ts`) — handles 4+ digit numbers, K/L/Cr shortcuts

### 4. Response Builder
- Formats action results into WhatsApp-style messages
- Covers: TaskCreated, ExpenseLogged, TaskDone, TaskSkipped, TaskNotFound, TaskList, ExpenseList, Summary, ProfileUpdated, Error, Help, Unknown

### 5. Financial Core Engine (Migrated from financial-wellness-app)
- `categorizer.ts` — 100+ India merchant categorization rules
- `evaluate.ts` — Financial health score (0-100)
- `benchmarks.ts` — Budget thresholds by income band
- `habits.ts` — Habit cost projections
- `money.ts` — Paise math utilities (Rs 200 = 20000 paise)
- `necessity-checker.ts` — Impulse spend flagging
- `types.ts` — Transaction, Bucket, ExpenseCategory data model

### 6. Web Dashboard
- **Landing Page** — Premium design with interactive demo, WhatsApp-coming-soon messaging, feature cards, CTA
- **Dashboard** — 4 stat cards, task list with filter tabs, expense panel with period selector, category breakdown bar chart, recent expenses, financial disclaimer
- **Chat Page** (`src/app/chat/page.tsx`) — Web chat interface for demo mode
- **Design System** — Teal primary / Amber accent, full dark mode, WhatsApp-style chat bubbles

### 7. Web API Routes
- `/api/dashboard` — Aggregated dashboard data (tasks + expenses + stats in one call)
- `/api/tasks` — GET (list/filter), POST (create), PATCH (done/skip)
- `/api/expenses` — GET (list with period/category filter + totals), POST (log)
- `/api/chat` — Web chat endpoint for demo mode
- `/api/webhook/whatsapp` — Meta Cloud API webhook

### 8. Demo Mode
- Zero-cost fully functional chat + dashboard without any paid services
- In-memory store (`src/lib/demo/store.ts`) — works without database connection
- Interactive demo on landing page

### 9. Architecture Documentation
- 7 implementation-ready specs referenced in CLAUDE.md under `docs/architecture/`
- `docs/v1-scope.md` — V1 scope with 7 locked decisions
- `docs/finance-integration.md` — Financial engine migration plan
- **Note:** `docs/` folder missing from disk — may need recovery or rebuild

### 10. Agent Setup
- 7 specialist agents in `.claude/agents/`: product-strategist, system-architect, bot-designer, frontend, backend, qa, market-researcher

---

## What's NOT Built Yet

### Critical for Launch
| Gap | Priority | Notes |
|---|---|---|
| WhatsApp live connection | Critical | Bot code built but not connected to a real Meta Business account |
| Database deployed | Critical | Schema exists but no Neon instance connected (demo uses in-memory) |
| Meta App Setup | Critical | Need: create Meta/Facebook app, get WhatsApp Business API access, configure webhook, verify domain |
| Vercel Deployment | Critical | Not deployed yet |
| Environment Setup | Critical | Need real values for DATABASE_URL, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, etc. |

### High Priority
| Gap | Priority | Notes |
|---|---|---|
| Web Auth | High | Magic link flow designed (WhatsApp -> web_sessions -> JWT), schema exists, code doesn't |
| Proactive messaging | High | Morning briefs, reminders, overdue nudges, daily wrap-ups — designed but not built |
| Background jobs | High | Spec in `06-background-jobs.md`, no cron/job system built. Would use QStash/Upstash. |
| Dashboard auth guard | High | Dashboard currently fetches without auth |

### Medium Priority
| Gap | Priority | Notes |
|---|---|---|
| Task/Expense creation from Web | Medium | API routes exist, dashboard UI has no "add" forms |
| Rate limiting | Medium | Upstash Redis dependency installed, not wired up |
| Notifications | Medium | No email or push notifications |
| Missing `docs/` folder | Medium | CLAUDE.md references docs/ with architecture specs but folder not on disk |

### Nice-to-Have (V1.5)
- Expense time-series charts (daily/weekly trends)
- Task calendar view
- Spending alerts (proactive WhatsApp messages on overspend)
- AI planning (Claude-powered daily plans, task prioritization)
- Financial health score UI + WhatsApp integration
- Budget setting per category

---

## Build Order (Next Sessions)

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

## Full File Tree

```
taskflow/src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts                ← Web chat endpoint (demo mode)
│   │   ├── dashboard/route.ts           ← Aggregated dashboard endpoint
│   │   ├── expenses/route.ts            ← Expense CRUD API
│   │   ├── tasks/route.ts               ← Task CRUD API
│   │   └── webhook/whatsapp/route.ts    ← WhatsApp webhook (Meta Cloud API)
│   ├── chat/page.tsx                    ← Web chat UI
│   ├── dashboard/page.tsx               ← Dashboard UI (tasks + expenses)
│   ├── globals.css                      ← Design system (teal/amber, dark mode)
│   ├── layout.tsx                       ← Root layout (fonts, metadata)
│   └── page.tsx                         ← Landing page (marketing)
├── core/
│   ├── benchmarks.ts                    ← Budget thresholds by income band
│   ├── categorizer.ts                   ← 100+ India merchant rules
│   ├── evaluate.ts                      ← Financial health score (0-100)
│   ├── habits.ts                        ← Habit cost projections
│   ├── index.ts                         ← Barrel export
│   ├── money.ts                         ← Paise math utilities
│   ├── necessity-checker.ts             ← Impulse spend flagging
│   └── types.ts                         ← Transaction, Bucket types
├── db/
│   ├── index.ts                         ← Neon connection (lazy proxy)
│   ├── queries/
│   │   ├── expenses.ts                  ← Expense queries (CRUD + aggregation)
│   │   ├── messages.ts                  ← Message audit log
│   │   ├── tasks.ts                     ← Task queries (CRUD + filters)
│   │   └── users.ts                     ← User CRUD (phone-based)
│   └── schema.ts                        ← 5 tables
├── lib/
│   ├── demo/store.ts                    ← In-memory demo store (no DB needed)
│   ├── parser/
│   │   ├── amount.ts                    ← Amount parsing (K/L/Cr, 4+ digits)
│   │   ├── hinglish.ts                  ← Hinglish keyword maps
│   │   ├── index.ts                     ← Parser entry (rules -> LLM fallback)
│   │   ├── llm.ts                       ← Claude Haiku fallback parser
│   │   ├── multi-expense.ts             ← Multi-expense in one message
│   │   ├── rules.ts                     ← Rule-based parser (~265 lines)
│   │   └── types.ts                     ← Intent types
│   ├── response/
│   │   ├── builder.ts                   ← WhatsApp response formatter
│   │   └── format.ts                    ← Text formatting utils
│   └── whatsapp/
│       ├── client.ts                    ← Meta Cloud API client
│       ├── index.ts                     ← Barrel export
│       ├── templates.ts                 ← Message template helpers
│       └── verify.ts                    ← HMAC-SHA256 signature validation
```

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
