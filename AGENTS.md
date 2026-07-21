# AGENTS.md — Daruma (Metal Monkey Apps)

Rules for all AI tools working in this repository (Claude, Cursor, Copilot, Gemini).

**Agent rules live in [`.agents/rules/`](.agents/rules/)** — tool-agnostic. Do not use `.cursorrules` or IDE-only rule files.

---

## What This Repo Is

Daruma’s command center for **Metal Monkey Apps**. Strategy, docs, prompts, app tracker, internal pipelines (`tools/`).

Do not scaffold shipped apps or write application code here. `tools/` is internal only — not shipped products.

Brand hierarchy: [`docs/BRANDS.md`](docs/BRANDS.md).

---

## Documentation Boundaries

- Keep all files in this repo **short and concise**
- **No stub docs** — never leave a file that only says “Moved / see other path.” Delete the old file and fix links. Rule: [`.agents/rules/agent-documentation.md`](.agents/rules/agent-documentation.md)
- **This repo:** strategy, stack decisions, prompts, tracker (one row per app in `docs/tracker/APPS.md`). Docs map: [`docs/README.md`](docs/README.md). Work tracking: [`docs/PROJECTS.md`](docs/PROJECTS.md).
- **App repos** (`web.daruma.nz` legacy, Metal Monkey web, `tools.daruma.nz`, `dojo.daruma.nz`, `tanuki-toolbox-design-system`): product design, screen specs, game mechanics, build/scaffold rules — each has its own `AGENTS.md`

---

## The Project

**Business:** Metal Monkey Apps (`metalmonkey.cc`) — 100 micro apps and games across web and mobile.
**Founder:** Creative Director — vision, taste, redirect when wrong.
**Daruma:** The AI assistant — propose defaults, execute, push the plan forward. Escalate only irreversible actions. Infra: [`docs/DARUMA.md`](docs/DARUMA.md).

---

## Brands (public)

**Metal Monkey Apps** — overarching brand; new web apps on `*.metalmonkey.cc` (custom domain only if earned).

**Tanuki Toolbox** (`tools.daruma.nz`) — React Native + Expo for small businesses; free + one-off IAP; revenue priority.

**Daruma Dojo** (`dojo.daruma.nz`) — React Native + Expo fun + learning apps/games; ads + IAP candidate; Play first, iOS via EAS.

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
- **Research loop** — weekly GitHub research issues feed Brainstorm; see [`docs/research/RESEARCH.md`](docs/research/RESEARCH.md)
- **Push the plan forward** — read `docs/CURRENT.md`, execute the next action, update it when done
- **Propose defaults** — smallest shippable scope; founder redirects if wrong
- **Escalate only:** spending, public launches, genuine creative/brand forks
- **Merges (code)** — coding agents open PRs by default; founder merges today. Future gated auto-merge only per `docs/DARUMA.md` (CI/E2E/scopes). Never auto: spend, store submit, brand forks, prod secrets
- **Knowledge writes (docs)** — after founder confirms a decision/idea, update git docs in the working tree (local agents) or via GitHub API (dashboard). **PR optional** for solo knowledge updates — see [`docs/projects/02-DASHBOARD.md`](docs/projects/02-DASHBOARD.md)
- **Never block** on tactical questions answerable from this repo or app `AGENTS.md`

---

- Keep all documentation concise and technically specific
- No fluff, no padding
- When updating docs/tracker/APPS.md, preserve existing rows and formatting
- When suggesting new app ideas, score them using the rubric in docs/research/PROMPTS.md
- Always consider Windows dev environment constraints (no local Mac, use Expo EAS for iOS builds)
- When an app uses a backend, never connect mobile clients directly to the database — always via an API layer
- **Package versions:** never `"latest"` / `"*"` — resolve **current stable** from npm and pin with semver (`^x.y.z`). Do not reuse stale majors. See [`.agents/rules/package-versions.md`](.agents/rules/package-versions.md)
- **Testing:** Never write trivial happy-path tests just to pass CI. You must test edge cases, idempotency, and failure states robustly. See [`.agents/rules/agent-testing.md`](.agents/rules/agent-testing.md)

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
