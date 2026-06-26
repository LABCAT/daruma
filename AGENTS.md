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
**Founder role:** CEO — creative direction and ideas.
**AI role:** Workforce — building, researching, iterating.

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
- One question at a time when clarifying; no option menus with long explanations
- Prose length should match task complexity — a yes/no question gets a short paragraph at most
- In reviews and plans: state verdict, blocker, next action — not a narrative

Apply the same tone to docs you write in this repo.

---

## General Rules

- Keep all documentation concise and technically specific
- No fluff, no padding
- When updating tracker/APPS.md, preserve existing rows and formatting
- When suggesting new app ideas, score them using the rubric in docs/PROMPTS.md
- Always consider Windows dev environment constraints (no local Mac, use Expo EAS for iOS builds)
- When an app uses a backend, never connect mobile clients directly to the database — always via an API layer

---

## Preferred Tools and Services

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
