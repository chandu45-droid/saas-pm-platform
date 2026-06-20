# V1 Product Scope — TaskFlow

**Status:** Defining (in progress)

## Concept
WhatsApp personal assistant + web dashboard. Bot captures and reminds. Web shows the big picture.

## Value Prop
No app to download. Just text. See everything on the web when you need the big picture.

## Two Interfaces, Two Jobs

| Interface | Job | Used for |
|---|---|---|
| WhatsApp Bot | Capture + Remind | Add tasks, update status, get reminders, quick queries |
| Web Dashboard | Visibility + Analytics | Pipeline view, recurring tasks, streaks, trends, calendar |

## Target User
Anyone with WhatsApp. Not role-specific, not business-specific.

## Core Features

### WhatsApp Bot
- Natural language task creation ("gym 6am tomorrow", "call dentist Friday")
- Smart parsing (extracts deadline, category, recurrence from plain text)
- Status updates via chat ("done with dentist", "skip gym today")
- Quick queries ("what's left today?", "what's overdue?")
- Proactive: morning briefs, reminders, overdue nudges, daily wrap-ups
- Recurring task support ("gym every weekday 6am")
- All notification timing user-customizable

### Web Dashboard
- Pipeline view: pending / in-progress / done / overdue
- Recurring tasks dashboard with streaks
- Calendar view of upcoming tasks
- Category breakdown (work / health / personal / social / etc.)
- Completion analytics: daily, weekly, monthly trends
- Activity timeline: everything captured via bot
- Settings: notification preferences, categories, timezone

## Growth Path
V1 Free personal → V1.5 Pro (AI planning, advanced analytics) → V2 Teams → V3 Business OS

## Decisions Log
| Decision | Choice | Date |
|---|---|---|
| Product type | Personal assistant first, SaaS later | 2026-06-21 |
| Primary interface | WhatsApp bot (capture + remind) | 2026-06-21 |
| Secondary interface | Web dashboard (visibility + analytics) | 2026-06-21 |
| Target user | Everyone with WhatsApp | 2026-06-21 |
| Value prop | Zero app install, text to organize, web for big picture | 2026-06-21 |
| V1 revenue | Free (growth-first) | 2026-06-21 |

## Open Questions
- [ ] Day-1 feature set (final cut — what ships vs what's V1.1)
- [ ] Anti-scope (explicit no-list)
- [ ] UX differentiator vs Todoist/Any.do
- [ ] Product name (TaskFlow is working name)
- [ ] Success gate / launch metrics
- [ ] Free vs Pro boundary
- [ ] Analytics depth — what charts/stats in V1?
