# AG-02a — Dashboard SvelteKit scaffold

**Status: done (2026-07-20).** Kept for history. Do not re-run unless `apps/dashboard` is missing or broken.

## Why (historical)

Replaced Solid SPA with **SvelteKit** + `@sveltejs/adapter-cloudflare` — UI + `/api/*` in one deploy.

## End state

- `apps/dashboard` = SvelteKit app
- Components in `src/lib/components/<name>/<Name>.svelte` + `<Name>.scss`
- SCSS is the **first** import in each component `<script>`
- Routes: `/`, `/design`
- CI: `pnpm build:dashboard` + `pnpm test:dashboard` green

## Next

AG-02 design system check → AG-03 auth.
