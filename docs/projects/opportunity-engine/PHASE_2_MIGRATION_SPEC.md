# Phase 2 Migration Spec — Daruma Opportunity Engine on Cloudflare Workers

*Last updated: 2026-07-13*

This doc is the source of truth for migrating the Opportunity Engine from Phase 0 (manual/local script in `tools/opportunity-engine/`) to Phase 2 (Cloudflare Workers + Queues + D1 + Solid dashboard). It supplements [`README.md`](README.md) — read that first for pipeline purpose, rubric, and run history. This doc covers **only** the technical migration decisions.

Upload this file (and keep it updated) in the Claude Project so a fresh chat has full context without re-deriving these decisions.

---

## Why this migration, and what it isn't

Phase 0 proved the Collect + Score logic works (rubric discriminates, bugs fixed, canaries verified). It runs as one long local loop — a 65-keyword run takes ~90–100 minutes, dominated by ~90 seconds/keyword on Google autocomplete.

**Cloudflare Workers cannot run like that.** Hard execution time limits per invocation mean a single Worker cannot loop over 65 keywords for 90 minutes — it will be killed. This is an architectural mismatch requiring a real refactor (see `Phase_2_Technical_Notes___Worker_Runtime_Constraint`), not a lift-and-shift.

**This migration is:** making the existing, validated Collect + Score logic run reliably and unattended on Workers, plus a dashboard to review results.

**This migration is NOT:** the end of the Opportunity Engine. Phase 3 (Search Console feedback loop) remains future work, deliberately deferred — there are apps to build first. Synthesise-as-a-worker has also been permanently descoped (see below) in favor of a manual dashboard-assisted workflow with Claude.

**Old `tools/opportunity-engine/` stays untouched** until the new Workers pipeline is proven via parity testing. Delete only once confident.

---

## Repo & tooling

| Decision | Value |
|---|---|
| Location | New package at `apps/opportunity-engine/` in the daruma command-center monorepo (pnpm workspaces) |
| Language | TypeScript |
| Package manager | pnpm 11 (confirmed current major as of July 2026) |
| Runtime | Node 24 LTS (confirmed current Active LTS as of July 2026; Node 26 is Current-not-LTS until Oct 2026, not used) |
| ORM | Drizzle ORM + drizzle-kit migrations against D1 (not raw SQL, not `.prepare().bind()`) |
| Hosting | Cloudflare Workers with static assets — **not** Cloudflare Pages, **not** SolidStart. Cloudflare's own 2026 guidance recommends Workers-with-assets for new full-stack projects; Pages remains fine for pure-static sites (e.g. existing Astro site — leave that on Pages, no need to migrate it) |

---

## Architecture: 4 Workers total

### Pipeline (3 workers, no HTTP surface, cron/queue-triggered only)

```
Cron trigger (daily)
   ↓
orchestrator-worker   → lightweight, NO scraping. Pulls candidate keyword
                         list, enqueues ONE message per keyword onto
                         `raw-ideas` queue. Fast, short-lived.
   ↓
Queue: raw-ideas   (max_concurrency capped at 2–3 — deliberately low,
                     to mimic Phase 0's gentler sequential scraping
                     behavior and avoid tripping scraper rate limits)
   ↓
collect-worker         → queue consumer. ONE keyword per invocation
                          (not "loop over all keywords" — this is the
                          core fix for the Worker execution-time limit).
                          Does the ~90s scrape for that single keyword,
                          writes to D1 (ideas_raw), exits.
                          Only writes to seen_keywords on SUCCESS —
                          failures simply aren't marked seen, so they're
                          naturally retried on the next orchestrator run.
                          No dead-letter/failure-tracking UI needed for
                          this reason — per-keyword failures are low-
                          stakes and self-healing.
   ↓
score-worker            → consumes collected results, pure computation
                           (no scraping, so no need for per-keyword
                           isolation the way collect-worker needs it).
                           Writes to ideas_ranked. Sets status='pending'
                           for anything clearing the shortlist threshold.
```

