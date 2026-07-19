# Dashboard agents

Solid **1.x** SPA + `@solidjs/router` + Worker `/api/*`.

## Must follow

- `docs/projects/02-DASHBOARD.md` — stack + SCSS/BEM
- `apps/dashboard/DESIGN.md` — tokens + component folder rules
- Pin package versions (`^x.y.z`) — never `"latest"` / bare beta tags

## Do not

- TanStack Start, SolidStart, Solid 2, TanStack Router
- Tailwind, CSS Modules, Storybook, headless UI kits
- Call D1 from the browser — only via `/api`

## Patterns

- Routes: `@solidjs/router`
- Components: `components/<name>/<Name>.tsx` + `<name>.scss`, BEM `dm-`
- Data: `fetch('/api/...')` with credentials; auth cookie from AG-03+
