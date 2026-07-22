# DD-04: GitHub Decisions & Actions

**Goal:** Assistant can draft decisions/ideas; founder approves; knowledge lands in git via GitHub API.

**Depends on:** DD-01 chat UI. Align with [`../02-DASHBOARD.md`](../02-DASHBOARD.md) Decisions/Ideas table and [`../../DARUMA.md`](../../DARUMA.md).

**Read first:** [`AGENT-RULES.md`](AGENT-RULES.md).

## 1. Secrets

- GitHub PAT (contents:write on this repo) in Cloudflare env / `.dev.vars` only.

## 2. Tooling

- Expose `propose_decision` (tool call or strict JSON schema) when the model settles a strategy change or app idea.
- Payload: title, rationale, target path(s), markdown body, type (`decision` | `idea`), sources.
- Lifecycle in D1 if useful: `proposed` → `confirmed` → `superseded`. On conflict with a prior confirmed decision: ask override (do not silent-clobber).

## 3. UI

- When proposed: render an **Approve & Commit** (and Reject) block in the chat transcript — durable, not toast-only.
- On Approve: write via GitHub API.
  - Decisions → update the appropriate doc under `docs/` (e.g. `CURRENT.md` / vision/tracker as specified in the proposal).
  - Ideas → `docs/ideas/`.
- **PR optional** for solo knowledge updates — direct commit to default branch is allowed; prefer a short commit message. Do not require a PR workflow unless Settings says so later.
- Success/fail shown as an `event` (or inline status) in the thread.

## 4. Guardrails

- Never auto-confirm. Never spend / store-submit / brand-fork via this tool.
- No confidential prompts to OpenRouter free hosts — respect `DARUMA.md` OpenRouter note.

## 5. Tests

- Propose → Approve mocks GitHub commit with expected path/content.
- Reject leaves repo untouched.
- Unauth cannot approve.

**Rules:** one PR; fill CI slots.