**Logic ported as-is** from `tools/opportunity-engine/` — relevance gating (Bug A), rate-based WTP thresholds (Bug B), continuous Pain scaling, global-regex hit counting, keyword prepend/truncate dedupe. Only the *tooling* (npm→pnpm, loop→queue-per-item) changes. Do not let AntiGravity "improve" the rubric logic during this port — that's a separate, already-hard-won piece of work.

### Dashboard (1 worker, HTTP + static assets, same-origin)

One Worker serving **both**:
- Static assets (built Solid SPA, `dist/` via `[assets]` binding, `not_found_handling = "single-page-application"`)
- `/api/*` routes (D1 access via Drizzle, auth middleware)

Same-origin by design — avoids CORS and cross-origin cookie complications that a separate Pages+Workers split would introduce, for zero benefit given single-user scope.

---

## Data model (D1, clean start — no migration of old `seen_keywords.json`/`discovered_keywords.json`)

| Table | Purpose |
|---|---|
| `ideas_raw` | Every keyword Collect touched — raw scraped signals (competitor apps, ratings, review text) |
| `ideas_ranked` | Every keyword Score touched — Pain/WTP/Discovery/Build Speed subtotal + breakdown JSON + **status** field |
| `seen_keywords` | keyword → last_seen_at, 90-day dedupe (written only on successful collect) |
| `pipeline_runs` | One row per stage per run — ideas_in, ideas_out, timestamp. This is the "is it broken" signal |

**`ideas_ranked.status` values:** `pending` → `sent_to_synthesis` (auto-set the moment "Copy Top 5" is clicked — prevents re-surfacing) → optionally `build` / `skip` / `research_more` (manually set later via a "Done" flow once a real decision is made — separate signal from `sent_to_synthesis`, since "I copied it" ≠ "I finished deciding").

No `ideas_final` table, no Synthesise worker — see below.

---

## Synthesise: descoped from infrastructure entirely

The original architecture doc's Synthesise stage (AI compression → BUILD/SKIP/RESEARCH_MORE spec) is **not being built as a worker**. No AI calls, no API keys, no cost caps to manage in Workers.

Instead: the dashboard surfaces the **top 5 `pending` ideas by score, all-time** (not day-bucketed — a day-based view was rejected specifically because Shane is likely to miss days, and status-driven beats date-driven for "find the best opportunities with least effort"). A "Copy Top 5" button formats their raw evidence into a paste-ready prompt block. Shane pastes it into a chat with Claude, who does the actual synthesis conversationally. Clicking copy auto-marks those 5 `sent_to_synthesis` so they never resurface.

