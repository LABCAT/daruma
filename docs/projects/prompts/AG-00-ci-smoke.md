# AG-00 — CI smoke (before layout move)

Paste into Antigravity alone. Do this before AG-01 so later PRs can go green without founder re-testing by hand.

## Context

Read: `docs/projects/07-CI-AND-REGRESSION.md`, `docs/projects/01-ARCHITECTURE.md`

Current scaffold may still be under `apps/opportunity-engine/` until AG-01. Write CI so paths can be updated in AG-01 with minimal churn — or add CI against current paths and fix paths in AG-01 (either OK; document which).

## Goal

Minimal **free** merge gate:

1. **Vitest** + `@cloudflare/vitest-pool-workers` smoke (worker loads / D1 migrate / trivial assert)
2. **GitHub Actions** on pull_request + push to `main`
3. Document how to enable **branch protection** (required check) — founder may click the GitHub UI once

No Playwright yet. No business logic. No dashboard UI.

## Verification (raw evidence)

1. Workflow YAML contents
2. Local `pnpm test` (or filter) output passing
3. Actions run URL or log paste from a PR/push
