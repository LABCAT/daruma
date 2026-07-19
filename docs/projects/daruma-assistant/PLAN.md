# Daruma Assistant Phase 1 Implementation Plan

Foundation for Daruma Assistant: personal Metal Monkey command center — vision/strategy chat, research-backed decisions, doc updates via PR. Aligns with Opportunity Engine patterns (Workers + D1 + Solid SPA).

## Phase 1 purpose (MVP)

Same job as a research-intake session in Cursor:

- Talk through Daruma / Metal Monkey strategy
- **Research + verify** before durable claims (repo docs + live sources)
- Propose markdown changes (`docs/`, `AGENTS.md`, tracker, etc.)
- Capture decisions with rationale → founder approves → GitHub PR (never silent write to `main`)

**Not coding.** No OpenHands dispatch in Phase 1. Not a shipped product.

Not in Phase 1: OpenHands, Open Design, auto-merge, vector RAG, effort/thinking toggles.

**Public URL (default):** `daruma.labcat.nz` — Workers custom domain; founder controls `labcat.nz` DNS.

## Architectural Decisions

### Reused Daruma Decisions
- **Monorepo Structure:** `apps/daruma-assistant` integrated into the existing `pnpm-workspace.yaml`.
- **Backend & Database:** Cloudflare Workers with ES Modules (`type: "module"`), Drizzle ORM, and D1 database.
- **Local Dev Workflow:** `wrangler dev` with local D1 migrations, matching Opportunity Engine.
- **Frontend Framework:** Plain Solid JS + Vite SPA served via Worker static assets. *Why:* [`../opportunity-engine/PHASE_2_MIGRATION_SPEC.md`](../opportunity-engine/PHASE_2_MIGRATION_SPEC.md) establishes this exact pattern (single Worker for API + static assets, no SolidStart) for internal dashboards like Opportunity Engine.

### New Phase 1 Decisions & Rationale
- **Bundled Knowledge with Abstraction:** Knowledge is bundled at build time, accessed via `KnowledgeProvider`. Swap later to GitHub API, vector DB, or graph. Always-in vs retrieve-on-demand — tune after metering exists.
- **First-party free-pool router:** OpenAI-compatible `LLMProvider` with multi-host failover on 429/quota for the same model family. Soft model affinity (chat remembers preferred model; switch allowed; resend full history). **No freellmapi dependency** for Cloudflare.
- **Model selector:** Dropdown of **enabled** models (Settings → enable/disable + failover order). Changing it sets global default (`localStorage` + server preference when logged in) for new chats and the active thread. Context meter = used / **active model** max.
- **Phase 1 providers (minimum):**
  - **Google AI Studio** Gemini Flash — free everyday default
  - **DeepSeek** (and/or OpenRouter free/paid hosts) — cheap escalate + failover
  - **MiniMax** — paid backup (coding stays Claude Code; not chat default)
  - Optional keys: Qwen, Kimi, GLM, Grok — enable when keys exist; prices in [`../../MODEL_COSTS.md`](../../MODEL_COSTS.md)
- **Usage meter + usage route (required):** After each turn: tokens in/out/cache, estimated USD (turn + session + conversation rollup), context used/max. Persist per-message in D1. Dashboard for provider breakdown + 429/failover. Free “remaining” only if provider exposes it.
- **Research tools:** Web/search or fetch + repo knowledge before `propose_decision` when claims need verification.
- **GitHub PR Automation:** Decisions write via GitHub API (branch + PR), not direct push to `main`.
- **Tool Calling for Decisions:** LLM calls `propose_decision` (target path, claim, rationale) — not freeform file edits without a decision record.
- **Auth via Shared Secret:** `DARUMA_ACCESS_TOKEN` on the Worker.

### Cost default for vision chats
Free Flash first → paid escalate per [`../../MODEL_COSTS.md`](../../MODEL_COSTS.md). Later: cost per OpenHands task.

## User Review Required

- **GitHub access for decision PRs:** Fine-grained PAT, this repo only (contents + pull requests) — **approved**. Store as Worker secret `GITHUB_TOKEN` at deploy; never commit.
- **Provider API keys:** Add as Worker secrets when enabling each model family.

## Proposed Changes

### Documentation & CI
#### [NEW] docs/projects/daruma-assistant/ARCHITECTURE.md
Architecture, providers, usage metering, deploy, memory, roadmap. (Follow-on from this PLAN.)
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
Multi-provider OpenAI-compatible client; failover; normalize usage; upstream provider metadata.
#### [NEW] apps/daruma-assistant/shared/llm/pricing.ts
Static $/MTok table aligned with [`../../MODEL_COSTS.md`](../../MODEL_COSTS.md) (unknown→null).
#### [NEW] apps/daruma-assistant/shared/repo/knowledge-provider.ts
`KnowledgeProvider` + `BundledKnowledgeProvider`.

---
### Cloudflare Worker (apps/daruma-assistant/workers/api)
#### [NEW] apps/daruma-assistant/workers/api/wrangler.toml
D1 + secrets: `DARUMA_ACCESS_TOKEN`, `GITHUB_TOKEN`, `GOOGLE_AI_API_KEY`, provider keys as enabled (`DEEPSEEK_*`, `MINIMAX_*`, etc.).
#### [NEW] apps/daruma-assistant/workers/api/src/index.ts
- Auth on all routes
- `GET /`: Solid SPA — chat, model dropdown, usage/context meter, decisions inbox, knowledge sync timestamp, **knowledge browser** (tree + rendered markdown from bundle; optional “open on GitHub” link)
- `GET /api/usage`: session/lifetime/provider breakdown
- `POST /api/chat`: completions + research tools + `propose_decision`; persist usage
- `GET /api/decisions` / `POST /api/decisions/:id`: approve → open PR
- Settings: enabled models list

## Verification Plan

1. Bundle + D1 migrate; `wrangler dev`
2. Auth + knowledge timestamp in UI
3. Flash chat → failover path when forced 429; meter + usage route update
4. Vision chat → research verify → `propose_decision` → approve → PR
5. Confirm no direct commits to `main`
