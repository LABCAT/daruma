# Daruma Opportunity Engine

Batch pipeline that discovers, ranks, and deep-validates micro-app ideas for **Tanuki Toolbox** (primary focus). Not a chatbot — scheduled/manual jobs in, build candidates out.

**Replaces:** manual paste step in [`../../research/RESEARCH.md`](../../research/RESEARCH.md) Phase 2.
**Extends:** [`ASO_AGENT_LOOP.md`](ASO_AGENT_LOOP.md) with a concrete pipeline architecture.
**Does not replace:** Brainstorm prioritisation or founder Passion gate.

**Design principle:** A **data pipeline that occasionally uses AI to summarise truth** — not an AI that "thinks about ideas."

---

## Purpose

Continuously surface Play Store–validated app opportunities for **small/medium business (SMB) owners and operators** — the only audience filter. No category cap, no geographic limit. Each validated idea produces:

1. A **Play Store keyword** (short or medium-tail) to build the app around and optimise the listing for.
2. A **long-tail SEO keyword cluster** to build a marketing/landing page around, aimed at organic Google ranking.

**Goal:** 100+ validated build candidates/year with **<20%** needing human correction before Brainstorm. Not SaaS platforms — single-purpose apps only.

---

## Scope

| | |
|---|---|
| **Audience** | SMB owners/operators only |
| **Geography** | None — global, English-language markets |
| **Categories** | Open, growing seed list — not capped. Starting seeds: tradies, hair/beauty, hospitality, fitness, pet care, home organization, retail, professional services. Pipeline can surface and add new categories over time. |
| **Brand** | Tanuki Toolbox (primary). Dojo may reuse this engine later but is not the current target. |

**Not in scope:** multi-tenant platforms, "do everything" suites, marketing-dependent launches, backend-heavy products, consumer-only apps.

---

## Architecture (4 stages)

```
Manual run / Cron → Collect (code)  → structured signals, $0
                   → Score   (code)  → rubric /20, $0
                   → Rank    (code)  → shortlist
                   → Synthesise (AI, top few only) → BUILD/SKIP spec + keyword cluster
                   → Brainstorm (human Passion + pick threshold)
```

**Cost rule:** surviving idea → **≤2 AI calls** (ideally **1** synthesis call). Everything else is code.

| Stage | Tool | AI? |
|-------|------|-----|
| Collect | Scrapers + parsers | No |
| Score | Deterministic rules | No |
| Rank | Sort by score (code); top 10–20% to queue | No |
| Synthesise | Batched compression (3–5 ideas/call) | Yes |

Hard rule: **no stage may ask a question or loop** — input batch → output batch only.

### 1. Collect (no AI)

Two collection tracks, run per keyword/category:

| Source | Purpose | Method (free, unofficial) |
|---|---|---|
| Play Store listings | Competitor snapshot — ratings, review counts, monetisation | `google-play-scraper` (npm) |
| Play Store autocomplete | Medium/short-tail keyword expansion | Unofficial Play suggest endpoint |
| Google Autocomplete | Long-tail keyword expansion | Unofficial Google suggest endpoint (`suggestqueries.google.com`), seed + letter/word appending |
| SERP "People Also Ask" / Related searches | More long-tail candidates | Scraped from Google SERP HTML fetched for competitor research |
| Reddit / forum search | Pain language, real phrasing | Reddit search (free tier) / forum scraping |
| Google Trends | Sanity-check a long-tail isn't dead | `pytrends` (unofficial, free) |

All sources are unofficial/scrape-based — no SLA, so collect-worker needs retry/backoff.

**Dedupe (built in from Phase 1, not deferred):** `seen_keywords` table (D1 or KV), keyed by normalized keyword. Collect checks before scraping; anything seen within the last **90 days** is skipped or deprioritized rather than re-collected. Prevents the pipeline from repeating the same ideas daily.

**Output:** Structured records per keyword — no prose. Discard if keyword returns no Play results or fails category/SMB alignment.

### 2. Score (no AI)

Map scraped signals → evidence rubric in [`../../research/PROMPTS.md`](../../research/PROMPTS.md) (Pain, WTP, Discovery, Build Speed; each 1–5, **subtotal /20**). Passion stays human-only in Brainstorm.

| Signal (scraped) | Rubric dimension |
|------------------|------------------|
| App count on SERP, review-count sum | Discovery |
| Avg rating of top 3, incumbent download tier | Discovery + WTP (beatability) |
| Paid/sub/IAP flags on competitors | WTP |
| Reddit quotes + pain lexicon hits | Pain |
| Category + red-flag rules (backend, auth, >3 screens) | Build Speed |

