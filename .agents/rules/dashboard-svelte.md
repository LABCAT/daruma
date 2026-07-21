---
name: dashboard-svelte
description: >-
  SvelteKit dashboard conventions: lib components, co-located SCSS, import order.
  Use when editing apps/dashboard components, styles, routes, or DESIGN.md.
paths:
  - "apps/dashboard/**"
---

# Dashboard (SvelteKit)

Stack: SvelteKit + `@sveltejs/adapter-cloudflare` — pages and `/api/*` in one deploy.

## Must

- Specs: `docs/projects/02-DASHBOARD.md`, tokens/process: `apps/dashboard/DESIGN.md`
- Components: `src/lib/components/<name>/<Name>.svelte` + co-located `<Name>.scss`
- **SCSS is always the first import** in a component `<script>` (before types, Svelte, other modules)
- Svelte 5 Runes mode only: use `$props()`, `$state()`, `$derived()`, etc.
- BEM `dm-` + `--dm-*` tokens; no inline design styles
- Pin deps at current stable (`pnpm view`); never `"latest"` / stale majors — see `package-versions`

## Must not

- Svelte 4 legacy syntax (`export let`, `$:`)
- Plain Svelte (no kit), separate dashboard Worker
- Tailwind, CSS Modules, Storybook, headless UI kits
- `<style>` blocks for design
- Browser → D1 (only via `/api`)

## Patterns

- Routes: `src/routes/`
- API: `src/routes/api/**/+server.ts`
- Auth: `hooks.server.ts` (AG-03+)
- Data: `fetch('/api/...')` with credentials
