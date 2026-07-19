# Docs — projects

Internal command center only (not shipped Metal Monkey apps).

**Standing rules:** [`prompts/AGENT-RULES.md`](prompts/AGENT-RULES.md).  
**CI:** [`07-CI-AND-REGRESSION.md`](07-CI-AND-REGRESSION.md) — full harness in **AG-00b**; later AGs only fill slots.

| # | Doc | Status |
|---|-----|--------|
| 01 | [`01-ARCHITECTURE.md`](01-ARCHITECTURE.md) | Locked — Solid SPA dashboard |
| 02 | [`02-DASHBOARD.md`](02-DASHBOARD.md) | Locked — Solid 1 SPA + Worker API; SCSS/BEM |
| 03–06 | [`opportunity-engine/`](opportunity-engine/) | Purpose / pipeline / parity / ASO |
| 07 | [`07-CI-AND-REGRESSION.md`](07-CI-AND-REGRESSION.md) | CI |

## Antigravity prompts (order — do not combine)

| # | Prompt | Notes |
|---|--------|-------|
| AG-00b | [`AG-00b-fix-ci.md`](prompts/AG-00b-fix-ci.md) | **Done in-repo** — re-run only if harness broken |
| AG-02a | [`AG-02a-spa-reset.md`](prompts/AG-02a-spa-reset.md) | Vite SPA; fill `build:dashboard` slot |
| AG-02 | [`AG-02-design-system.md`](prompts/AG-02-design-system.md) | Check vs brief — **no approve wait** |
| AG-03 | [`AG-03-dashboard-shell-auth.md`](prompts/AG-03-dashboard-shell-auth.md) | Adds Worker + `/api` + auth |
| AG-04 | [`AG-04-orchestrator.md`](prompts/AG-04-orchestrator.md) | |
| AG-05 | [`AG-05-collect-port.md`](prompts/AG-05-collect-port.md) | |
| AG-06 | [`AG-06-score-port.md`](prompts/AG-06-score-port.md) | |
| AG-07 | [`AG-07-parity-gate.md`](prompts/AG-07-parity-gate.md) | Agent-owned pass/fail |
| AG-08 | [`AG-08-oe-pending-ui.md`](prompts/AG-08-oe-pending-ui.md) | |
| AG-09 | [`AG-09-health-cutover.md`](prompts/AG-09-health-cutover.md) | Code always; prod only if CF access |

**Founder only if needed:** merge PRs; AG-09 Cloudflare login/DNS/secrets when agent cannot. Not mid-sequence questions or visual approve.
