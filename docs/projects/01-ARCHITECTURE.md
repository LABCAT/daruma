# 01 — Architecture (locked)

*Updated: 2026-07-19*

One Daruma command center. No separate Opportunity Engine SPA.

## Layout

```
apps/dashboard/                 # TanStack Start (Solid) — daruma.labcat.nz
workers/opportunity-engine/     # one package, three deploy targets
  src/shared/
  src/orchestrator/
  src/collect/
  src/score/
  wrangler.orchestrator.toml
  wrangler.collect.toml
  wrangler.score.toml
packages/db-opportunity-engine/ # Drizzle schema + migrations for OE D1
```

`packages/db-dashboard/` — only if dashboard needs its own D1 (chat/settings). Auth can stay a Worker secret for now.

## Tooling

| Decision | Value |
|----------|-------|
| Language | TypeScript |
| Package manager | pnpm 11 |
| Runtime | Node 24 LTS |
| ORM | Drizzle + drizzle-kit → D1 (OE + later chat) |
| Dashboard UI | **TanStack Start + Solid** on Cloudflare Workers |
| Pipeline | Workers + Queues (no Start) |

## Workspace

`pnpm-workspace.yaml` must include `apps/*`, `workers/*`, `packages/*`.

Legacy `tools/opportunity-engine/` stays until AG-09 cutover. Do not delete early.

## Current repo state (pre AG-01)

Scaffold already exists at **`apps/opportunity-engine/`** (old layout: OE package includes a dashboard worker). AG-01 moves it to the layout above.
