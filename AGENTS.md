# AGENTS.md — Project Daruma

Rules for all AI tools working in this repository (Claude, Cursor, Copilot, Gemini).

---

## What This Repo Is

This is the Project Daruma command center. It contains strategy, documentation, prompts, and the master app tracker. There is no app code here.

Do not scaffold apps, create package.json files, or write application code in this repo.

---

## Documentation Boundaries

- Keep all files in this repo **short and concise**
- **This repo:** strategy, stack decisions, prompts, tracker (one row per app in `tracker/APPS.md`)
- **App repos** (`tools.daruma.nz`, `dojo.daruma.nz`): product design, screen specs, game mechanics, build/scaffold rules — each repo has its own `AGENTS.md` for agents working there

---

## The Project

**Mission:** Build 100 micro apps and games across web and mobile.
**Founder role:** Creative Director — vision, taste, redirect when wrong.
**AI role (Daruma):** Workforce — propose defaults, execute, push the plan forward. Escalate only irreversible actions. Infra and roadmap: [`docs/DARUMA.md`](docs/DARUMA.md).

---

## Sub-Brands

**Daruma Toolbox** (`tools.daruma.nz`)
- Micro tools for small businesses
- Stack: SvelteKit + Neon DB + Upstash Redis + Cloudflare Pages + Stripe
- Revenue: monthly subscriptions

**Daruma Dojo** (`dojo.daruma.nz`)
- Micro learning apps and games
- Stack: React + Expo (React Native)
- Revenue: ads + IAP
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

- **Push the plan forward** — read `docs/CURRENT.md`, execute the next action, update it when done
- **Propose defaults** — smallest shippable scope; founder redirects if wrong
- **Escalate only:** spending, public launches, genuine creative/brand forks
- **Never merge to main** — open PRs; founder merges when quality is verified
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
| Payments | Stripe |
| Auth | Auth.js v5 (Toolbox), Supabase Auth (Dojo) |

---

## Documentation Style

- Use markdown tables for comparisons
- Use code blocks for commands, config, and patterns
- Use checkboxes for status tracking in APPS.md
- Headings: H1 for file title, H2 for sections, H3 for subsections
