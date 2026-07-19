# AG-05 — Collect port only

Paste only after AG-04 verified.

## Context

Read: `docs/projects/opportunity-engine/05-PORT-AND-PARITY.md`, `06-ASO-AGENT-LOOP.md`

Port collect behaviour from `tools/opportunity-engine/` **unchanged**. Do not “improve” scrapers or relevance gating.

## Goal

Implement **collect** Worker: one keyword per `raw-ideas` message.

## Build

1. Consume `raw-ideas` (`max_concurrency` 2–3)
2. Scrape/signals for that keyword → write `ideas_raw`
3. On **success only**: upsert `seen_keywords`
4. Publish to `collected-ideas` (payload: enough for score to run — keyword + raw id / signals ref)
5. `pipeline_runs` stage=`collect`
6. Score Worker still stub (may no-op consume or leave unconsumed for AG-06)

## Verification (raw evidence)

1. Collect source (key files)
2. One successful local keyword: `ideas_raw` row + `seen_keywords` row (SQL output)
3. Message published to `collected-ideas` (paste)
4. Failed collect does **not** write `seen_keywords` (show a forced-failure case if practical)