Apply auto-skip rules from [`ASO_AGENT_LOOP.md`](ASO_AGENT_LOOP.md) before scoring. Drop **<12/20**.

Ranking = sort by subtotal; enqueue **top 10–20%** only. No AI on rank.

### 3. Synthesise (AI, rare)

**Trigger:** shortlisted queue — max **5** per run, **20**/day.
**Job:** Compress pre-computed signals into a human-readable decision — **not** re-research.

One batched call per 3–5 ideas.

**New responsibility — keyword cluster + page-split recommendation:**
For each `BUILD` candidate, synthesise must also:
- Group collected long-tail keywords into cluster(s) by intent/audience.
- Recommend **one landing page per cluster** (default: single page covering the full cluster; split into multiple pages only when clusters represent genuinely distinct use-cases or audiences).
- Output the primary long-tail keyword per page plus supporting keywords in that cluster.

**Output:** 5–8 line evidence summary, gap note, ASO draft (Play keyword), long-tail cluster + page-split recommendation, strict MVP spec with free tier + paywall trigger, `BUILD` | `SKIP` | `RESEARCH_MORE`.

**Paywall check:** if no plausible paywall trigger can be identified from competitor monetisation data (already scraped in Collect), flag as `RESEARCH_MORE` instead of `BUILD` — free + IAP with no gate is cost with no revenue path.

---

## Phasing

Small phases, ship fast, automate later.

| Phase | Scope |
|-------|-------|
| **Phase 0 (now)** | Manual/local script. Collect → Score → Synthesise for a broad multi-category sweep, run by hand, output to local file/console. Full visibility — show BUILD, SKIP, and RESEARCH_MORE, not just winners. No cron, no Workers, no D1 yet. Goal: prove the rubric + prompts work on real data. |
| **Phase 1** | Move output to D1. Add `seen_keywords` dedupe. Run via a scheduled GitHub Action (no Workers/Queues yet). Build the simple viewer app (see below). |
| **Phase 2** | Full Cloudflare Workers + Queues + Cron architecture (see below) once volume/frequency justifies it. |
| **Phase 3** | Google Search Console feedback loop — once landing pages are live and indexed, flag underperforming keyword pages for revision. |

Phase 0's first run: broad sweep across an open set of SMB seed categories (not limited to a fixed list), global/English markets, no niche pre-committed — the point of the pipeline is to surface ideas, not validate one you already picked.

---

## Viewer (replaces GitHub issue posting)

Results are **not** posted to GitHub issues. Instead:

- All stages write to **D1** (`ideas_raw`, `ideas_ranked`, `ideas_final`).
- A small **Svelte or Solid SPA** (no Next.js/SSR needed — this is just filtered reads) calls a Worker API route reading from D1.
- Table view of `ideas_final`: filterable by `decision` (BUILD/SKIP/RESEARCH_MORE) and category; shows evidence scores, ASO draft, and long-tail cluster + page-split recommendation per row.
- No auth needed if single-user; basic password gate optional.

---

## Cost model

Target: **pennies per day** at 100 ideas/batch.

| Step (per 100 ideas) | Cost |
|----------------------|------|
| Collect (scrape) | $0 |
| Score (rules) | $0 |
| Rank (code, top 10–20%) | $0 |
| Synthesise (≤20/day, batched) | ~$0.05–0.30/day |

80–90% of pipeline volume never touches a model. Fits within existing $5 Workers plan — no additional paid tools required.

---

## Infrastructure (Phase 2)

Do not build Workers until Phase 0/1 rule scoring is trusted on manual/GitHub Action runs.

```
CRON (staggered daily)
   ↓
collect-worker        → scrape, no AI
   ↓
Queue: raw-ideas
   ↓
score-worker          → rules, no AI → top 10–20%
   ↓
Queue: shortlisted-ideas
   ↓
synthesise-worker     → AI compression, capped
   ↓
D1: ideas_final → viewer app
```

**Components:** Cron Triggers · Workers · Queues (2) · D1 · KV (optional, dedupe)

| Worker | Trigger | Role |
|--------|---------|------|
| `collect-worker` | Cron | Play + Google scrapers/autocomplete; emit structured signals |
| `score-worker` | `raw-ideas` queue | Rubric scoring (code); filter to shortlist |
| `synthesise-worker` | `shortlisted-ideas` queue | Batched AI call per 3–5 ideas; BUILD/SKIP + keyword cluster |

