# AG-07 — Parity gate (agent-owned)

Paste after AG-06. Read `AGENT-RULES.md` + `05-PORT-AND-PARITY.md`. **Feature freeze** — fix mismatches only.

## Goal

Prove new Workers match `tools/opportunity-engine/` on a fixed keyword set. **You decide pass/fail** from the diff — do not wait for founder skim.

## Procedure

1. Fixed 5–8 keywords including canaries `tradie invoice`, `pet business management`, plus score-range spread
2. Run **old** tool; save raw signals + scores
3. Run **new** pipeline (local D1 + wrangler) on the same list
4. Diff raw signals + subtotals; fix port until clean; re-run

## Tests (fill harness)

**CRITICAL: Do not write trivial happy-path tests just to make CI pass. You must write robust, production-grade tests covering edge cases, failure states, and idempotency.**

Replace `scripts/ci/parity.mjs` stub with real diff; `pnpm test:parity` must fail on drift. Existing CI job only.

## Pass

No material drift + `test:parity` green in Actions.

## Fail

Checklist-only / rubric change / parity script still a no-op stub.

Only after pass → AG-08.
