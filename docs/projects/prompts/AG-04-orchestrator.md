# AG-04 — Orchestrator only

Paste after AG-03. Read `AGENT-RULES.md` + `docs/projects/opportunity-engine/04-PIPELINE.md`.

## Goal

Implement **orchestrator** Worker only (collect/score stay stubs).

## Build

1. Cron (+ local/dev trigger): load candidate keywords from Phase 0 seed approach in `tools/opportunity-engine/` — enqueue only
2. Skip `seen_keywords` within 90 days
3. One queue message per keyword → `raw-ideas`
4. Write `pipeline_runs` (stage=`orchestrator`)
## Tests (fill harness)

Add orchestrator enqueue / 90-day skip under `pnpm test:oe`. No new workflow.

## Verification

Source + OE tests green in Actions.
