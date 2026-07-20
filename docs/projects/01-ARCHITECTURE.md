# 01 — Architecture (locked)

*Updated: 2026-07-20 — dashboard = SvelteKit + adapter-cloudflare (UI + API)*

One Daruma command center. No separate Opportunity Engine SPA.

## Layout

```
apps/dashboard/                 # SvelteKit + Cloudflare adapter — daruma.labcat.nz
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
| Dashboard | **SvelteKit** + **`@sveltejs/adapter-cloudflare`** — pages + `/api/*` in one deploy |
| Dashboard data | Same-origin **`+server.ts`** routes — D1 bindings in app `wrangler.toml` |
| Pipeline | Workers + Queues (separate from dashboard) |

Dashboard styles/Svelte org (SCSS + BEM, tokens, reset): [`02-DASHBOARD.md`](02-DASHBOARD.md) § Styles & Svelte org — not duplicated here.

## Workspace

`pnpm-workspace.yaml` must include `apps/*`, `workers/*`, `packages/*`.

Legacy `tools/opportunity-engine/` stays until AG-09 cutover. Do not delete early.

## Rejected (dashboard)

- Plain Svelte without SvelteKit (no integrated server routes)
- Separate dashboard Worker package (API lives in SvelteKit)
- Solid (all variants)
- Client → D1 direct (always via `/api`)
