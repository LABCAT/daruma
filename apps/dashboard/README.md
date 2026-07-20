# Daruma Dashboard

Command center for Metal Monkey Apps (`daruma.labcat.nz`).

## Stack

- **App:** SvelteKit + `@sveltejs/adapter-cloudflare` (pages + `/api/*` in one deploy)
- **Data:** D1 only on the server ? browser calls `/api/*`
- **Styles:** SCSS + BEM (`dm-` / `--dm-*`). No Tailwind, no CSS Modules

## Dev

```bash
pnpm --filter dashboard run dev
pnpm --filter dashboard run build
```

## Styling

- Tokens: `src/styles/variables.scss`
- Components: `src/lib/components/<name>/<Name>.svelte` + `<Name>.scss` (see `DESIGN.md`)
