# Docs — projects

Internal command center only (not shipped Metal Monkey apps).

**Standing rules:** [`prompts/AGENT-RULES.md`](prompts/AGENT-RULES.md).  
**CI:** [`07-CI-AND-REGRESSION.md`](07-CI-AND-REGRESSION.md) — full harness in **AG-00b**; later tickets only fill slots.

| # | Doc | Status |
|---|-----|--------|
| 01 | [`01-ARCHITECTURE.md`](01-ARCHITECTURE.md) | Locked — SvelteKit dashboard |
| 02 | [`02-DASHBOARD.md`](02-DASHBOARD.md) | Locked — SvelteKit + adapter-cloudflare; SCSS/BEM |
| 03–06 | [`opportunity-engine/`](opportunity-engine/) | Purpose / pipeline / parity / ASO |
| 07 | [`07-CI-AND-REGRESSION.md`](07-CI-AND-REGRESSION.md) | CI |

## Antigravity prompts (order — do not combine)

Run **one DD per PR**. Read `AGENT-RULES.md` + linked strategy docs before coding.

| # | Prompt | Notes |
|---|--------|-------|
| DD-01 | [`DD-01-chat-foundation.md`](prompts/DD-01-chat-foundation.md) | Chat UI, D1, streaming, usage, failover + `event` rows |
| DD-02 | [`DD-02-models-and-memory.md`](prompts/DD-02-models-and-memory.md) | `MODELS_CONFIG`, dual ceilings, cache-friendly prompts, git+D1 memory |
| DD-03 | [`DD-03-opportunity-synthesis.md`](prompts/DD-03-opportunity-synthesis.md) | OE Synthesize → seeded chat (token-budgeted) |
| DD-04 | [`DD-04-git-decisions.md`](prompts/DD-04-git-decisions.md) | `propose_decision` → Approve & Commit (PR optional) |

**Founder only if needed:** merge PRs; AG-09 Cloudflare login/DNS/secrets when agent cannot. Not mid-sequence taste gates.
