# AG-01 — Path layout move only

Paste into Antigravity alone. Do not scaffold dashboard UI here.

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

- **Move** (do not rewrite logic):
  - `apps/opportunity-engine/workers/{orchestrator,collect,score}` + `shared/` → `workers/opportunity-engine/`
  - `apps/opportunity-engine/db/` (+ drizzle config as needed) → `packages/db-opportunity-engine/`
- Old dashboard worker (`apps/opportunity-engine/workers/dashboard/`) is **not** moved — SvelteKit dashboard is AG-02/02a/03; leave old worker behind when the old package is removed
- After the move, remove the now-empty `apps/opportunity-engine/` tree (git mv / relocate, not a blind delete of content)
- Update `pnpm-workspace.yaml`: `apps/*`, `workers/*`, `packages/*`
- Preserve: shared D1 `database_id`, `raw-ideas` + `collected-ideas` queues, orchestrator cron stub
- Handlers stay no-op stubs
- Do **not** create full dashboard UI yet — AG-02 tokens/preview; **AG-02a** SvelteKit scaffold; AG-03 shell + auth

## Verification (raw evidence only)

1. Directory listing of `workers/` and `packages/`
2. Full `pnpm-workspace.yaml`
3. All three wrangler configs (matching `database_id`)
4. `schema.ts` at new path
5. Proof `apps/opportunity-engine` is gone (content relocated, not discarded)
6. `pnpm install` + local D1 migrate output
