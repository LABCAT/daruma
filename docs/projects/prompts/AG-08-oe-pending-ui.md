# AG-08 — OE pending UI

Paste only after AG-07 parity passes.

## Context

Read: `docs/projects/02-DASHBOARD.md`

## Goal

Opportunity Engine **routes** inside `apps/dashboard` (Start shell from AG-03; visual language from AG-02).

## Build

1. Authenticated server function(s) / loader: list `ideas_ranked` where `status=pending`, sort by score desc
2. Route UI (Solid + SCSS/BEM) under e.g. `/opportunity`
3. **Copy Top 5** — clipboard block from raw evidence; mark those rows `sent_to_synthesis`
4. **Done** per row — `build` | `skip` | `research_more`
5. Wire D1 via `packages/db-opportunity-engine`

## Out of scope

Health panel, seen-keywords tab, chat/assistant, synthesise worker.

## Verification (raw evidence)

1. Pending list payload (loader/server fn output)
2. Before/after showing Copy Top 5 status flips
3. Done status update evidence
4. Route path(s) + brief UI description or screenshot path
