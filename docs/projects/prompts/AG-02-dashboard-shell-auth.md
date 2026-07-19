# AG-02 — Dashboard shell + auth (TanStack Start)

Paste only after AG-01 verified.

## Context

Read: `docs/projects/02-DASHBOARD.md`, `docs/projects/01-ARCHITECTURE.md`

## Goal

Create `apps/dashboard` with **`@tanstack/solid-start`** on Cloudflare Workers. Auth only. **No OE data routes yet.**

## Build

1. Scaffold TanStack Start (Solid) + `@cloudflare/vite-plugin` + Wrangler (`nodejs_compat` as required by current TanStack CF docs)
2. File routes: at least login + a gated placeholder home (prove routing)
3. Shared-secret password (`wrangler secret`); signed HttpOnly/Secure/SameSite=Strict cookie
4. Server functions or server routes: login / logout / me (or equivalent)
5. Unauthenticated users see login; gated routes redirect or 401 without cookie
6. SCSS + BEM on the shell (no CSS Modules, no component library)
7. Bind OE D1 in wrangler if convenient — do not expose OE loaders/APIs yet

## Out of scope

OE pending table, Copy Top 5, chat, OAuth/magic-link, Electric/TanStack DB.

## Verification (raw evidence)

1. Tree under `apps/dashboard` (show route files)
2. `wrangler` / vite config
3. Login → cookie → me/session succeeds; without cookie → rejected (paste responses)
4. `wrangler dev` / `vite dev` start output
