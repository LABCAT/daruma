# AG-02a — Dashboard SPA reset (Solid 1)

Paste **now**. Read `docs/projects/prompts/AGENT-RULES.md` first.

## Why

`apps/dashboard` is still **Solid 2 + TanStack Start**. Convert to **Solid 1 + `@solidjs/router` + Vite SPA**.

## Preserve

`src/styles/**`, all `src/components/**`, `DESIGN.md`, modern-normalize, `/design` content.

## Remove

Start/Router/vinxi/Solid 2 betas; `routeTree.gen.ts`, `tsr.config.json`, `.cta.json`, `.vinxi/`.

## Deps (pin with `^`)

`solid-js@^1.9.14`, `@solidjs/router@^0.16.2`, `vite-plugin-solid@^2.11.13`, vite ^6, sass, typescript, modern-normalize. Keep `lucide-solid` if used.

**Not this prompt:** Hono, `/api`, wrangler Worker, auth.

## Build

1. Rewrite `package.json` + clean Solid-2/Start entries from `pnpm-workspace.yaml` `minimumReleaseAgeExclude`
2. Vite SPA + `index.html`; no `tanstackStart()`
3. `@solidjs/router`: `/` + `/design` using `PageShell`
4. Port components to Solid 1
5. Update README + `AGENTS.md`
6. `pnpm install` && `pnpm --filter dashboard build` && prove `dev` serves `/design`

## Tests (fill harness — do not invent CI)

Ensure `pnpm build:dashboard` passes in the existing AG-00b workflow. No new jobs.

## Verification

`package.json` without Start/Solid 2; build green in Actions; `/design` works.
