---
name: dashboard-svelte
description: >-
  SvelteKit dashboard conventions: lib components, co-located SCSS, import order, and strict styling rules.
  Use when editing ANY Svelte file in apps/dashboard (components, routes, layouts, pages, styles, or DESIGN.md).
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
- **Strict Design System**: The design system MUST be strictly followed. **Before creating ANY new styles or UI elements, you MUST read `src/routes/design/+page.svelte` (the `/design` route) to see what components already exist (e.g., `TableRow`, `Badge`, `Alert`).** Do not reinvent existing components or use native HTML tags (like `<table>`) when a design system component exists.
- **Strict BEM & No Style Blocks**: `dm-` + `--dm-*` tokens must be used. No inline design styles. **ABSOLUTELY NO scoped `<style>` blocks in ANY Svelte file (components, routes, +page.svelte, etc).** All CSS must be in separate `.scss` files and imported at the top of the script tag.
- **Strict CSS Variables**: You MUST strictly use the CSS variables defined in `index.scss` for colors (e.g., `var(--dm-color-surface)`). It is strictly forbidden to hardcode raw hex/rgb colors, and strictly forbidden to use class-based dark mode overrides (like `:global(body.dark)`). The design system relies natively on `data-theme` variable resolution.
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
