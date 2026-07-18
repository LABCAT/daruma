# AGENTS.md — Project Daruma

Rules for all AI tools working in this repository (Claude, Cursor, Copilot, Gemini).

---

## What This Repo Is

This is the Project Daruma command center. It contains strategy, documentation, prompts, the master app tracker, and internal pipeline tooling (under `tools/`).

Do not scaffold shipped apps or write application code in this repo. The `tools/` directory is for internal scripts and pipelines (e.g. `tools/opportunity-engine/`) that support the command center — not for shipped products.

---

## Documentation Boundaries

- Keep all files in this repo **short and concise**
- **This repo:** strategy, stack decisions, prompts, tracker (one row per app in `tracker/APPS.md`)
- **App repos** (`web.daruma.nz`, `tools.daruma.nz`, `dojo.daruma.nz`, `tanuki-toolbox-design-system`): product design, screen specs, game mechanics, build/scaffold rules — each repo has its own `AGENTS.md` for agents working there

---

## The Project

**Mission:** Build 100 micro apps and games across web and mobile.
**Founder role:** Creative Director — vision, taste, redirect when wrong.
**AI role (Daruma):** Workforce — propose defaults, execute, push the plan forward. Escalate only irreversible actions. Infra and roadmap: [`docs/DARUMA.md`](docs/DARUMA.md).

---

## Sub-Brands

**Daruma Toolbox** — future brand: Tanuki Toolbox (`tanukitoolbox.sbs`)
- Web (`web.daruma.nz`): SvelteKit + Neon + Cloudflare Pages + Stripe — revenue: monthly subs
- ASO (`tools.daruma.nz`): React Native + Expo + **Shopify Restyle** — revenue: free + one-off IAP unlock (primary)
- Revenue priority over Dojo

**Daruma Dojo** (`dojo.daruma.nz`) — future brand: Challenge Club (`darumadojo.cc`)
- Micro learning apps and games
- Stack: React + Expo (React Native)
- Revenue: TBD (ads + IAP candidate)
- Platform: Google Play first, iOS via Expo EAS Build

---

## Communication (founder preference)

**Be brief.** The founder dislikes verbose agent replies.

- Lead with the answer or decision — one sentence when possible
- No preamble ("Great question!", "I'd be happy to…"), no recap of what they just said
- No walls of text: skip tables, bullet dumps, and multi-section essays unless explicitly asked
- One question at a time when clarifying — **unless** docs or tracker already answer it; then propose a default and proceed
- Prose length should match task complexity — a yes/no question gets a short paragraph at most
- In reviews and plans: state verdict, next action — not a narrative. Do not list the founder as blocker when Daruma can decide.

Apply the same tone to docs you write in this repo.

---

## Daruma operating rules

- **Activate fast** — on wake-up ("activate Daruma", check-in, status): reply immediately with active task + next action; do not batch-read docs or scan repos first. Read files only when executing that action or the founder asks something that needs lookup.
- **Research loop** — weekly GitHub research issues feed Brainstorm; see [`docs/RESEARCH.md`](docs/RESEARCH.md)
- **Push the plan forward** — read `docs/CURRENT.md`, execute the next action, update it when done
- **Propose defaults** — smallest shippable scope; founder redirects if wrong
- **Escalate only:** spending, public launches, genuine creative/brand forks
- **Merges** — open PRs by default; founder merges today. Future gated auto-merge only per `docs/DARUMA.md` (CI/E2E/scopes). Never auto: spend, store submit, brand forks, prod secrets
- **Never block** on tactical questions answerable from this repo or app `AGENTS.md`

---

- Keep all documentation concise and technically specific
- No fluff, no padding
- When updating tracker/APPS.md, preserve existing rows and formatting
- When suggesting new app ideas, score them using the rubric in docs/PROMPTS.md
- Always consider Windows dev environment constraints (no local Mac, use Expo EAS for iOS builds)
- When an app uses a backend, never connect mobile clients directly to the database — always via an API layer

---

## Preferred Tools and Services

**AI coding:** 100% agnostic — Cursor, Antigravity, Copilot, Claude Code, etc. Best performance per dollar wins; no documented primary. **Graphify** in app repos when codebase context is the bottleneck.

| Need | Tool |
|------|------|
| Postgres DB | Neon DB |
| Cache / KV | Upstash Redis |
| File storage | Cloudflare R2 |
| Edge functions | Cloudflare Workers |
| Mobile builds | Expo EAS |
| E2E (web) | Playwright |
| E2E (mobile) | Maestro |
| Payments | Stripe |
| Auth | Auth.js v5 (Toolbox web), Supabase Auth (Dojo) |

---

## Documentation Style

- Use markdown tables for comparisons
- Use code blocks for commands, config, and patterns
- Use checkboxes for status tracking in APPS.md
- Headings: H1 for file title, H2 for sections, H3 for subsections
- Agent doc length / progressive disclosure: [`.agents/rules/agent-documentation.md`](.agents/rules/agent-documentation.md) — README ~50–150 lines; root `AGENTS.md` &lt;150 (soft max ~300); deep detail in `docs/` or skill `references/`, not root dumps
