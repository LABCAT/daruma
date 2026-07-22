# Agent standing rules (DD + AG prompts)

1. **Docs + defaults first.** Prefer [`docs/DARUMA.md`](../../DARUMA.md), [`docs/MODEL_COSTS.md`](../../MODEL_COSTS.md), [`02-DASHBOARD.md`](../02-DASHBOARD.md), [`DESIGN_BRIEF.md`](../DESIGN_BRIEF.md). One PR per DD/AG; then next.
2. **Escalate only:** spending, public launches, brand forks, prod secrets. Do not invent strategy into git without the DD-04 approve path.
3. **No visual approve gate.** `DESIGN_BRIEF.md` is taste law.
4. **Local secrets:** `apps/dashboard/.dev.vars` (gitignored). Prod secrets only via AG-09 / founder Wrangler.
5. **Pin versions** (`^x.y.z`). Never `"latest"` / `"*"`.
6. **CI harness is AG-00/00b only.** Later tickets **fill test slots** under existing scripts/jobs (`07-CI-AND-REGRESSION.md`). Do not add ad-hoc workflows. Do not delete jobs. Turn `skip` → real asserts when the feature lands. **Do not write trivial tests just to pass CI** — cover edge cases, failure states, idempotency (429 failover, auth, empty history).
7. **Evidence:** PR shows tests added to the harness + Actions green.
8. **Stack:** SvelteKit + adapter-cloudflare, SCSS + BEM (`dm-` prefix), D1 server-side only, auth via existing `hooks.server.ts`. No freellmapi inside Workers.
9. **Do not scaffold shipped Metal Monkey apps** in this repo.
