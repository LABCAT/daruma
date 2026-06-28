# Research Loop

Automated idea intake for Project Daruma. **Brainstorm** decides; Daruma schedules research.

---

## Flow

1. **Tuesday 08:00 NZST** — GitHub Action opens a `[Research]` issue (notification on your phone if Issues are watched).
2. **Paste** the prompt block from the issue into any AI chat (Gemini, Groq, Claude, etc.). ~10 minutes.
3. **Brainstorm** — copy structured output into [brainstorm.daruma.nz](https://brainstorm.daruma.nz). Score and rank.
4. **Pick** — highest idea ≥ threshold (default **18/25** in [`research-queue.json`](research-queue.json)) becomes next app in [`tracker/APPS.md`](../tracker/APPS.md) and [`CURRENT.md`](CURRENT.md).
5. **Close** — comment `done` on the research issue when ideas are in Brainstorm.

Mon + Thu check-in ([`weekly-checkin.yml`](../.github/workflows/weekly-checkin.yml)) still tracks active build focus.

---

## Queue

Rotation list: [`research-queue.json`](research-queue.json). Items alternate Toolbox / Dojo. Edit the JSON to add topics — no workflow change needed.

Prompt templates live in [`PROMPTS.md`](PROMPTS.md). The workflow assembles context + template + output format into each issue.

---

## Manual run

Actions → **Daruma research** → **Run workflow**.

---

## Later (Phase 2)

Always-on agent runs the same prompt, posts results to the issue. You still prioritize in Brainstorm until scoring automation is trusted.
