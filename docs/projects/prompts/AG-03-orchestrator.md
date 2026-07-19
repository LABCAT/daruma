# AG-03 — Orchestrator only

Paste only after AG-02 verified.

## Context

Read: `docs/projects/opportunity-engine/04-PIPELINE.md`

Source of candidate keywords: mirror Phase 0 seed/list approach in `tools/opportunity-engine/` — enqueue only, do not scrape.

## Goal

Implement **orchestrator** Worker only.

## Build

1. On cron (and a local/dev trigger if useful): load candidate keywords, skip `seen_keywords` within 90 days
2. Enqueue **one message per keyword** onto `raw-ideas`
3. Write `pipeline_runs` row (stage=`orchestrator`, ideas_in/out)
4. No scraping. Collect/score stay stubs.

## Verification (raw evidence)

1. Orchestrator source
2. Local run output showing N messages enqueued
3. D1 query of `pipeline_runs`
4. Queue message shape (paste example payload)
