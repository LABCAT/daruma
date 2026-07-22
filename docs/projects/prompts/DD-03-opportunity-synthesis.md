# DD-03: Opportunity Engine Synthesis

**Goal:** Replace manual “Copy Top 5” with **Synthesize** → new Assistant chat seeded from OE data.

**Depends on:** DD-01 (chat + streaming). DD-02 preferred (context trim + models).

**Read first:** [`AGENT-RULES.md`](AGENT-RULES.md), OE docs under [`../opportunity-engine/`](../opportunity-engine/), [`../02-DASHBOARD.md`](../02-DASHBOARD.md).

## 1. UI

- On pending opportunity cards, add **Synthesize** (replaces or sits beside Copy Top 5).
- On click: create conversation, seed context, navigate to `/chat/[id]`, start stream.

## 2. Backend

- Load that opportunity’s `signals_json` + `score_json` (and any existing OE fields needed).
- Build a **bounded** synthesis prompt (pain points, competitors, intents, scores).
- **Token budget:** cap injected OE context (e.g. trim/summarize JSON so seed + system knowledge fit under the active model’s `contextWindow` and `requestCeilingTokens`). Never dump unbounded raw JSON.
- Store seed as hidden `system` (or dedicated context field) + optional user-visible kickoff message. **View Context** toggle shows what the model received.

## 3. Routing

- Use conversation preferred model (default free Flash or Settings default). Soft affinity + failover from DD-01 still apply.
- No imports from `workers/opportunity-engine` into the browser — server `/api` only; reuse existing OE DB access patterns.

## 4. Tests

- Synthesize creates conversation + at least one message/context row.
- Oversized signals are truncated/summarized under the budget (assert max length or token estimate).
- Unauth / missing opportunity → 4xx.

**Rules:** one PR; BEM/SCSS; auth-gated.
