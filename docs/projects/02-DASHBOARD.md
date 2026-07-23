# 02 — Dashboard (locked)

*Updated: 2026-07-20 — SvelteKit + Cloudflare adapter (UI + API in one deploy)*

## What it is

`apps/dashboard` — the only HTTP UI for Daruma ops. Host: **`daruma.labcat.nz`**.

Opportunity Engine results are **routes/sections** of this app, not a separate deployable.

## Stack (locked)

| Decision | Value |
|----------|-------|
| Framework | **SvelteKit** + `@sveltejs/adapter-cloudflare` (design tokens from **AG-02**) |
| Why SvelteKit | Same-origin `/api/*` in one deploy — not plain Svelte, not a separate Worker |
| Hosting | Cloudflare Worker via adapter — SvelteKit serves pages + `src/routes/api/**/+server.ts` |
| Data (OE / chat) | D1 via `packages/db-*` **only on the server** — browser calls `/api/*` |
| Styles | SCSS + BEM — conventions below. Tokens/primitives in **AG-02** (founder-gated). No CSS Modules, no Storybook, no Tailwind |
| Units | rem for font-size only (`to-rem($px)`); px elsewhere; unitless line-height |
| UI libs | None for v1 |
| Reset | **[modern-normalize](https://github.com/sindresorhus/modern-normalize)** then thin `common/base.scss` (token-backed body). Not `the-new-css-reset` |

SSR is on by default (SvelteKit). Chat (near-term) = UI + streaming `/api/chat`. Design: obey [`DESIGN_BRIEF.md`](DESIGN_BRIEF.md); no founder approve gate between AGs.

## Styles & Svelte org (locked)

Convention source: [LABCAT/rocketship `packages/base/src/styles`](https://github.com/LABCAT/rocketship/tree/main/packages/base/src/styles) + rocketship BEM rules — adapted for Svelte (separate SCSS per component; no `<style>` blocks for design).

### Global styles (`apps/dashboard/src/styles/`)

```
styles/
  index.scss          # entry: normalize → variables → mixins → common/*
  variables.scss      # ONLY :root (+ prefers-color-scheme). No class selectors
  mixins.scss         # @forward mixins/*
  mixins/
    functions.scss    # to-rem($px)
    breakpoints.scss
  common/
    base.scss         # body uses --dm-* tokens; media defaults
```

- Design tokens = **CSS custom properties** on `:root` in `variables.scss` (public API). Prefix: `--dm-*` (e.g. `--dm-color-bg`, `--dm-font-size-md`, `--dm-space-4`).
- Organised sections inside `variables.scss`: colour, type, space, radius/border, motion, layout/container, component scales (button, etc.).
- SCSS `$` vars only for Sass-only needs (e.g. breakpoint maps). Do not put design tokens in `$` vars for theming.
- Import global entry once from root `+layout.svelte`.

### Svelte components

```
lib/components/
  button/
    Button.svelte
    Button.scss       # BEM block; first import in Button.svelte
  page-shell/
    PageShell.svelte
    PageShell.scss
```

- One folder per component under `src/lib/components/`; **one SCSS file per component** (`<Name>.scss`), imported in `<script>` — **always first import**. No mega `components.scss`. **No `<style>` blocks** for design rules.
- BEM with `dm` prefix: `.dm-button`, `.dm-button__label`, `.dm-button--primary`. Nest `&__` / `&--` under the block.
- Declaration order per rule: `--dm-*` locals first → reset if needed → other props.
- No inline `style=` for design. Prefer classes + tokens.
- Layout primitives (stack, cluster, page-shell) are BEM blocks under `src/lib/components/` or `styles/common/` — not a component library kit.

### API routes

```
src/routes/
  api/
    login/+server.ts
    logout/+server.ts
    me/+server.ts
```

- SvelteKit `+server.ts` handlers only — no separate dashboard Worker package.
- Auth gate: `hooks.server.ts` (session cookie; redirect unauthed UI; 401 unauthed `/api/*` except login).
- D1 bindings in `wrangler.toml` / `wrangler.jsonc` at app root.

### Rejected

Plain Svelte (no kit), separate dashboard Worker, Solid (all variants), CSS Modules, Tailwind, Storybook, Bits UI / Kobalte, v0 conversion, TanStack Start.

**Deferred:** ElectricSQL + TanStack DB (when many agents need live ops feedback; source of truth in Postgres/Neon). Not for AG-00–09.

## Auth

Shared-secret password gate (`wrangler secret put`). Signed `HttpOnly` / `Secure` / `SameSite=Strict` cookie. All `/api` data routes gated. Login route public.

**Rejected for now:** Resend magic-link, Google OAuth.

## OE section (AG-08)

Routes under e.g. `/opportunity` (exact paths flexible):

1. Main — top `pending` ideas by score (all-time). **Research** → seeded Assistant chat + `research_more` (DD-03). **Build** / **Skip** as today.
2. Research — `research_more` cards with link back to their synthesis chat.
3. Pipeline health — `pipeline_runs` (AG-09)
4. Seen-keywords (AG-09)

Synthesise: **DD-03** — per-idea Research → chat; drop Copy Top 5. Until DD-03 ships, Copy Top 5 remains.

## Later — chat section (same month goal)

Same app. Own D1 for conversations/memories/decisions. No imports from `workers/opportunity-engine`. Streaming via `/api/chat`.

**Same loop as research-intake in Cursor:** when a decision is made in conversation, it must land in the knowledge system (git docs). When something is only an idea, park it under `docs/ideas/` — do not leave either trapped in chat history.

| Decision | Value |
|----------|-------|
| Providers | Thin OpenAI-compatible interface in SvelteKit server routes. **No freellmapi inside Workers**. Soft model affinity + auto failover on 429; durable `event` rows in chat (not toast-only) |
| Default model | Free Gemini Flash first; escalate DeepSeek / Groq 70B / GPT-OSS 120B / OpenRouter free per Settings — see [`DARUMA.md`](../DARUMA.md) + DD prompts |
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

`apps.metalmonkey.cc` architecture — **later**. Tanuki products first.
