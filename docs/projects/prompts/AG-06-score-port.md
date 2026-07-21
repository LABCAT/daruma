# AG-06 — Score port only

Paste after AG-05. Read `AGENT-RULES.md`, `05-PORT-AND-PARITY.md`, `06-ASO-AGENT-LOOP.md`, `docs/research/PROMPTS.md`.

Port score from `tools/opportunity-engine/` **unchanged**.

## Goal

**Score** Worker on `collected-ideas`.

## Build

1. Pain / WTP / Discovery / Build Speed → `ideas_ranked` + breakdown JSON
2. `status=pending` when shortlist threshold met (same as Phase 0)
3. `pipeline_runs` stage=`score`
4. No dashboard UI

## Tests (fill harness)

**CRITICAL: Do not write trivial happy-path tests just to make CI pass. You must write robust, production-grade tests covering edge cases, failure states, and idempotency.**

Score / shortlist cases under `pnpm test:oe`.

## Verification

Dump + OE tests green. Parity = **AG-07**.
