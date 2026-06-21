# TaskFlow — WhatsApp Personal Assistant → Business OS

WhatsApp AI bot that turns chat into organized life. Tasks, reminders, expenses, financial insights — for personal use first, expanding to business/team SaaS later.

**Phase:** Product scoping (no code yet)
**Builder:** Solo, bootstrapped, AI-assisted
**Market:** India-first (500M+ WhatsApp users)

## Product Vision

**Free personal assistant** that hooks everyone → **Paid business mode** that converts power users.

TaskFlow is TWO killer things in one WhatsApp chat:
1. **Task manager** — capture tasks, get reminders, stay organized
2. **Expense tracker** — log spending, see where money goes, get financial insights

Three input channels, one backend:
- **WhatsApp** — capture tasks and expenses via chat
- **Web dashboard** — visual overview, charts, analytics
- **(Future) Mobile app** — thin client for the same backend

| Stage | What | Users | Revenue |
|---|---|---|---|
| V1 | Personal assistant (tasks + expense tracking) | Everyone | Free (growth) |
| V1.5 | Pro features (AI planning, health score, spend analytics) | Power users | ₹79/mo subscription |
| V2 | Business mode (projects, team workspaces, shared tasks) | Freelancers, small teams | Usage-based pricing |
| V3 | Business OS (CRM, support, invoicing, client bot) | SMBs, agencies | Full SaaS |

## V1 Scope — Personal Assistant

### Tasks (WhatsApp + Web)
- Chat to create tasks, set reminders, make plans, save notes
- Bot sends: morning briefs, reminders, overdue nudges, daily wrap-ups
- Web dashboard for pipeline view, calendar, streaks, trends
- Zero setup — works from first message

### Expenses (WhatsApp + Web)
- Chat to log expenses ("spent 200 swiggy", "chai 50")
- Auto-categorization with 100+ India-specific merchant rules
- Quick spend queries ("what did I spend this week?")
- Web dashboard for category breakdown, trends, budgets
- Reuses tested TypeScript engine from financial-wellness-app/core/

## Hard Rules

1. **WhatsApp is the product.** Web is optional. Bot must work standalone.
2. **Zero setup, instant value.** First message = first task/expense. No onboarding.
3. **Proactive > reactive.** Bot pushes reminders, spend alerts, and plans without being asked.
4. **Personal first.** No team/business features in V1. Just you and your assistant.
5. **India-first UX.** Hinglish, INR, WhatsApp-native patterns.
6. **Free tier must be genuinely useful.** Not crippled. Growth comes from love, not gates.
7. **Test before claiming done.** Run the app before reporting complete.
8. **Commit & push immediately** after changes.

## Financial Compliance (HARD — from financial-wellness-app)

These rules are NON-NEGOTIABLE for all financial features:

1. **No specific securities.** Never recommend specific stocks, funds, or instruments.
2. **No fee for advice.** Financial features are product features, not advisory services.
3. **No money movement.** No bank API, no UPI integration, no payment initiation.
4. **Disclaimers required.** All projections carry "illustrative only, not financial advice."
5. **Branding: wellness/insights/tracker** — NEVER "advisor/advice/buy/sell."

## Reusable Core Engine

The `financial-wellness-app/core/` TypeScript engine is platform-agnostic and will be migrated into TaskFlow's backend:

- `categorizer.ts` — 100+ India merchant categorization rules
- `evaluate.ts` — financial health score (0-100)
- `benchmarks.ts` — budget thresholds by income band
- `habits.ts` — habit cost projections
- `money.ts` — Paise math utilities
- `necessity-checker.ts` — impulse spend flagging
- `projector.ts` — investment return projections
- `types.ts` — Transaction, Bucket, ExpenseCategory data model

## Folder Structure

```
saas-pm-platform/
├── CLAUDE.md                  ← this file
├── 00-Research-Brief.md       ← original research prompt
├── research/                  ← market research (completed)
├── deliverables/              ← original SaaS research (superseded by docs/)
├── docs/
│   ├── v1-scope.md            ← live scope tracker (7 decisions locked)
│   ├── finance-integration.md ← financial engine migration plan
│   └── architecture/          ← implementation-ready architecture
│       ├── 01-tech-stack.md
│       ├── 02-db-schema.md
│       ├── 03-whatsapp-flow.md
│       ├── 04-intent-parser.md
│       ├── 05-api-routes.md
│       ├── 06-background-jobs.md
│       └── 07-project-structure.md
└── .claude/
    ├── agents/                ← 8 agents (chanakya + 7 specialists)
    ├── skills/                ← reusable workflows
    └── hooks/                 ← automated checks
```

## Agent Panel

| Agent | When to use |
|---|---|
| **chanakya** | Orchestrator. Plans work, assigns agents, tracks progress, reviews output. Start here. |
| **product-strategist** | Feature scoping, user flows, prioritization, product decisions |
| **system-architect** | DB schema, API design, infra, tech decisions |
| **bot-designer** | WhatsApp conversation flows, intent parsing, proactive messaging |
| **frontend** | Web dashboard UI, components, Next.js |
| **backend** | API routes, database logic, billing, metering |
| **qa** | Testing strategy, edge cases, quality checks |
| **market-researcher** | Competitive research, user pain analysis, market gaps |
