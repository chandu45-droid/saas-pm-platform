---
name: pre-commit
description: Sanity checks before committing code
---

## Pre-commit Checks

Before committing, verify:

1. **No secrets:** Grep for API keys, tokens, passwords in staged files. Block if found.
2. **No TODO without ticket:** TODOs must reference a task or be tagged with a version (TODO-V2).
3. **Types pass:** `npx tsc --noEmit` (once code exists).
4. **Lint passes:** `npx next lint` (once code exists).
5. **Tests pass:** `npx vitest run` (once tests exist).

Skip checks 3-5 during product scoping phase (no code yet).
