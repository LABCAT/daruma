# Research Loop

Automated idea intake for Project Daruma. **Brainstorm** decides; Daruma schedules research.

---

## Flow

1. **Tuesday 08:00 NZST** — GitHub Action opens a `[Research]` issue (notification on your phone if Issues are watched).
2. **Paste** the prompt block from the issue into any AI chat (Gemini, Groq, Claude, etc.). ~10 minutes.
3. **Brainstorm** — copy structured output into [brainstorm.daruma.nz](https://brainstorm.daruma.nz). Score and rank.
4. **Pick** — highest idea ≥ threshold in Brainstorm (default **18/25** in [`research-queue.json`](research-queue.json); research output is **evidence subtotal /20**, add Passion in Brainstorm) becomes next app in [`tracker/APPS.md`](../tracker/APPS.md) and [`CURRENT.md`](CURRENT.md).
5. **Close** — comment `done` on the research issue when ideas are in Brainstorm.

Mon + Thu check-in · Tue research — single workflow: [`daruma-scheduled.yml`](../.github/workflows/daruma-scheduled.yml).

**Notifications:** Issues = content (watch repo → Custom → Issues). Actions = run status. To avoid doubles, set [Actions notifications](https://github.com/settings/notifications) to **failed workflows only** — keep issue emails for the actual prompt/check-in.

---

## Queue

Rotation list: [`research-queue.json`](research-queue.json). Items alternate Toolbox / Dojo. Edit the JSON to add topics — no workflow change needed.

Prompt templates live in [`PROMPTS.md`](PROMPTS.md). The workflow assembles context + template + output format into each issue.

---

## Manual run

Actions → **Daruma** → **Run workflow** (pick task or leave `auto`).

---

## Later (Phase 2)

**Daruma Opportunity Engine** — see [`OPPORTUNITY_ENGINE.md`](OPPORTUNITY_ENGINE.md). Batch pipeline (Collect → Score → Synthesise) replaces the paste step; posts to the issue or Brainstorm. Founder still scores Passion and picks in Brainstorm until automation is trusted.
