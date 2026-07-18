# Daruma Assistant Phase 1 Implementation Plan

Foundation for Daruma Assistant: day-to-day control plane for vision/strategy chat, decision capture, and doc updates via PR. Aligns with Opportunity Engine patterns (Workers + D1 + Solid SPA).

## Phase 1 purpose (MVP)

Same job as a research-intake session in Cursor:

- Talk through Daruma vision and strategy
- Propose durable changes to markdown (`docs/`, `AGENTS.md`, tracker, etc.)
- Capture decisions with rationale → founder approves → GitHub PR (never silent write to `main`)

Not in Phase 1: OpenHands dispatch, Open Design, auto-merge, vector RAG.

**Public URL (default):** `daruma.labcat.nz` — Workers custom domain; founder controls `labcat.nz` DNS.

## Architectural Decisions

### Reused Daruma Decisions
- **Monorepo Structure:** `apps/daruma-assistant` integrated into the existing `pnpm-workspace.yaml`.
- **Backend & Database:** Cloudflare Workers with ES Modules (`type: "module"`), Drizzle ORM, and D1 database.
- **Local Dev Workflow:** `wrangler dev` with local D1 migrations, matching Opportunity Engine.
- **Frontend Framework:** Plain Solid JS + Vite SPA served via Worker static assets. *Why:* `docs/PHASE_2_MIGRATION_SPEC.md` establishes this exact pattern (single Worker for API + static assets, no SolidStart) for internal dashboards like Opportunity Engine.

### New Phase 1 Decisions & Rationale
- **Bundled Knowledge with Abstraction:** Knowledge is bundled at build time, accessed via `KnowledgeProvider`. Swap later to GitHub API, vector DB, or graph.
- **Multi-model router:** OpenAI-compatible `LLMProvider` with a **model selector** (dropdown). Changing it sets the **global default** (persisted `localStorage` + server preference when logged in) for new chats and the active thread. Phase 1 providers at minimum:
  - **Google AI Studio** (Gemini Flash-class and peers) — primary for Cloudflare-hosted assistant
  - **MiniMax** — paid reliable backup
  - **freellmapi** — picker option only when `FREELLMAPI_BASE_URL` is set. Full rules: [`DARUMA.md`](DARUMA.md) (local Claude Code now; Hetzner/public `/v1` for Cloudflare later; not plain Workers).
- **Cold-start default:** **Google Flash** until freellmapi URL is configured; then freellmapi may be default. Selector = global default.
- **Usage meter (required in MVP UI):** After each turn show tokens in/out (and cache read if present), **estimated USD** for that turn + session, and **context window state** (used / model max, including knowledge-bundle estimate). Persist per-message usage in D1.
- **GitHub PR Automation:** Decisions write via GitHub API (branch + PR), not direct push to `main`.
- **Tool Calling for Decisions:** LLM calls `propose_decision` (target path, claim, rationale) — not freeform file edits without a decision record.
- **Auth via Shared Secret:** `DARUMA_ACCESS_TOKEN` on the Worker.

### Cost default for vision chats
Selector is the product. Cloudflare MVP: Google Flash → MiniMax. freellmapi only after a reachable gateway (see [`DARUMA.md`](DARUMA.md) freellmapi table).

## User Review Required

- **GitHub access for decision PRs:** Fine-grained PAT, this repo only (contents + pull requests) — **approved**. Store as Worker secret `GITHUB_TOKEN` at deploy; never commit.
- **Cold-start / freellmapi:** Google Flash on Cloudflare until `FREELLMAPI_BASE_URL` set. Local freellmapi for Claude Code is independent and can start anytime.

## Proposed Changes

### Documentation & CI
#### [NEW] docs/DARUMA_ASSISTANT.md
Architecture, providers, usage metering, deploy, memory, roadmap.
#### [NEW] .github/workflows/deploy-assistant.yml
Rebuild knowledge bundle + deploy when `docs/**`, `AGENTS.md`, or `tracker/APPS.md` change.

---
### App Scaffolding (apps/daruma-assistant)
#### [NEW] apps/daruma-assistant/package.json & tsconfig.json
#### [NEW] apps/daruma-assistant/scripts/bundle-knowledge.ts
Compile markdown into `shared/knowledge-bundle.ts` + `BUILD_TIMESTAMP`.

---
### Database Schema (apps/daruma-assistant/db)
#### [NEW] apps/daruma-assistant/db/schema.ts
- `conversations`: id, title, selected_model, selected_provider, created_at, updated_at
- `messages`: id, conversation_id, role, content, model, provider, tokens_in, tokens_out, tokens_cache, cost_usd_estimate, created_at
- `memories`: id, content, type (summary/extracted), created_at
- `decisions`:
  - id, status (proposed/approved/rejected/superseded)
  - content, rationale, context, target_path (nullable)
  - conversation_id (FK), message_id (FK)
  - github_pr_url (nullable)
  - created_at, updated_at
#### [NEW] apps/daruma-assistant/drizzle.config.ts

---
### Shared Logic (apps/daruma-assistant/shared)
#### [NEW] apps/daruma-assistant/shared/llm/provider.ts
Multi-provider OpenAI-compatible client; normalize usage; freellmapi metadata passthrough when present.
#### [NEW] apps/daruma-assistant/shared/llm/pricing.ts
Static $/MTok table for estimates (Google / MiniMax / unknown→null).
#### [NEW] apps/daruma-assistant/shared/repo/knowledge-provider.ts
`KnowledgeProvider` + `BundledKnowledgeProvider`.

---
### Cloudflare Worker (apps/daruma-assistant/workers/api)
#### [NEW] apps/daruma-assistant/workers/api/wrangler.toml
D1 + secrets: `DARUMA_ACCESS_TOKEN`, `GITHUB_TOKEN`, `GOOGLE_AI_API_KEY`, `MINIMAX_API_KEY`, `FREELLMAPI_KEY` / base URL.
#### [NEW] apps/daruma-assistant/workers/api/src/index.ts
- Auth on all routes
- `GET /`: Solid SPA — chat, **model dropdown** (persisted preference), usage/context meter, decisions inbox, knowledge sync timestamp
- `POST /api/chat`: completions + `propose_decision`; persist usage
- `GET /api/decisions` / `POST /api/decisions/:id`: approve → open PR

## Verification Plan

1. Bundle + D1 migrate; `wrangler dev`
2. Auth + knowledge timestamp in UI
3. Same conversation on Google / MiniMax; meter updates. freellmapi only if `FREELLMAPI_BASE_URL` set (show upstream provider when API returns it)
4. Vision chat → `propose_decision` → approve → PR against a docs file
5. Confirm no direct commits to `main`
