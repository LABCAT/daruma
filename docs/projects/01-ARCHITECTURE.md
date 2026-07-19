# 01 — Architecture (locked)

*Updated: 2026-07-19 — dashboard = Solid SPA (no Start)*

One Daruma command center. No separate Opportunity Engine SPA.

## Layout

```
apps/dashboard/                 # Solid 1 SPA + Worker API — daruma.labcat.nz
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
| Dashboard UI | **Solid 1 SPA** + **`@solidjs/router`** + Vite |
| Dashboard data | Same-origin **Worker API** (`/api/*`) from AG-03 — plain handlers fine; Hono optional |
| Pipeline | Workers + Queues (separate from dashboard) |

Dashboard styles/Solid org (SCSS + BEM, tokens, reset): [`02-DASHBOARD.md`](02-DASHBOARD.md) § Styles & Solid org — not duplicated here.

## Workspace

`pnpm-workspace.yaml` must include `apps/*`, `workers/*`, `packages/*`.

Legacy `tools/opportunity-engine/` stays until AG-09 cutover. Do not delete early.

## Rejected (dashboard)

- TanStack Start / SolidStart (overkill for internal SPA + chat; agent tax on bleeding-edge)
- Solid 2 beta (not ready with meta-frameworks; pin Solid 1.x)
- TanStack Router for dashboard (use `@solidjs/router`)
- Client → D1 direct (always via Worker API)
