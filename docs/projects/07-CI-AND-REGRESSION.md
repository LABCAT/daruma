# CI & regression gates (this repo)

*Status: plan only — implement after AG-02+ exist. Not blocking AG-01.*

Goal: a merge to `main` must not ship a broken Daruma dashboard or OE Workers. Today this repo is mostly docs + OE stubs; gates grow with code.

## Free stack (preferred)

| Layer | Tool | Cost | Role |
|-------|------|------|------|
| CI runner | **GitHub Actions** | Free for public; private = monthly free minutes (enough for solo) | Run tests on PR + protect `main` |
| Unit / Worker integration | **Vitest** + **`@cloudflare/vitest-pool-workers`** | Free (OSS) | Auth, server fns, D1/queue handlers in real workerd/Miniflare |
| Browser E2E | **Playwright** | Free (OSS) | Login cookie, OE pending table, Copy Top 5 against `wrangler dev` / preview |
| Merge gate | **Branch protection** | Free on GitHub | Require green CI before merge to `main` |

Cloudflare also documents Vitest-in-Workers and `cloudflare/wrangler-action` for deploy — keep **deploy after green CI**, not instead of it.

## Reject / defer

| Tool | Why |
|------|-----|
| **Ghost Inspector** | No lasting free plan (~$109+/mo after trial). Overlap with Playwright for a solo internal app — skip |
| Hosted no-code runners (BugBug paid tiers, etc.) | Nice UX; not needed when Playwright is free and agent-writable |
| Maestro | Mobile only — use in Toolbox/Dojo repos, not here |

## What each tool covers here

**Vitest (Workers pool)** — best first gate once Workers/dashboard exist:

- Shared-secret auth (401 without cookie; session with cookie)
- OE server functions / loaders (pending list, status updates) against local D1 + migrations
- Orchestrator/score pure logic (no live scrape in CI — mock outbound fetch)

**Playwright** — after there is a UI (AG-02 / AG-07):

- Login → see gated home
- OE: pending list renders; Copy Top 5 / Done mutate status
- Run against local preview URL in Actions (`wrangler dev` or built Start preview)

**Not a substitute for AG-06 parity** — Playwright/Vitest won’t prove Collect/Score match `tools/opportunity-engine/`. Keep parity as a dedicated gate (manual or scheduled job), not as “CI green = rubric correct.”

## Phased rollout (when to add)

| When | Add |
|------|-----|
| Docs-only / AG-01 | Optional: markdown link check. No product CI required |
| After AG-02 | Vitest: auth + Start server routes; CI workflow on PR |
| After AG-03–05 | Vitest: worker handlers with mocked scrape/queue where needed |
| After AG-06 | Optional scheduled/manual parity job — separate from merge CI |
| After AG-07 | Playwright smoke: login + OE pending happy path |
| Before trusting auto-merge | Branch protection: require CI; then tighten per [`DARUMA.md`](../DARUMA.md) auto-merge rules |

## Merge policy (target)

1. PR required for `main` (already founder-merge habit)
2. Required checks: `vitest` (+ `playwright` once added)
3. Deploy Workers only from `main` after green (Wrangler Action or Cloudflare Git integration)
4. Never treat “agent said it works” as a green check

## Agent-facing DoD (when CI exists)

Prompts / `AGENTS.md` in app packages should say: **DoD includes CI green locally** (`pnpm test`, `pnpm test:e2e` as defined). Closed-loop agents stop when those pass — see [`DARUMA.md`](../DARUMA.md) § Making Agents Actually Work.
