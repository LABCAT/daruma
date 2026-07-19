# Daruma — Metal Monkey Apps command center

Daruma’s command center for **Metal Monkey Apps** (`metalmonkey.cc`): strategy, docs, prompts, tracker, internal pipelines. No shipped app code here.

## Hierarchy

- **Daruma** — AI assistant (this repo)
- **Metal Monkey Apps** — the business + web (`*.metalmonkey.cc`)
- **Tanuki Toolbox** — React Native tools for small businesses
- **Daruma Dojo** — React Native fun + learning apps/games

Full brand rules: [`docs/BRANDS.md`](docs/BRANDS.md).

## Mission

100 micro apps and games. Learn product, distribution, monetisation, and AI leverage. Compounding passive revenue.

## Repos

| Repo | Purpose | Status |
|------|---------|--------|
| `daruma` | Command center (this repo) | Active |
| `web.daruma.nz` | Legacy web monorepo → migrate to Metal Monkey | Active |
| `tools.daruma.nz` | Tanuki Toolbox (Play / RN) | Active |
| `tanuki-toolbox-design-system` | Toolbox design system | Active |
| `dojo.daruma.nz` | Daruma Dojo monorepo | In progress |

## Key Docs

- [`docs/README.md`](docs/README.md) — docs map
- [`docs/PROJECTS.md`](docs/PROJECTS.md) — work tracking (Issues now → board later)
- [`docs/VISION.md`](docs/VISION.md) — mission, strategy, phases
- [`docs/DARUMA.md`](docs/DARUMA.md) — Daruma AI, Keima, infra
- [`docs/BRANDS.md`](docs/BRANDS.md) — brand hierarchy
- [`docs/MODEL_COSTS.md`](docs/MODEL_COSTS.md) — model price snapshot
- [`docs/STACK.md`](docs/STACK.md) — tech per brand
- [`docs/REVENUE.md`](docs/REVENUE.md) — monetisation
- [`docs/research/PROMPTS.md`](docs/research/PROMPTS.md) — research/build prompts
- [`docs/AI_EXPLORATION.md`](docs/AI_EXPLORATION.md) — bookmarks / tools to evaluate
- [`docs/projects/`](docs/projects/) — Opportunity Engine + Daruma Assistant specs
- [`tracker/APPS.md`](tracker/APPS.md) — master app pipeline
- [`AGENTS.md`](AGENTS.md) — rules for AI tools

## Skills

In a Cursor Agent chat in this repo, say the command (or paste work that matches the skill).

| Skill | What it does | Command |
|-------|--------------|---------|
| [research-intake](.agents/skills/research-intake/SKILL.md) | Intake external AI research → verify → docs | `use the research-intake skill` |
