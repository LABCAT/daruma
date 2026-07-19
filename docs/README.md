# Docs

| Area | Path | What |
|------|------|------|
| **Strategy** | this folder | Vision, brands, stack, revenue, current focus |
| **Daruma AI** | this folder | `DARUMA.md`, model costs, exploration bookmarks |
| **Projects** | [`projects/`](projects/) | Build specs + CI plan (`07-CI-AND-REGRESSION.md`) |
| **Ideas** | [`ideas/`](ideas/) | Parked ideas (not CURRENT focus) |
| **Research** | [`research/`](research/) | Weekly ideation loop + prompts + queue JSON |
| **Ops** | [`ops/`](ops/) | Subscriptions tracker + automation JSON |
| **Tracker** | [`tracker/`](tracker/) | App pipeline (`APPS.md` — one row per app) |

Project management: [`PROJECTS.md`](PROJECTS.md).

## Strategy & Daruma (top-level)

| Doc | Purpose |
|-----|---------|
| [`CURRENT.md`](CURRENT.md) | Active workstreams — agents read this first |
| [`VISION.md`](VISION.md) | Mission, phases, founder notes |
| [`BRANDS.md`](BRANDS.md) | Metal Monkey / Tanuki / Dojo hierarchy |
| [`STACK.md`](STACK.md) | Tech per brand |
| [`REVENUE.md`](REVENUE.md) | Monetisation |
| [`GOALS.md`](GOALS.md) | Founder learning goals |
| [`DARUMA.md`](DARUMA.md) | AI assistant, infra, models |
| [`MODEL_COSTS.md`](MODEL_COSTS.md) | Model price snapshot |
| [`AI_EXPLORATION.md`](AI_EXPLORATION.md) | Tool bookmarks to evaluate |

## Projects

| Doc | Purpose |
|-----|---------|
| [`projects/README.md`](projects/README.md) | Numbered order + Antigravity prompts |
| [`projects/01-ARCHITECTURE.md`](projects/01-ARCHITECTURE.md) | Monorepo layout (locked) |
| [`projects/02-DASHBOARD.md`](projects/02-DASHBOARD.md) | One UI host (`daruma.labcat.nz`) |
| [`projects/opportunity-engine/`](projects/opportunity-engine/) | OE purpose / pipeline / port / ASO |

## Config JSON (not mystery files)

| File | Used by |
|------|---------|
| [`research/research-queue.json`](research/research-queue.json) | Tue research issue rotation (`.github/workflows/daruma-scheduled.yml`) |
| [`ops/subscriptions.json`](ops/subscriptions.json) | Check-in / subscription reminder automation |
