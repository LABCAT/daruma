# AG-05 — Collect port only

Paste after AG-04. Read `AGENT-RULES.md`, `05-PORT-AND-PARITY.md`, `06-ASO-AGENT-LOOP.md`.

Port collect from `tools/opportunity-engine/` **unchanged**. Do not “improve” scrapers or gating.

## Goal

**Collect** Worker: one keyword per `raw-ideas` message.

## Build

1. Consume `raw-ideas` (`max_concurrency` 2–3)
2. Scrape/signals → `ideas_raw`
3. On **success only**: upsert `seen_keywords`
4. Publish `collected-ideas` (keyword + raw id / signals ref)
5. `pipeline_runs` stage=`collect`
6. Score may stay stub

## Tests (fill harness)

**CRITICAL: Do not write trivial happy-path tests just to make CI pass. You must write robust, production-grade tests covering edge cases, failure states, and idempotency.**

Collect success/failure `seen_keywords` cases under `pnpm test:oe`.

## Verification

Evidence + OE tests green.
