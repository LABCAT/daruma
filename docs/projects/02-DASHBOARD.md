# 02 — Dashboard (locked)

*Updated: 2026-07-19*

## What it is

`apps/dashboard` — the only HTTP UI for Daruma ops. Host: **`daruma.labcat.nz`**.

Opportunity Engine results are **routes/sections** of this app, not a separate deployable.

## Stack (locked)

| Decision | Value |
|----------|-------|
| Framework | **TanStack Start + Solid** (`@tanstack/solid-start`) from AG-02 — not a plain Vite SPA |
| Why Start now | Chat/agents/many routes are the destination; avoid SPA→Start migration. OE is Workers-only; Start is for the dashboard shell |
| Hosting | Cloudflare Workers via `@cloudflare/vite-plugin` + Wrangler |
| Data (OE) | D1 via `packages/db-opportunity-engine` + server functions / API routes |
| Styles | SCSS + BEM (`import './X.scss'`) — not CSS Modules |
| Units | rem for font-size only; px elsewhere; unitless line-height |
| UI libs | None for v1 |

SSR is optional for this internal app — use Start for **file routes + typed server functions**, not SEO.

**Deferred:** ElectricSQL + TanStack DB (when many agents need live ops feedback; source of truth in Postgres/Neon). Not for AG-01–08.

## Auth

Shared-secret password gate (`wrangler secret put`). Signed `HttpOnly` / `Secure` / `SameSite=Strict` cookie. All data routes gated. Login route public.

**Rejected for now:** Resend magic-link, Google OAuth.

## OE section (AG-07)

Routes under e.g. `/opportunity` (exact paths flexible):

1. Main — top `pending` ideas by score (all-time). Copy Top 5 → `sent_to_synthesis`. Done → `build` / `skip` / `research_more`
2. Pipeline health — `pipeline_runs` (AG-08)
3. Seen-keywords (AG-08)

Synthesise stays human: paste Copy Top 5 into Claude. No synthesise worker.

## Later — chat section (after AG-01–08)

Same Start app. Own D1 for conversations/memories/decisions. No imports from `workers/opportunity-engine`.

**Same loop as research-intake in Cursor:** when a decision is made in conversation, it must land in the knowledge system (git docs). When something is only an idea, park it under `docs/ideas/` — do not leave either trapped in chat history.

| Decision | Value |
|----------|-------|
| Providers | Thin OpenAI-compatible interface in-Worker. **No freellmapi inside Workers** |
| Default model | Paid/trusted for strategy chat; free-tier optional for background only |
| Knowledge | Git = human truth. Always inject `AGENTS.md`, `CURRENT.md`, `VISION.md`. Full-context Phase 1; later `KnowledgeProvider` → GitHub live / vector. Bundle OK if Action redeploy + “synced at” UI |
| Decisions | AI drafts `propose_decision` (rationale + source). Founder confirms → **write into git docs** (knowledge system). Local agents: edit working tree. Dashboard: apply via GitHub API (branch and/or direct commit — **PR optional**, not required for solo). On conflict with a prior confirmed decision: ask override. Lifecycle: `proposed` → `confirmed` → `superseded`. Never invent parallel knowledge outside the repo |
| Ideas | Draft → confirm → `docs/ideas/` (same apply paths). Not authoritative strategy |
| Memory | D1: conversations, **summaries**, extracted memories (`source_conversation_id`, status). Separate from git truth |

Open-weight fine-tuning is **years out** — system = model + repo + memory + tools first. Learning prep: [`../../GOALS.md`](../../GOALS.md).

### Later — analytics / search performance

After **Tanuki Toolbox** has live products + landing pages worth monitoring.

- **Manual (one-time per property):** Google Search Console (+ service account for API), Bing Webmaster Tools, Cloudflare Web Analytics / API token; secrets in the deploy env
- **In-dashboard (primary):** Ops route(s) showing search performance (queries, clicks, CTR) + traffic — pull GSC/Bing/Cloudflare APIs. Prefer this over a shaders-style GitHub→email pipeline
- **Optional later:** weekly email digest of the same summary if push-notify beats opening the dashboard
- **Skip for now:** GA4, Ahrefs/Semrush free tiers (GSC + CF + CrUX cover most); SEO *intelligence* (keyword research engines) lives in product repos, not Daruma

## Parked (Metal Monkey web)

`apps.metalmonkey.cc` architecture (Start vs many SPAs) — **later**. Tanuki products first.
