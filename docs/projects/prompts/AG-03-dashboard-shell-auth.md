# AG-03 — Dashboard shell + auth (Solid SPA)

Paste after AG-02a + AG-02 check. Read `AGENT-RULES.md`.

AG-02a did **not** add a Worker — **you add it here.**

## Goal

Solid 1 SPA + Cloudflare Worker serving static assets + `/api/*`. Auth only. No OE data APIs.

## Build

1. Wire Worker (plain `fetch` router is enough): serve Vite build assets; SPA fallback to `index.html`
2. Client routes: `/login` + gated `/` (redirect if no session)
3. API: `POST /api/login`, `POST /api/logout`, `GET /api/me`
4. Cookie: signed HttpOnly / Secure / SameSite=Strict
5. **Local:** `apps/dashboard/.dev.vars` with `DASHBOARD_PASSWORD=` (generate a random value; document in PR — do not commit the file). Prove login with that value via `wrangler dev` / vite+worker dev
6. Unauthed `/api/*` (except login) → 401; gated UI redirects to `/login`
7. Shell: existing PageShell + BEM. Optional: bind OE D1 in wrangler — **do not** expose OE routes yet
## Tests (fill harness)

Add auth cases under `pnpm test:dashboard` (login → me 200; no cookie → 401). Unskip stubs. Do not add a new workflow.

## Out of scope

OE pending UI, chat, OAuth, prod `wrangler secret` (one-liner in CUTOVER for AG-09).

## Verification

Auth tests green in existing Actions job.