This keeps Passion/founder judgment human-only (per the original doc's principle) even more directly than an automated API call would have.

---

## Dashboard scope

**Stack:** Plain Solid + Vite SPA (no SolidStart, no router — single page, conditional render on an `isAuthenticated` signal; a router would only be justified if/when distinct URL-addressable pages are needed, which they aren't yet).

**Auth:** Simple shared-secret password gate, not Resend/magic-link (rejected — genuinely single-user, indefinitely, so passwordless UX and multi-user "who has access" concerns don't apply; magic-link would add Resend API wiring, token signing/expiry, and email deliverability surface area for no benefit here).
- Password stored as a Cloudflare secret (`wrangler secret put`), never in code
- On correct password: Worker sets a signed, `HttpOnly`, `Secure`, `SameSite=Strict` cookie
- All `/api/*` routes (except `/api/login`) gated by middleware checking that cookie before touching D1
- The static SPA shell itself is **not** gated — an unauthenticated visitor sees an empty UI shell with a password prompt, but zero data, since no API call succeeds without the cookie

**Views (in priority order):**
1. **Main view** — top pending opportunities, `ideas_ranked` sorted by score, status=`pending`. "Copy Top 5" button (auto-marks `sent_to_synthesis`). Manual "Done" button per row (sets `build`/`skip`/`research_more` — optional bookkeeping, not enforced)
2. **Pipeline health panel** — small, from `pipeline_runs`: did cron fire, in/out counts per stage, "last successful run" indicator. Answers "is this completely broken," not per-keyword failure tracking (explicitly rejected — low value given failures self-heal via the seen_keywords/retry mechanism above)
3. **Seen-keywords / dedupe tab** — secondary, sortable by `last_seen_at`. Exists so a drop in new-idea volume over time can be diagnosed (dedupe over-suppressing vs. genuinely running out of fresh keywords)

**Explicitly out of scope (not needed at this size/stage):** full historical browse/search across all `ideas_raw`, category breakdowns, trend charts, day-by-day drill-down.

**Styling:**
- Plain `.scss` per component, imported directly (`import './Component.scss'`) — **not** CSS Modules (rejected — Next-style `styles['block__element']` bracket access disliked; Solid has no compiler-level scoped `<style>` like Vue/Svelte SFCs, so there's no equivalent to reach for)
- **BEM naming convention** for class names — chosen specifically because it solves the "no automatic scoping" gap left by Solid's lack of SFC-level style scoping
- No component library (Kobalte/Ark UI considered and rejected — they're headless/unstyled, so they don't help with "looks good," and this project has no real accessibility requirement given single-user scope)
- Units: **rem for font-size only**, **px for everything else** (spacing, borders, etc.), **unitless line-height** — hard rule
- Real design direction to be supplied via the `frontend-design` skill when drafting the actual build prompt (concrete type scale, color palette, spacing rhythm) rather than leaving visual decisions to the AI's improvisation — this is the actual lever for "looks decent," not library choice

---

## Verification approach (non-negotiable, given project history)

Per the project status doc's own hard-won lesson: a "corrected" run once turned out to be a metadata edit with byte-for-byte identical scores — no real re-execution occurred. The same risk applies to this migration: AntiGravity could claim "logic ported unchanged" while subtly altering behavior (an off-by-one in relevance gating, a "cleaned up for TypeScript" rewrite of the WTP rate calc, etc.).

**Parity test is the acceptance gate, not a nice-to-have:**
- Fixed list of 5–8 keywords, including known canaries (`tradie invoice`, `pet business management`) plus others spanning the score range
- Run the *same* list through both old `tools/opportunity-engine/` and the new Worker pipeline (via `wrangler dev` + local D1)
- Diff **raw signals** (competitor app lists, relevance scores, hit counts) — not just final subtotals, per the existing "raw data, not summaries" principle
- Any mismatch = port bug, treated as blocking, not "close enough"

---

## Phase breakdown (for AntiGravity prompts — deliberately small, not one-shot)

| # | Scope | Deliverable |
|---|---|---|
| **1** | Repo scaffolding | `apps/opportunity-engine` package structure, wrangler config(s), TS/pnpm setup, D1 schema + Drizzle migrations. No business logic yet. |
| **2** | Pipeline workers | Port Collect + Score into orchestrator/collect/score workers + Queues wiring + concurrency cap. Parity test executed and passing — this is the gate before moving on. |
| **3** | Dashboard | Solid+Vite SPA, single Worker (assets + API + auth), main pending table, Copy Top 5, Done button, SCSS/BEM styling per direction above. |
| **4** | Remaining views + cutover | Health panel, seen-keywords tab, flip cron on in production, confirm unattended run, then (only once confident) delete `tools/opportunity-engine/`. |

Each phase gets its own AntiGravity prompt — not combined — consistent with the "don't put too much in one prompt" principle already established for this project's verification workflow.

---

## What's still beyond this migration

- **Phase 3** (Search Console feedback loop) — real future work per [`README.md`](README.md), not started, not urgent (apps need to get built first)
- **Brainstorm + founder Passion gate** — permanently human-only, unaffected by this migration
- **Actually building/shipping apps** from validated candidates — the pipeline only ever produces a ranked shortlist of evidence; everything downstream (ASO, landing pages, build) remains manual, ongoing work indefinitely
