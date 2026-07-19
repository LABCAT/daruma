# CI & regression gates (this repo)

*Status: implement starting **AG-00**. Expand checks as AGs land.*

Goal: a merge to `main` must not ship a broken Daruma dashboard or OE Workers.

## Free stack (preferred)

| Layer | Tool | Cost | Role |
|-------|------|------|------|
| CI runner | **GitHub Actions** | Free for public; private = monthly free minutes | Run tests on PR + protect `main` |
| Unit / Worker integration | **Vitest** + **`@cloudflare/vitest-pool-workers`** | Free (OSS) | Auth, server fns, D1/queue handlers in workerd/Miniflare |
| Browser E2E | **Playwright** | Free (OSS) | Login + OE UI (after AG-03 / AG-08) |
| Merge gate | **Branch protection** | Free on GitHub | Require green CI before merge to `main` |

## Reject / defer

| Tool | Why |
|------|-----|
| **Ghost Inspector** | No lasting free plan — skip |
| **Storybook** | Not for v1 internal dash — tokens preview route in AG-02 instead |
| Maestro | Mobile repos only |

## Phased rollout

| When | Add |
|------|-----|
| **AG-00** | Vitest smoke + Actions workflow; enable branch protection |
| AG-03 | Vitest: auth routes |
| AG-04–06 | Vitest: worker handlers (mock scrape) |
| AG-07 | Parity job separate from merge CI |
| AG-08 | Playwright: login + OE pending |
| Before auto-merge | Required checks only; see [`DARUMA.md`](../DARUMA.md) |

## Automation ladder

1. AG-00 CI green required on PRs  
2. Agents open PRs; auto-merge when checks green (scoped paths)  
3. Chain AG-n merge → open AG-n+1 issue  

Founder still: Cloudflare secrets, DNS, AG-02 **visual approve**, AG-07 parity skim.
