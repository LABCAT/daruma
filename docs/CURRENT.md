# Current Focus

Single source of truth for the active task. Updated manually or via agent when focus changes.
The Mon + Thu check-in workflow reads this file and posts to GitHub Issues.

---

## Who does what (near term)

### Founder priorities

| Priority | Why you |
|----------|---------|
| **1. D01 Play Console** | Closed test → production — only you can operate the store account |
| **2. Toolbox design-system PR** | Human review / merge gate |
| **3. Keys & Cloudflare (when AG asks)** | Secrets, DNS for `daruma.labcat.nz`, `wrangler login` if agents can’t — ~minutes, not coding |
| Creative redirects | Brand / product taste only |

### Daruma priorities

| Priority | Action |
|----------|--------|
| **1. OE + Dashboard AG-00 → AG-09** | Run Antigravity prompts in order; PRs; CI from AG-00; founder visual gate at AG-02 |
| **2. Don’t block on #1/#2** | Parallel to Play / Toolbox; escalate only spend / store / brand |
| **3. Keep docs truthful** | Update this file when AG phase advances |

**Split:** You ship D01 + review Toolbox. Daruma builds the command center. You only touch OE/dashboard for **account setup and secrets**.

---

## Status

| # | Workstream | Owner | Status | Next action |
|---|------------|--------|--------|-------------|
| 1 | **D01 — Multiplication Dojo** | Founder | Ready for Play ship | Closed test → production |
| 2 | **Tanuki Toolbox** — design system | Founder | PR awaiting review | Review + merge `feat/design-system-integration` |
| 3 | **OE + Dashboard** | **Daruma** | Docs locked; scaffold old layout | **AG-00** → AG-09 — [`projects/README.md`](projects/README.md). **You approve look/feel at AG-02** |
| 4 | **Toolbox — Maestro E2E** | Daruma (after #2) | Blocked on #2 | Integrate after design-system merges |
| 5 | **Play Console org** | Founder | Parallel | D-U-N-S when ready |

**Primary:** Founder = #1 (+ #2 when free). Daruma = #3 uninterrupted.

---

## OE + Dashboard — effort split (honest)

Daruma/Antigravity **writes the code**. That is not the same as “zero effort from you.”

| Role | Does |
|------|------|
| **Antigravity (or Cursor agent)** | Implement each AG prompt; run local checks; paste **raw evidence** |
| **You** | Skim evidence; **AG-02 visual approve** (required); Cloudflare secrets/DNS; merge/reject |
| **CI (from AG-00)** | Automated Vitest (+ Playwright later) — [`07-CI-AND-REGRESSION.md`](projects/07-CI-AND-REGRESSION.md) |

**Without your skim where it matters, we do not “know it works.”** After AG-00, CI covers smoke; you still **must** approve AG-02 look/feel and skim AG-07 parity. Agent checklists alone are not enough.

**PRs:** Code changes should still land via PR (or at least a branch you can glance). Daruma/Antigravity opens the PR; you merge (or reject). Knowledge-only doc edits can stay direct.

**Cursor cloud PR / agent quota:** If monthly Cursor cloud runs are limited, **prefer Antigravity for AG-00–09** and save Cursor cloud for hard reviews.

**Your unavoidable lifts:** Cloudflare auth, dashboard secret (AG-03), `daruma.labcat.nz` DNS, **AG-02 visual approve**, AG-07 parity skim, merge. Not writing Collect/Score yourself.

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
| `daruma.labcat.nz` | Daruma dashboard | Yes when AG-03+ deploys |
| `metalmonkey.cc` | Brand + web apps | No for D01 |
| `tanukitoolbox.sbs` | Optional Toolbox landing / Play org verification | No (D01 on personal) |
| `darumadojo.cc` | Optional Dojo landing | No |
| `daruma.nz` | Legacy / optional | No |

Org account requires **any owned domain** + DNS TXT verification (Search Console). Site is **not shown on Play** — verification and org contact email only.

---

## Blocker

None on OE/dashboard code — Daruma can start **AG-00** now.

D01: Play closed test is the founder gate (#1).

**Subscriptions:** Cursor Pro — cancel before **2026-09-15**; Google AI Plus → One 200 GB before **2026-09-26** — [`ops/SUBSCRIPTIONS.md`](ops/SUBSCRIPTIONS.md).

---

## Operating mode

**Pipeline learning** (apps 1–2). Revenue clock has not started. Daruma drives OE/dashboard execution; founder steers Play + creative.

---

## Last updated

2026-07-19
