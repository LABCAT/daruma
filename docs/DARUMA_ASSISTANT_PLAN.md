# Daruma Assistant Phase 1 Implementation Plan

This document outlines the foundation for Daruma Assistant, aligning with both the existing Opportunity Engine architectural patterns and the detailed requirements for knowledge, memory, and automated decision capture.

## Architectural Decisions

### Reused Daruma Decisions
- **Monorepo Structure:** `apps/daruma-assistant` integrated into the existing `pnpm-workspace.yaml`.
- **Backend & Database:** Cloudflare Workers with ES Modules (`type: "module"`), Drizzle ORM, and D1 database.
- **Local Dev Workflow:** `wrangler dev` with local D1 migrations, matching Opportunity Engine.
- **Frontend Framework:** Plain Solid JS + Vite SPA served via Worker static assets. *Why:* `docs/PHASE_2_MIGRATION_SPEC.md` establishes this exact pattern (single Worker for API + static assets, no SolidStart) for internal dashboards like Opportunity Engine.

### New Phase 1 Decisions & Rationale
- **Bundled Knowledge with Abstraction:** Knowledge is bundled at build time, but accessed via an interface (`KnowledgeProvider`). *Why:* Workers lack filesystem access. The abstraction ensures we can easily swap to GitHub API, Vector DB, or Graph queries in future phases.
- **GitHub PR Automation:** Decisions write back to the repo via the GitHub API (creating a branch and PR) rather than stopping at a D1 flag. *Why:* Prevents manual copy-pasting, completing the lifecycle of converting chat to durable knowledge while enforcing a review step.
- **Tool Calling for Decisions:** The LLM will explicitly call a `propose_decision` tool instead of relying on implicit text parsing. *Why:* Ensures precise, deliberate extraction of decisions with source tracing.
- **Auth via Shared Secret:** Simple `DARUMA_ACCESS_TOKEN` validation on the Worker. *Why:* Prevents unauthorized access to sensitive repository knowledge and decision approvals.

## User Review Required

- **GitHub PR API Token:** The Worker will need a GitHub Personal Access Token (`GITHUB_TOKEN`) with `repo` scope to open PRs. Please confirm this is acceptable.
- **Default LLM Provider:** I will set the default provider to a reliable, paid model (e.g., `gpt-4o-mini` or `claude-3-5-sonnet` via an OpenAI-compatible endpoint if applicable) for high-quality reasoning. `freellmapi` (hosted externally) will remain a documented opt-in config. Please confirm your preferred default model name.

## Proposed Changes

### Documentation & CI
#### [NEW] docs/DARUMA_ASSISTANT.md
Document architecture, data model, Cloudflare deployment, LLM provider strategy, memory strategy, and future roadmap.
#### [NEW] .github/workflows/deploy-assistant.yml
GitHub Action to automatically rebuild the knowledge bundle and redeploy the Worker when `docs/**`, `AGENTS.md`, or `tracker/APPS.md` change, ensuring the assistant is never stale.

---
### App Scaffolding (apps/daruma-assistant)
#### [NEW] apps/daruma-assistant/package.json & tsconfig.json
Standard ES module setup, matching `opportunity-engine` (drizzle-orm, @cloudflare/workers-types).
#### [NEW] apps/daruma-assistant/scripts/bundle-knowledge.ts
Pre-build script to compile markdown docs into `shared/knowledge-bundle.ts`. It will embed a `BUILD_TIMESTAMP` for the UI staleness indicator.

---
### Database Schema (apps/daruma-assistant/db)
#### [NEW] apps/daruma-assistant/db/schema.ts
- `conversations`: id, title, created_at, updated_at
- `messages`: id, conversation_id, role, content, created_at
- `memories`: id, content, type (summary/extracted), created_at
- `decisions`: 
  - id, status (proposed/approved/rejected/superseded)
  - content, rationale, context
  - conversation_id (FK), message_id (FK)
  - github_pr_url (nullable)
  - created_at, updated_at
#### [NEW] apps/daruma-assistant/drizzle.config.ts

---
### Shared Logic (apps/daruma-assistant/shared)
#### [NEW] apps/daruma-assistant/shared/llm/provider.ts
Abstract LLM interface. Initial implementation uses standard OpenAI-compatible endpoints with support for tool calling (`propose_decision`).
#### [NEW] apps/daruma-assistant/shared/repo/knowledge-provider.ts
Defines the `KnowledgeProvider` interface. Implements `BundledKnowledgeProvider` for Phase 1.

---
### Cloudflare Worker (apps/daruma-assistant/workers/api)
#### [NEW] apps/daruma-assistant/workers/api/wrangler.toml
Configures D1 binding and environment variables (`DARUMA_DEFAULT_MODEL`, `DARUMA_ACCESS_TOKEN`, `GITHUB_TOKEN`).
#### [NEW] apps/daruma-assistant/workers/api/src/index.ts
- Validates `DARUMA_ACCESS_TOKEN` on all routes.
- `GET /`: Serves the built Solid JS SPA frontend (which displays the "knowledge last synced" timestamp) using Cloudflare Worker static assets (`[assets]` binding).
- `POST /api/chat`: Handles chat completions with repo context. Exposes the `propose_decision` tool to the LLM to write directly to the `decisions` table.
- `GET /api/decisions`: Retrieves pending decisions.
- `POST /api/decisions/:id`: Approves a decision, triggers the GitHub API to open a PR against the relevant file, and updates `github_pr_url`.

## Verification Plan

### Manual Verification
1. Run local bundle script; apply D1 migrations.
2. Start Worker locally (`pnpm run dev:api`).
3. Open Chat UI. Verify auth check and the "knowledge last synced" timestamp.
4. Have a conversation testing the LLM's repo knowledge.
5. Trigger a decision. Verify the LLM uses the `propose_decision` tool, writing a linked record to `decisions`.
6. Approve the decision via the UI. Verify the Worker successfully calls the GitHub API to open a PR and updates `github_pr_url`.
