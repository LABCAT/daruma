# AG-07 — Parity gate (no new features)

Paste only after AG-06 verified. **Feature freeze** — fix mismatches only.

## Context

Read: `docs/projects/opportunity-engine/05-PORT-AND-PARITY.md`

## Goal

Prove new Workers match `tools/opportunity-engine/` on a fixed keyword set.

## Procedure

1. Fixed 5–8 keywords including canaries `tradie invoice`, `pet business management`, plus score-range spread
2. Run **old** tool on that list; save raw signals + scores
3. Run **new** pipeline (`wrangler dev` + local D1) on the same list
4. Diff **raw signals** (competitor apps, relevance, hit counts) and subtotals
5. Any mismatch → fix port → re-run until clean

## Pass criteria

Side-by-side diff with no material behaviour drift. Paste both full outputs + diff.

## Fail

“Looks close” / checklist-only / changed rubric to make tests pass.

**Do not start AG-08 until this passes.**
