# 04 — Pipeline (Workers)

*Updated: 2026-07-19*

## Why Workers

Phase 0 is one long local loop (~90–100 min / 65 keywords). Workers cannot do that in one invocation. **One keyword per collect invocation** via Queues.

## Flow

```
Cron (daily)
  → orchestrator  (no scrape; enqueue 1 msg/keyword → raw-ideas)
  → Queue: raw-ideas          (max_concurrency 2–3)
  → collect                   (scrape one keyword → ideas_raw; seen_keywords on SUCCESS only)
  → Queue: collected-ideas
  → score                     (rubric → ideas_ranked; status=pending if shortlist)
```

Three Workers, one package: `workers/opportunity-engine/`. No HTTP on pipeline workers.

## D1 (`daruma-opportunity-engine`)

One shared DB. Schema package: `packages/db-opportunity-engine`.

| Table | Purpose |
|-------|---------|
| `ideas_raw` | Scraped signals JSON |
| `ideas_ranked` | Scores + `status` |
| `seen_keywords` | 90-day dedupe (success only) |
| `pipeline_runs` | Stage in/out — “is it broken?” |

**Status:** `pending` → `sent_to_synthesis` (Copy Top 5) → optional `build` / `skip` / `research_more`.

No `ideas_final`. No synthesise worker. Clean start — do not import old `seen_keywords.json`.

Dashboard Worker binds this D1 read/write for OE UI APIs.