### D1 schema

```sql
-- collect output
CREATE TABLE ideas_raw (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,           -- Toolbox (primary) | Dojo (future)
  keyword TEXT NOT NULL,
  category TEXT,
  signals_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- dedupe
CREATE TABLE seen_keywords (
  keyword_normalized TEXT PRIMARY KEY,
  last_seen_at TEXT NOT NULL
);

-- score output (top 10–20% only)
CREATE TABLE ideas_ranked (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  keyword TEXT NOT NULL,
  rank_score REAL NOT NULL,      -- evidence subtotal /20
  score_json TEXT NOT NULL,      -- pain, wtp, discovery, build_speed
  created_at TEXT NOT NULL
);

-- synthesise output
CREATE TABLE ideas_final (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  keyword TEXT NOT NULL,          -- Play Store keyword
  mvp_spec TEXT,
  monetisation TEXT,
  decision TEXT NOT NULL,        -- BUILD | SKIP | RESEARCH_MORE
  ai_summary TEXT,
  aso_json TEXT,                 -- title, description, keywords
  longtail_clusters_json TEXT,   -- keyword clusters + page-split recommendation
  created_at TEXT NOT NULL
);

-- run audit
CREATE TABLE pipeline_runs (
  id TEXT PRIMARY KEY,
  stage TEXT NOT NULL,
  ideas_in INTEGER,
  ideas_out INTEGER,
  ai_calls INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
```

### Cost control (hard rules)

| Rule | Limit |
|------|-------|
| No AI in collect or score | Always |
| Synthesise batch size | 3–5 ideas per AI call |
| Synthesise per cron run | Max **5** ideas |
| Synthesise per day | Max **20** ideas |
| Rank pass-through | Top **10–20%** only → `shortlisted-ideas` |

Log `ai_calls` in `pipeline_runs` — alert if daily cap exceeded.

---

## Synthesis output format

Each `BUILD` candidate must include:

```markdown
### [App name]
- Brand: Toolbox
- Target keyword (Play Store):
- Evidence summary: (cited)
- Competitor snapshot: (top 3 — monetisation, ratings, last update)
- Gap / differentiation:
- ASO: title, short description, keyword list
- Long-tail keyword cluster(s): (grouped by intent/audience)
- Landing page recommendation: 1 page (default) | N pages (if distinct clusters) — with rationale
- MVP spec: ≤1 week, ≤3 screens, offline scope
- Free tier: (what works fully free, no payment)
- Paywall trigger: (specific action/limit that prompts the $8 unlock)
- Monetisation: Toolbox Play IAP
- Evidence scores: Pain / WTP / Discovery / Build Speed → /20
- Recommendation: BUILD | SKIP | RESEARCH_MORE
```

---

## Success criteria

| Metric | Target |
|--------|--------|
| Validated candidates / year | 100+ |
| Human correction before Brainstorm | <20% of candidates |
| Demand alignment | Play keywords map to real SERPs; long-tail keywords map to real search volume |
| Repeat-idea rate | Near 0% within 90-day dedupe window |
| AI cost per 100 ideas | ≈$0.10–0.35 (synthesis on top few only) |

---

## Anti-patterns

The engine must **not**:

- Run as a chatbot or require mid-pipeline human replies
- Use AI for discovery, scoring, or open-ended ideation
- Let any stage ask questions or iterate in a loop
- Invent keywords without Play/Google search proof
- Promote platform / suite / backend-heavy ideas
- Write directly to tracker or merge code — Brainstorm + founder pick only
- Use expensive models on full raw lists
- Post results to GitHub issues — D1 + viewer app only
- Re-surface a keyword already seen within the dedupe window

---

## Related docs

- [`../../research/RESEARCH.md`](../../research/RESEARCH.md) — current weekly workflow
- [`../../research/PROMPTS.md`](../../research/PROMPTS.md) — rubric + prompt templates (source of truth for scoring)
- [`ASO_AGENT_LOOP.md`](ASO_AGENT_LOOP.md) — validation rules and loop behaviour
- [`../../STACK.md`](../../STACK.md) — Cloudflare / edge stack
- [`../../REVENUE.md`](../../REVENUE.md) — monetisation by brand
- [`PHASE_2_MIGRATION_SPEC.md`](PHASE_2_MIGRATION_SPEC.md) — Workers migration