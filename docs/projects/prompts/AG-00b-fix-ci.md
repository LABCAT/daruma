# AG-00b — Build the full CI harness (repair)

Read `AGENT-RULES.md` + `07-CI-AND-REGRESSION.md`.

**Status (2026-07-19):** Harness landed in-repo (root scripts, `ci.yml` jobs, dashboard vitest/e2e slots, `scripts/ci/parity.mjs`). Re-run this prompt only if those pieces are missing or broken.

## Goal — harness complete

1. Root scripts: `test:oe`, `test:dashboard`, `test:e2e`, `test:parity`, `build:dashboard`
2. `.github/workflows/ci.yml` runs all of them (Playwright Chromium install included)
3. Slot stubs OK until features exist; AG-03/07/08 **fill** them — no new workflows
4. OE path: `workers/opportunity-engine` only

## Verification

Local: `pnpm test:oe && pnpm test:dashboard && pnpm test:e2e && pnpm test:parity && pnpm build:dashboard`  
Actions: **Build & Test** green.
