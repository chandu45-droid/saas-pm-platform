# V1 Product Scope — TaskFlow

**Status:** Defining (in progress)

## Concept
WhatsApp personal assistant + web dashboard. Tasks + expenses in one place. Bot captures, reminds, and tracks. Web shows the big picture.

## Value Prop
No app to download. Just text. Track tasks AND expenses from WhatsApp. See everything on the web when you need the big picture.

## Two Interfaces, Two Jobs

| Interface | Job | Used for |
|---|---|---|
| WhatsApp Bot | Capture + Remind + Track | Add tasks, log expenses, get reminders, quick queries |
| Web Dashboard | Visibility + Analytics | Pipeline view, expense breakdown, streaks, trends, calendar |

## Target User
Anyone with WhatsApp. Not role-specific, not business-specific. Young India (22-35, earning ₹30k-₹3L/month) is the sweet spot for the financial features.

## Core Features

### WhatsApp Bot — Tasks
- Natural language task creation ("gym 6am tomorrow", "call dentist Friday")
- Smart parsing (extracts deadline, category, recurrence from plain text)
- Status updates via chat ("done with dentist", "skip gym today")
- Quick queries ("what's left today?", "what's overdue?")
- Proactive: morning briefs, reminders, overdue nudges, daily wrap-ups
- Recurring task support ("gym every weekday 6am")
- All notification timing user-customizable

### WhatsApp Bot — Expenses
- Natural language expense logging ("spent 200 swiggy", "chai 50", "rent 15000")
- Auto-categorization (food, transport, subscriptions, EMI, etc.) — 100+ India-specific merchant rules
- Quick queries ("what did I spend today?", "this week's food spend?")
- Weekly/monthly expense summaries in morning brief
- Expense alerts ("you've spent ₹2000 on food this week")

### Web Dashboard — Tasks
- Pipeline view: pending / in-progress / done / overdue
- Recurring tasks dashboard with streaks
- Calendar view of upcoming tasks
- Category breakdown (work / health / personal / social / etc.)
- Completion analytics: daily, weekly, monthly trends
- Activity timeline: everything captured via bot

### Web Dashboard — Expenses
- Monthly expense overview with category breakdown
- Spend trends: daily, weekly, monthly charts
- Budget tracking per category
- Transaction history (searchable, filterable)
- Combined morning brief: tasks for today + yesterday's spending

### Settings (shared)
- Notification preferences, categories, timezone
- Expense categories (customizable)
- Currency (INR default)

## Financial Features by Tier

| Feature | Day-1 (Free) | V1.1 (Free) | Pro (₹79/mo) |
|---|---|---|---|
| Log expenses via WhatsApp | ✅ | ✅ | ✅ |
| Log expenses via web | ✅ | ✅ | ✅ |
| Auto-categorize (100+ India merchants) | ✅ | ✅ | ✅ |
| Monthly totals | ✅ | ✅ | ✅ |
| Category breakdown charts | | ✅ | ✅ |
| Daily/weekly spend alerts | | ✅ | ✅ |
| Expense summary in morning brief | | ✅ | ✅ |
| Financial health score (0-100) | | | ✅ |
| Habit cost tracker + projections | | | ✅ |
| Investment projector (FD, PPF, equity) | | | ✅ |
| Necessity checker (impulse alerts) | | | ✅ |
| Spend benchmarks vs peers | | | ✅ |
| Spend analytics + insights | | | ✅ |

## Task Features by Tier

| Feature | Day-1 (Free) | V1.1 (Free) | Pro (₹79/mo) |
|---|---|---|---|
| NL task creation via WhatsApp | ✅ | ✅ | ✅ |
| Reminders + overdue nudges | ✅ | ✅ | ✅ |
| Morning brief | ✅ | ✅ | ✅ |
| Web pipeline view | ✅ | ✅ | ✅ |
| Recurring tasks + streaks | | ✅ | ✅ |
| Daily wrap-ups | | ✅ | ✅ |
| Calendar view | | ✅ | ✅ |
| Snooze/reschedule | | ✅ | ✅ |
| AI planner (auto-schedule day) | | | ✅ |
| Task analytics + trends | | | ✅ |
| Voice-to-task | | | ✅ |

## Compliance Rules (from Financial Wellness App — HARD)

These rules MUST be followed in all financial features:

1. **No specific securities/funds/stocks.** Never recommend "buy X stock" or "invest in Y fund"
2. **No fee for advice.** Financial features are part of the product, not a separate advisory service
3. **No money movement.** No bank API integration, no UPI, no payment initiation
4. **Disclaimers required.** All projections must carry "illustrative only, not financial advice" disclaimers
5. **Branding: wellness/insights/tracker** — NOT "advisor/advice/buy/sell"

## Reusable Engine (from financial-wellness-app/core/)

The following tested TypeScript modules will be migrated into TaskFlow's backend:

| Module | What it does | Reuse status |
|---|---|---|
| `categorizer.ts` | 100+ India merchant → category rules | ✅ Direct reuse |
| `benchmarks.ts` | Budget thresholds by income band | ✅ Direct reuse |
| `evaluate.ts` | Financial health score (0-100) | ✅ Rewire to server data |
| `habits.ts` | Habit cost projections | ✅ Direct reuse |
| `money.ts` | Paise math utilities | ✅ Direct reuse |
| `necessity-checker.ts` | Impulse spend flagging | ✅ Direct reuse |
| `projector.ts` | Investment return projections | ✅ Direct reuse |
| `sms-parser.ts` | Bank SMS parsing patterns | 🔄 Adapt for WhatsApp format |
| `types.ts` | Full data model (Transaction, Bucket, etc.) | 🔄 Extend for server schema |
| `crypto.ts` | Encryption utils | ❌ Not needed (server handles) |

## Growth Path
V1 Free personal (tasks + expenses) → V1.5 Pro (AI planning, health score, analytics) → V2 Teams → V3 Business OS

## Decisions Log

| Decision | Choice | Date |
|---|---|---|
| Product type | Personal assistant first, SaaS later | 2026-06-21 |
| Primary interface | WhatsApp bot (capture + remind) | 2026-06-21 |
| Secondary interface | Web dashboard (visibility + analytics) | 2026-06-21 |
| Target user | Everyone with WhatsApp | 2026-06-21 |
| Value prop | Zero app install, text to organize, web for big picture | 2026-06-21 |
| V1 revenue | Free (growth-first) | 2026-06-21 |
| Financial tracking merge | Absorb financial-wellness-app into TaskFlow (Option A) | 2026-06-21 |
| Standalone finance app | Killed — all features fold into TaskFlow | 2026-06-21 |
| Financial compliance | Carry forward all hard rules (no securities, no money movement, disclaimers) | 2026-06-21 |

## Open Questions
- [ ] Day-1 feature set (final cut — what ships vs what's V1.1)
- [ ] Anti-scope (explicit no-list)
- [ ] UX differentiator vs Todoist/Any.do
- [ ] Product name (TaskFlow is working name)
- [ ] Success gate / launch metrics
- [ ] Free vs Pro boundary (now includes financial features)
- [ ] Analytics depth — what charts/stats in V1?
- [ ] WhatsApp expense message format — strict or fuzzy?
