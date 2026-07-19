# AG-01 — Path layout move only

Paste into Antigravity alone. Do not scaffold Solid UI here.

## Context

Read: `docs/projects/01-ARCHITECTURE.md`, `docs/projects/opportunity-engine/04-PIPELINE.md`

Existing stubs live under `apps/opportunity-engine/` (including a dashboard worker). That layout is obsolete.

## Goal

Move pipeline + schema to locked paths. **No UI. No business logic port.**

## End state

```
workers/opportunity-engine/     # orchestrator, collect, score stubs + 3 wrangler configs
packages/db-opportunity-engine/  # schema + migrations
```

- Delete `apps/opportunity-engine/` entirely (including its dashboard worker)
- Update `pnpm-workspace.yaml`: `apps/*`, `workers/*`, `packages/*`
- Preserve: shared D1 `database_id`, `raw-ideas` + `collected-ideas` queues, orchestrator cron stub
- Handlers stay no-op stubs
- Do **not** create full dashboard UI yet — AG-02 is design system (may scaffold `apps/dashboard` for tokens/preview only); AG-03 is Start shell + auth

## Verification (raw evidence only)

1. Directory listing of `workers/` and `packages/`
2. Full `pnpm-workspace.yaml`
3. All three wrangler configs (matching `database_id`)
4. `schema.ts` at new path
5. Proof `apps/opportunity-engine` is gone
6. `pnpm install` + local D1 migrate output
