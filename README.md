# Sortd — WhatsApp Personal Assistant

A WhatsApp-native personal assistant that turns everyday chat into organized life — tasks, reminders, and expense tracking, all in one conversation. Web dashboard for visual analytics.

**Status:** V1 in development

---

## The Idea

500M+ Indians already have WhatsApp. Instead of making them download yet another productivity app, Sortd meets them where they already are.

```
"gym 6pm tomorrow"           →  Task created, reminder set
"spent 200 swiggy"           →  Expense logged, auto-categorized
"kal meeting hai 3 baje"     →  Hinglish? No problem.
"summary"                    →  Weekly tasks + spending breakdown
```

**Zero setup. First message = first task. Works in Hinglish.**

### Product Stages

| Stage | What | Target |
|---|---|---|
| **V1** | Personal assistant (tasks + expenses) | Everyone — free |
| **V1.5** | Pro features (AI planning, health score, spend analytics) | Power users — subscription |
| **V2** | Business mode (projects, teams, shared tasks) | Freelancers, small teams |
| **V3** | Business OS (CRM, support, invoicing) | SMBs, agencies |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **App Framework** | Next.js (App Router) |
| **Database** | Neon PostgreSQL + Drizzle ORM |
| **Messaging** | WhatsApp Cloud API (Meta) |
| **AI** | Claude API — intent parsing for ambiguous messages |
| **Deployment** | Vercel (app) + Neon (database) |

## Architecture

```
┌───────────────┐     ┌──────────────────────────────────────┐
│   WhatsApp    │────→│          Next.js Backend              │
│   Cloud API   │←────│                                      │
│  (webhook)    │     │  Webhook ──→ Intent Parser ──→ DB    │
└───────────────┘     │                                      │
                      │  ┌─────────────────────────────┐     │
┌───────────────┐     │  │     Hybrid Intent Parser     │     │
│  Web Client   │────→│  │                             │     │
│  (Dashboard)  │     │  │  Layer 1: Regex rules (80%) │     │
└───────────────┘     │  │  → Free, ~1ms, deterministic│     │
                      │  │                             │     │
                      │  │  Layer 2: Claude LLM (20%)  │     │
                      │  │  → Ambiguous/complex only    │     │
                      │  └─────────────────────────────┘     │
                      │                                      │
                      │  API Routes ──→ Dashboard Data       │
                      └──────────────────┬───────────────────┘
                                         │
                              ┌──────────┴──────────┐
                              │  Neon PostgreSQL     │
                              │  (Drizzle ORM)       │
                              │                      │
                              │  users / tasks /     │
                              │  expenses / messages  │
                              └─────────────────────┘
```

### Hybrid Intent Parser

The core differentiator — a two-layer parser that keeps costs near-zero while handling India's multilingual chat patterns:

| Layer | Coverage | Cost | Latency | Handles |
|---|---|---|---|---|
| **Regex Rules** | ~80% of messages | Free | ~1ms | "buy milk", "spent 200 uber", "done task 3" |
| **Claude LLM** | ~20% of messages | ~$0.0001/call | ~500ms | "kal 3 baje meeting hai", "remind me about gym", mixed Hinglish |

### Database Schema

```sql
-- Phone number = identity (WhatsApp-native, no passwords)
users       (phone, name, timezone, created_at)
tasks       (user_id, title, status, category, due_at, completed_at)
expenses    (user_id, amount_paise, category, merchant, transaction_date)
messages    (user_id, direction, content, intent, processed)
```

**Money is stored in paise** (1/100 of INR) — no floating point errors.

## Features

### WhatsApp Bot
- Natural language task creation with due dates and reminders
- Expense logging with auto-categorization (100+ India merchant rules)
- Hinglish support — works with how India actually texts
- Proactive messages: morning briefs, reminders, overdue nudges, spend alerts
- Quick queries: "summary", "pending tasks", "what did I spend this week?"

### Web Dashboard
- Task pipeline: pending, in-progress, done
- Expense charts: category breakdown, daily/weekly trends
- Spending analytics with category-level drill-down
- Works alongside WhatsApp — capture in chat, analyze on web

### India-First Design
- INR currency with paise precision
- 100+ merchant categorization rules (Swiggy, Zomato, Ola, Uber, BigBasket...)
- Hinglish intent parsing built into the core parser
- WhatsApp-native UX patterns

## Project Structure

```
saas-pm-platform/
├── docs/                     # Product & architecture docs
│   ├── v1-scope.md           # V1 scope (7 decisions locked)
│   ├── finance-integration.md
│   └── architecture/         # Implementation-ready specs
│       ├── 01-tech-stack.md
│       ├── 02-db-schema.md
│       ├── 03-whatsapp-flow.md
│       ├── 04-intent-parser.md
│       ├── 05-api-routes.md
│       ├── 06-background-jobs.md
│       └── 07-project-structure.md
├── taskflow/                 # Next.js application
│   └── src/
│       ├── app/              # Pages + API routes
│       ├── core/             # Financial engine (categorizer, evaluator)
│       ├── db/               # Drizzle schema + queries
│       └── lib/
│           ├── parser/       # Hybrid intent parser
│           ├── response/     # Bot response builder
│           └── whatsapp/     # WhatsApp API client
├── research/                 # Market research & analysis
└── deliverables/             # Business case & pricing model
```

## Running Locally

```bash
cd taskflow
npm install
npm run dev
# → http://localhost:3000
```

### Environment Variables

```
DATABASE_URL=postgresql://...     # Neon PostgreSQL connection
WHATSAPP_TOKEN=...                # Meta WhatsApp Cloud API token
WHATSAPP_VERIFY_TOKEN=...         # Webhook verification token
ANTHROPIC_API_KEY=sk-ant-...      # Claude API (for LLM parser layer)
```

---

Built with AI-assisted development using Claude.
