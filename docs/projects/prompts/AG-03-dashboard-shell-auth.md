# AG-03 — Dashboard shell + auth (SvelteKit)

Paste after AG-02a + AG-02 check. Read `AGENT-RULES.md`.

## Goal

SvelteKit app on Cloudflare — **same deploy** serves pages and `/api/*`. Auth only. No OE data APIs.

## Build

1. `wrangler.toml` / `wrangler.jsonc` at app root with `adapter-cloudflare` bindings as needed
2. `hooks.server.ts`: session cookie; redirect unauthed UI to `/login`; 401 on unauthed `/api/*` except login
3. Pages: `/login` + gated `/` (redirect if no session)
4. API (`src/routes/api/**/+server.ts`): `POST /api/login`, `POST /api/logout`, `GET /api/me`
5. Cookie: signed HttpOnly / Secure / SameSite=Strict
6. **Local:** `apps/dashboard/.dev.vars` with `DASHBOARD_PASSWORD=` (generate a random value; document in PR — do not commit the file). Prove login via `wrangler dev` / `vite dev`
7. Shell: existing PageShell + BEM. Optional: bind OE D1 in wrangler — **do not** expose OE routes yet

**No separate dashboard Worker package.**

## Tests (fill harness)

**CRITICAL: Do not write trivial happy-path tests just to make CI pass. You must write robust, production-grade tests covering edge cases, failure states, and idempotency.**

Add auth cases under `pnpm test:dashboard` using `@cloudflare/vitest-pool-workers` against `+server.ts` routes: login → me 200; no cookie → 401. Replace placeholder in `auth.slot.test.ts`. Do not add a new workflow.

## Out of scope

OE pending UI, chat, OAuth, prod `wrangler secret` (one-liner in CUTOVER for AG-09).

## Verification

Auth tests green in existing Actions job.
