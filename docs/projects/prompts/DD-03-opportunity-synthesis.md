# DD-03: Opportunity Engine Synthesis

**Goal:** **Research** on a pending card opens a seeded Assistant chat (one idea → one chat). Drop **Copy Top 5**. Research-tab cards link back to that chat.

**Depends on:** DD-01 (chat + streaming). DD-02 preferred (context trim + models).

**Read first:** [`AGENT-RULES.md`](AGENT-RULES.md), OE docs under [`../opportunity-engine/`](../opportunity-engine/), [`../02-DASHBOARD.md`](../02-DASHBOARD.md).

## 1. UI

- Remove **Copy Top 5** from pending and research pages.
- Pending card **Research**: create conversation, seed OE context, set status `research_more`, store chat id on the idea, navigate to `/chat/[id]`, start stream.
- Research-tab cards: **Open chat** (or equivalent) → linked conversation. If link missing (legacy rows), offer Research again to create one.

## 2. Backend

- Load that opportunity’s `signals_json` + `score_json` (and any OE fields needed).
- Build a **bounded** synthesis prompt (pain points, competitors, intents, scores).
- **Token budget:** cap injected OE context so seed + system knowledge fit under the active model’s `contextWindow` and `requestCeilingTokens`. Never dump unbounded raw JSON.
- Store seed as hidden `system` (or dedicated context field) + optional user-visible kickoff. **View Context** shows what the model received.
- Persist `conversation_id` on `ideas_ranked` (string; chat lives in dashboard D1 — no cross-DB FK). Migration in `packages/db-opportunity-engine`.
- `sent_to_synthesis` unused by this flow; leave in status check for now (no new writers).

## 3. Routing

- Conversation preferred model (default free Flash or Settings default). Soft affinity + failover from DD-01 still apply.
- No imports from `workers/opportunity-engine` into the browser — server `/api` only; reuse existing OE DB access patterns.

## 4. Tests

- Research creates conversation + context/message row, sets `research_more`, stores `conversation_id`.
- Research card can resolve link to that chat.
- Oversized signals truncated/summarized under budget.
- Unauth / missing opportunity → 4xx.
- Copy Top 5 gone from pending/research UI (e2e or component assert).

**Rules:** one PR; BEM/SCSS; auth-gated.
