# AG-00 — CI foundation

*Law: the harness is complete here. Later AGs only fill test slots — they do not design CI.*

## Intent

Rock-solid, free merge gate for the whole AG-01→09 sequence: one workflow, fixed jobs/scripts/dirs, branch protection docs. Not a single stub that “we’ll grow somehow.”

## Must exist when AG-00 (or 00b repair) is done

1. Root scripts: `test`, `test:oe`, `test:dashboard`, `test:e2e`, `test:parity`, `build:dashboard`
2. `.github/workflows/ci.yml` running **all** of those (skip allowed only with named reason until feature lands)
3. Vitest + workerd for `workers/opportunity-engine`
4. Playwright installed + config under `apps/dashboard` (or repo `e2e/`)
5. `scripts/ci/parity.mjs` stub (exit 0 + “not implemented” until AG-07 replaces)
6. Paths valid for **post–AG-01** layout (`workers/opportunity-engine`)
7. Branch protection instructions for job **Build & Test**

## Failure we hit

Only one stub test + fragile path. That is **not** AG-00 done. Repair with **AG-00b**.
