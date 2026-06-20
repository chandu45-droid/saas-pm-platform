---
name: scope-feature
description: Scope a new feature with structured format. Use when adding any feature to V1/V2/V3.
---

## Template: Feature Scope

When scoping a feature, produce this document:

```markdown
# Feature: [Name]
**Version:** V1 / V2 / V3
**Owner agent:** [which agent builds this]

## Problem
[1-2 sentences: what pain does this solve?]

## Solution
[1-2 sentences: what do we build?]

## User Flow
1. [Step-by-step: what the user does and sees]

## Bot Interaction (if applicable)
- User says: "..."
- Bot responds: "..."

## Web Dashboard (if applicable)
- [What screen shows this, what it looks like]

## Metering
- [What usage is tracked? What's free vs metered?]

## Out of Scope
- [What we explicitly don't build for this feature]

## Dependencies
- [What must exist before this can be built?]
```

Keep each section to 1-3 lines max. If it needs more, the feature is too big — split it.
