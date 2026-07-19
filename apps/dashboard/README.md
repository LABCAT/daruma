# Daruma Dashboard

Command center for Metal Monkey Apps (`daruma.labcat.nz`).

## Stack

- **UI:** Solid 1.x SPA + `@solidjs/router` + Vite
- **API:** Cloudflare Worker (`/api/*`) — D1 only on the server
- **Styles:** SCSS + BEM (`dm-` / `--dm-*`). No Tailwind, no CSS Modules

## Dev

```bash
pnpm --filter dashboard run dev
pnpm --filter dashboard run build
```

## Styling

- Tokens: `src/styles/variables.scss`
- Components: one folder + co-located `*.scss` per block (see `DESIGN.md`)
