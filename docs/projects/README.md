# Docs — projects

Internal command center only (not shipped Metal Monkey apps).

**Do work in this order.** Antigravity prompts: [`prompts/`](prompts/).

| # | Doc | Status |
|---|-----|--------|
| 01 | [`01-ARCHITECTURE.md`](01-ARCHITECTURE.md) | Locked — monorepo layout |
| 02 | [`02-DASHBOARD.md`](02-DASHBOARD.md) | Locked — one UI host (TanStack Start) |
| 03 | [`opportunity-engine/03-PURPOSE.md`](opportunity-engine/03-PURPOSE.md) | Product purpose |
| 04 | [`opportunity-engine/04-PIPELINE.md`](opportunity-engine/04-PIPELINE.md) | Workers / queues / D1 |
| 05 | [`opportunity-engine/05-PORT-AND-PARITY.md`](opportunity-engine/05-PORT-AND-PARITY.md) | Port rules + gate |
| 06 | [`opportunity-engine/06-ASO-AGENT-LOOP.md`](opportunity-engine/06-ASO-AGENT-LOOP.md) | Loop / rubric rules |
| 07 | [`07-CI-AND-REGRESSION.md`](07-CI-AND-REGRESSION.md) | Future: Vitest + Playwright + branch protection |

## Antigravity prompts (run in order — do not combine)

| # | Prompt | After |
|---|--------|-------|
| AG-01 | [`prompts/AG-01-layout-move.md`](prompts/AG-01-layout-move.md) | — |
| AG-02 | [`prompts/AG-02-dashboard-shell-auth.md`](prompts/AG-02-dashboard-shell-auth.md) | AG-01 |
| AG-03 | [`prompts/AG-03-orchestrator.md`](prompts/AG-03-orchestrator.md) | AG-02 |
| AG-04 | [`prompts/AG-04-collect-port.md`](prompts/AG-04-collect-port.md) | AG-03 |
| AG-05 | [`prompts/AG-05-score-port.md`](prompts/AG-05-score-port.md) | AG-04 |
| AG-06 | [`prompts/AG-06-parity-gate.md`](prompts/AG-06-parity-gate.md) | AG-05 — **blocking** |
| AG-07 | [`prompts/AG-07-oe-pending-ui.md`](prompts/AG-07-oe-pending-ui.md) | AG-06 pass |
| AG-08 | [`prompts/AG-08-health-cutover.md`](prompts/AG-08-health-cutover.md) | AG-07 |

**Next action:** run **AG-01**.

Chat / assistant features deferred — [`02-DASHBOARD.md`](02-DASHBOARD.md) § Later.
