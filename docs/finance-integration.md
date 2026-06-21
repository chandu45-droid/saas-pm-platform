# Financial Tracking Integration Plan

**Decision:** Absorb financial-wellness-app into TaskFlow (Option A)
**Date:** 2026-06-21
**Status:** Planned

## What Changed

The standalone financial-wellness-app (local-only React Native app) is now killed as a separate product. All financial tracking features are absorbed into TaskFlow.

**Before:** Two separate products
- TaskFlow = WhatsApp task manager
- Financial Wellness App = local-only expense tracker

**After:** One unified product
- TaskFlow = WhatsApp personal assistant (tasks + expenses + financial insights)

## Architecture: Three Input Channels, One Backend

All expense data flows to the same Supabase PostgreSQL backend regardless of input channel.

| Channel | How user logs expense | Parser |
|---|---|---|
| WhatsApp | "spent 200 swiggy" | WhatsApp intent parser + categorizer.ts |
| Web Dashboard | Manual form (amount + category + merchant) | Direct API |
| (Future) Mobile App | Same form as web | Direct API |

## WhatsApp Expense Parsing

The bot must distinguish between tasks and expenses:

| Message | Parsed as | How |
|---|---|---|
| gym 6pm tomorrow | Task | No amount detected |
| spent 200 swiggy | Expense | "spent" keyword + amount |
| chai 50 | Expense | Known category + amount |
| rent 15000 | Expense | Known category + large amount |
| call dentist | Task | No amount, no expense keywords |
| what did I spend? | Query (expense) | Expense query pattern |
| what is pending? | Query (task) | Task query pattern |

**Intent detection priority:** Amount + (merchant OR expense keyword) = expense. Otherwise = task.

### Key Expense Keywords (India/Hinglish)
- "spent", "paid", "kharcha", "expense"
- Amount formats: "200", "Rs200", "200rs", "2k", "2.5k"
- Combined: "spent 200 on food", "200 swiggy", "chai 50"

## What Gets Migrated from core/

### Direct Copy (no changes needed)

| Source | Destination | What it does |
|---|---|---|
| core/src/categorizer.ts | src/core/categorizer.ts | 100+ India merchant categorization rules |
| core/src/benchmarks.ts | src/core/benchmarks.ts | Budget thresholds by income band |
| core/src/evaluate.ts | src/core/evaluate.ts | Financial health score (0-100) |
| core/src/habits.ts | src/core/habits.ts | Habit cost projections |
| core/src/money.ts | src/core/money.ts | Paise math utilities |
| core/src/necessity-checker.ts | src/core/necessity-checker.ts | Impulse spend flagging |
| core/src/projector.ts | src/core/projector.ts | Investment return projections |

### Adapt (needs changes)

| Source | Changes needed |
|---|---|
| core/src/sms-parser.ts | Adapt regex patterns for WhatsApp casual format (not bank SMS) |
| core/src/types.ts | Extend for Supabase schema (add userId, timestamps, source field) |

### Drop (not needed)

| Source | Why |
|---|---|
| core/src/crypto.ts | Server handles encryption (Supabase) |
| src/ (React Native UI) | Replaced by Next.js web dashboard |

### Tests: Migrate all
All __tests__/ files from core/ should be migrated. They validate the financial logic and are already passing.

## Database Schema (Expense Tables)



## Compliance Checklist

Every feature touching finance MUST pass:

- [ ] No specific securities/funds/stocks mentioned anywhere
- [ ] No buy / sell / invest in X language
- [ ] All projections have disclaimer text
- [ ] No bank API / UPI / payment initiation
- [ ] Branding uses tracker / insights / wellness (not advisor / advice)
- [ ] No fee charged specifically for financial advice

## Why This is a Killer Move

### Competitive moat
No WhatsApp bot in India does tasks + expenses. This is genuinely unique.

### Pro tier becomes compelling
- Tasks alone at Rs79/mo = hard sell
- Tasks + health score + spend analytics at Rs79/mo = easy sell for young India

### Acquisition funnel widens
- Some users come for tasks, discover expense tracking
- Some users come for expenses, discover task management
- Both audiences are massive in India

### Morning brief becomes killer
Combined daily brief shows tasks for today + yesterday spending + weekly pace.

## Risks

| Risk | Mitigation |
|---|---|
| WhatsApp expense parsing accuracy | Start with strict format, loosen with ML later |
| Users confused by dual-purpose bot | Clear onboarding: I handle tasks AND expenses |
| Compliance violation | Hard rules in CLAUDE.md, agent checks before shipping |
| Financial features scope creep | Pro tier gates advanced features, Day-1 stays simple |
| Data privacy concerns | Encryption at rest, clear privacy policy, optional deletion |
