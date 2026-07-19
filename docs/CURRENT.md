# Current Focus

Single source of truth for the active task. Updated manually or via agent when focus changes.
The Mon + Thu check-in workflow reads this file and posts to GitHub Issues.

---

## Status

| # | Workstream | Status | Next action |
|---|------------|--------|-------------|
| 1 | **D01 — Multiplication Dojo** | Ready for Play ship | Complete Play Console steps — closed test → production (see Blockers) |
| 2 | **Tanuki Toolbox** (`tools.daruma.nz`) — design system | PR awaiting human review | Review + merge `feat/design-system-integration` |
| 3 | **Opportunity Engine** | Not started | Begin implementation — see [`projects/opportunity-engine/`](projects/opportunity-engine/) |
| 4 | **Tanuki Toolbox — Maestro E2E** | Blocked on #2 | Integrate after design-system PR merges |
| 5 | **Play Console account** | Decided — see below | D01 on personal now; investigate D-U-N-S for org in parallel |

**Primary focus:** Ship D01 (#1) in parallel with Opportunity Engine kickoff (#3). Toolbox design-system review (#2) is founder-gated.

**Work tracking:** GitHub Issues now; board in Daruma Assistant later — [`PROJECTS.md`](PROJECTS.md). Docs map: [`README.md`](README.md).

---

## D01 v1 scope

Per [`tracker/APPS.md`](../tracker/APPS.md) — founder can redirect.

- One game mode: timed multiplication drill
- Tables 1–12
- Offline only (AsyncStorage)
- No ads, no IAP, no auth in v1
- Goal: smallest build that passes Google Play review and proves the pipeline

---

## Play Console & domains

### Account strategy (decided)

| Phase | Account | Apps |
|-------|---------|------|
| **Now** | Personal (existing) | D01 — 12 testers × 14 days closed test, then production |
| **Parallel** | Investigate D-U-N-S | NZ sole trader can apply — no company registration required; free via Dun & Bradstreet (up to ~30 days) |
| **Later** | One **organisation** account | All Dojo + Toolbox apps — exempt from per-app tester gate |

**One account, both brands.** Unlimited apps per account. Developer name is account-wide (small line under app title) — users search by **app name**, not publisher. Brand lives in app titles (Coke/Fanta model). Two accounts only if you need different publisher names — not worth it for micro-app ASO.

**Default publisher name:** Metal Monkey Apps (or trading name) on one org account.

Do not create a fake business entity to skip testing.

Official policy: [Play Console testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)

### Domains (decided)

| Domain | Role | Required now? |
|--------|------|---------------|
| `metalmonkey.cc` | Overarching brand + web apps (`*.metalmonkey.cc`) | No for D01 |
| `tanukitoolbox.sbs` | Optional Toolbox landing / Play org verification | No (D01 on personal) |
| `darumadojo.cc` | Optional Dojo landing | No |
| `daruma.nz` | Legacy / optional | No |

Org account requires **any owned domain** + DNS TXT verification (Search Console). Site is **not shown on Play** — verification and org contact email only (e.g. `hello@tanukitoolbox.sbs`). `.sbs` is fine.

OpenHands / design stack (Phase 2) needs a VPS when we get there — Workers cron does not need a custom domain. See [`DARUMA.md`](DARUMA.md).

---

## Blocker

None on build/code — D01 ready; Play closed test is the gate (#1).

**Subscriptions:** Cursor Pro — cancel before **2026-09-15**; Google AI Plus → One 200 GB before **2026-09-26** — [`ops/SUBSCRIPTIONS.md`](ops/SUBSCRIPTIONS.md).

---

## Operating mode

**Pipeline learning** (apps 1–2). Revenue clock has not started. Daruma drives execution; founder steers creative.

---

## Last updated

2026-07-05
