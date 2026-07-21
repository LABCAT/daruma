# AG-08 — OE pending UI

Paste after AG-07 pass. Read `AGENT-RULES.md`, `02-DASHBOARD.md` § Styles, `apps/dashboard/DESIGN.md`.

## Goal

OE routes in the SvelteKit app (auth from AG-03; tokens from AG-02).

## Build

1. Authenticated `/api` for `ideas_ranked` where `status=pending`, score desc
2. UI `/opportunity` — Svelte + co-located SCSS/BEM `dm-`
3. **Copy Top 5** → clipboard + set `sent_to_synthesis`
4. **Done** per row → `build` | `skip` | `research_more`
5. D1 only on server (`+server.ts`); browser → `/api`
6. Seed local D1 with enough `pending` rows to demo if pipeline empty

## Out of scope

Health panel, seen-keywords tab, chat, synthesise worker.

## Tests (fill harness)

**CRITICAL: Do not write trivial happy-path tests just to make CI pass. You must write robust, production-grade tests covering edge cases, failure states, and idempotency.**

Unskip/fill Playwright under `pnpm test:e2e`: login + pending list (seed D1 in setup).

## Verification

Feature evidence + e2e green in Actions.
