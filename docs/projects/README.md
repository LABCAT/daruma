# Docs — projects

Internal command center only (not shipped Metal Monkey apps).

**Do work in this order.** Antigravity prompts: [`prompts/`](prompts/).

| # | Doc | Status |
|---|-----|--------|
| 01 | [`01-ARCHITECTURE.md`](01-ARCHITECTURE.md) | Locked — monorepo layout |
| 02 | [`02-DASHBOARD.md`](02-DASHBOARD.md) | Locked — Start + Solid; SCSS/BEM |
| 03 | [`opportunity-engine/03-PURPOSE.md`](opportunity-engine/03-PURPOSE.md) | Product purpose |
| 04 | [`opportunity-engine/04-PIPELINE.md`](opportunity-engine/04-PIPELINE.md) | Workers / queues / D1 |
| 05 | [`opportunity-engine/05-PORT-AND-PARITY.md`](opportunity-engine/05-PORT-AND-PARITY.md) | Port rules + gate |
| 06 | [`opportunity-engine/06-ASO-AGENT-LOOP.md`](opportunity-engine/06-ASO-AGENT-LOOP.md) | Loop / rubric rules |
| 07 | [`07-CI-AND-REGRESSION.md`](07-CI-AND-REGRESSION.md) | CI plan — start with AG-00 |

## Antigravity prompts (run in order — do not combine)

| # | Prompt | After |
|---|--------|-------|
| AG-00 | [`prompts/AG-00-ci-smoke.md`](prompts/AG-00-ci-smoke.md) | — |
| AG-01 | [`prompts/AG-01-layout-move.md`](prompts/AG-01-layout-move.md) | AG-00 |
| AG-02 | [`prompts/AG-02-design-system.md`](prompts/AG-02-design-system.md) | AG-01 — fill [`DESIGN_BRIEF.md`](DESIGN_BRIEF.md) first; **founder visual approve** |
| AG-03 | [`prompts/AG-03-dashboard-shell-auth.md`](prompts/AG-03-dashboard-shell-auth.md) | AG-02 approved |
| AG-04 | [`prompts/AG-04-orchestrator.md`](prompts/AG-04-orchestrator.md) | AG-03 |
| AG-05 | [`prompts/AG-05-collect-port.md`](prompts/AG-05-collect-port.md) | AG-04 |
| AG-06 | [`prompts/AG-06-score-port.md`](prompts/AG-06-score-port.md) | AG-05 |
| AG-07 | [`prompts/AG-07-parity-gate.md`](prompts/AG-07-parity-gate.md) | AG-06 — **blocking** |
| AG-08 | [`prompts/AG-08-oe-pending-ui.md`](prompts/AG-08-oe-pending-ui.md) | AG-07 pass |
| AG-09 | [`prompts/AG-09-health-cutover.md`](prompts/AG-09-health-cutover.md) | AG-08 |

**Next action:** run **AG-00**.

No Storybook / no v0→Solid conversion. Design system = tokens + BEM primitives + preview route (AG-02).

Chat / assistant deferred — [`02-DASHBOARD.md`](02-DASHBOARD.md) § Later.
