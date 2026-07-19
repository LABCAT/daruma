# CI & regression gates (this repo)

*Locked: 2026-07-19 — harness owned by AG-00; later AGs only add tests into fixed slots.*

## Principle

**CI infrastructure is built once (AG-00 / 00b), complete and boring.**  
Later AGs do **not** invent jobs, workflows, or runners. They only add test files / fill stubs under paths the harness already runs.

If a check cannot assert real behaviour yet (feature not built), the harness still has the **script + job + empty/skip stub** so the slot exists from day one.

## Free stack

| Layer | Tool | Role |
|-------|------|------|
| CI runner | GitHub Actions — one workflow | PR + `main` |
| Unit / Worker | Vitest + `@cloudflare/vitest-pool-workers` | OE + dashboard API |
| Browser E2E | Playwright | Login + OE UI |
| Parity | Script + CI job | Old tool vs new Workers |
| Merge gate | Branch protection → **Build & Test** | Required on `main` |

## Harness layout (AG-00 owns this)

```
.github/workflows/ci.yml          # all jobs below — always present
workers/opportunity-engine/         # vitest: orchestrator / collect / score
apps/dashboard/                   # vitest: auth API; playwright: e2e
scripts/ci/
  parity.mjs                      # exit 1 on material drift (AG-07 fills data)
package.json                      # root scripts: test, test:oe, test:dashboard, test:e2e, test:parity, build:dashboard
```

### Jobs in `ci.yml` (all defined from the start)

| Job / step | From day one | Becomes real when |
|------------|--------------|-------------------|
| `pnpm test` (OE workers) | Smoke stub OK | AG-04–06 add cases |
| `pnpm --filter dashboard build` | Must pass once SPA exists (AG-02a) | AG-02a |
| `pnpm --filter dashboard test` | Placeholder / skip until AG-03 | AG-03 auth tests |
| `pnpm test:e2e` | Playwright installed; one smoke or skip | AG-08 fills |
| `pnpm test:parity` | Script exists; may skip until AG-07 | AG-07 |

Prefer **skip with explicit reason** over missing jobs. Never delete a job to go green.

## Later AGs

Only: add/update tests under the paths above. **No new workflow invention.** Update skip → real assert.

## Branch protection

Require status check **Build & Test** on `main`.
