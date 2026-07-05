# Daruma Opportunity Engine

Batch pipeline that discovers, ranks, and deep-validates micro-app ideas for **Daruma Toolbox** and **Daruma Dojo**. Not a chatbot — scheduled jobs in, build candidates out.

**Replaces:** manual paste step in [`RESEARCH.md`](RESEARCH.md) Phase 2.  
**Extends:** [`ASO_AGENT_LOOP.md`](ASO_AGENT_LOOP.md) with a concrete pipeline architecture.  
**Does not replace:** Brainstorm prioritisation or founder Passion gate.

**Design principle:** A **data pipeline that occasionally uses AI to summarise truth** — not an AI that “thinks about ideas.”

---

## Purpose

Continuously surface Play Store–validated app opportunities that:

- Ship in **≤1 week** (≤3 screens; offline / no backend preferred)
- Match real search demand (ASO-first, evidence required)
- Fit brand revenue models (see below)

**Goal:** 100+ validated build candidates/year with **<20%** needing human correction before Brainstorm. Not SaaS platforms — single-purpose apps only.

---

## Brands (dual track)

Every idea is tagged **Toolbox** or **Dojo**. Discovery rotates via [`research-queue.json`](research-queue.json).

| Brand | Product | Monetisation | Discovery |
|-------|---------|--------------|-------------|
| **Toolbox (Play)** | Single-purpose business utilities | Free + one-off IAP unlock | Play ASO (medium-tail) |
| **Toolbox (web)** | Web utilities with backend | Subscription $5–20/mo | Long-tail SEO |
| **Dojo** | Micro games / learn-by-playing | TBD (ads + IAP candidate) | Play ASO |

**Packaging:** Ship micro first. Verticals with traction may **graduate to mini** — 3–4 related gated features in one listing (e.g. food truck toolkit). Not catch-all SaaS or mega container apps.

**Not in scope:** multi-tenant platforms, “do everything” suites, marketing-dependent launches, backend-heavy products.

---

## Architecture (4 stages)

```
Cron → Collect (code)  → structured signals, $0
     → Score   (code)  → rubric /20, $0
     → Rank    (code or 1 cheap batch call) → shortlist
     → Synthesise (AI, top 1–3 only) → BUILD/SKIP spec
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

| | |
|---|---|
| **Schedule** | Daily (or per queue item on Tue research slot) |
| **Input** | Next item from `research-queue.json` + niche seeds from [`BRANDS.md`](BRANDS.md) |
| **Tasks** | Play search suggestions + top apps per keyword; review text; Reddit / forum search; Toolbox pain lexicon (`excel`, `paper`, `whatsapp`, `spreadsheet`) |
| **Output** | Structured records per keyword — no prose |

Discard if keyword returns no Play results or fails category alignment ([`ASO_AGENT_LOOP.md`](ASO_AGENT_LOOP.md)).

### 2. Score (no AI)

Map scraped signals → evidence rubric in [`PROMPTS.md`](PROMPTS.md) (Pain, WTP, Discovery, Build Speed; each 1–5, **subtotal /20**). Passion stays human-only in Brainstorm.

| Signal (scraped) | Rubric dimension |
|------------------|------------------|
| App count on SERP, review-count sum | Discovery |
| Avg rating of top 3, incumbent download tier | Discovery + WTP (beatability) |
| Paid/sub/IAP flags on competitors | WTP |
| Reddit quotes + pain lexicon hits | Pain |
| Category + red-flag rules (backend, auth, >3 screens) | Build Speed |

Apply auto-skip rules from [`ASO_AGENT_LOOP.md`](ASO_AGENT_LOOP.md) before scoring. Drop **<12/20**.

Ranking = sort by subtotal; enqueue **top 10–20%** only. No AI on rank for v1.

### 3. Synthesise (AI, rare)

**Trigger:** `shortlisted-ideas` queue — max **5** per run, **20**/day.  
**Job:** Compress pre-computed signals into a human-readable decision — **not** re-research.

One batched call per 3–5 ideas. Stronger model tier per [`DARUMA.md`](DARUMA.md).

**Input (example):**

```json
{
  "brand": "Toolbox",
  "keyword": "cleaning schedule app",
  "top_apps": [{ "name": "...", "rating": 3.8, "reviews": 1200, "monetisation": "sub" }],
  "review_snippets": ["..."],
  "reddit_quotes": ["..."],
  "scores": { "pain": 4, "wtp": 3, "discovery": 4, "build_speed": 5, "subtotal": 16 }
}
```

**Output:** 5–8 line evidence summary, gap note, ASO draft, strict MVP spec, `BUILD` | `SKIP` | `RESEARCH_MORE`.

---

## Cost model

Target: **pennies per day** at 100 ideas/batch.

| Step (per 100 ideas) | Cost |
|----------------------|------|
| Collect (scrape) | $0 |
| Score (rules) | $0 |
| Rank (code, top 10–20%) | $0 |
| Synthesise (≤20/day, batched) | ~$0.05–0.30/day |

80–90% of pipeline volume never touches a model.

---

## Execution philosophy

- **Batch only** — no conversational loops, no mid-run human replies, no agent-to-agent chat
- **Evidence or discard** — weak signals never reach Brainstorm
- **AI = compression** — models summarise structured truth; they do not discover or score
- **Micro-apps only** — Phase 0–2 per [`CURRENT.md`](CURRENT.md)
- **Founder gate** — pick ≥ **18/25** (evidence + Passion) before tracker updates
- **Tight runs** — collect → score → synthesise → stop ([`DARUMA.md`](DARUMA.md))

---

## Infrastructure

Phased — do not build Workers until Tuesday-issue prompts + rule scoring are trusted on manual runs.

| Phase | Runtime | Storage |
|-------|---------|---------|
| **Now** | GitHub Action ([`daruma-scheduled.yml`](../.github/workflows/daruma-scheduled.yml)) + manual paste | Issues + Brainstorm |
| **2** | Cloudflare Workers + Cron + Queues + D1 | KV optional (dedupe) |

**Not DeerFlow** — narrow scheduled pipeline; DeerFlow stays optional for ad-hoc long reports ([`DARUMA.md`](DARUMA.md)).

### Cloudflare minimal architecture (Phase 2)

Data refinery on Cloudflare only — no VPS, no SaaS orchestration layer. Aligns with [`STACK.md`](STACK.md) edge preference.

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
D1: ideas_final → GitHub issue / Brainstorm
```

**Components:** Cron Triggers · Workers · Queues (2) · D1 · KV (optional)

| Worker | Trigger | Role |
|--------|---------|------|
| `collect-worker` | Cron | Play + Reddit scrapers; emit structured signals |
| `score-worker` | `raw-ideas` queue | Rubric scoring (code); filter to shortlist |
| `synthesise-worker` | `shortlisted-ideas` queue | One batched AI call per 3–5 ideas; BUILD/SKIP |

**Queues (2 only):**

| Queue | Producer → Consumer |
|-------|---------------------|
| `raw-ideas` | collect → score |
| `shortlisted-ideas` | score → synthesise |

**Cron (UTC — adjust to NZST if needed):**

| Schedule | Worker | Purpose |
|----------|--------|---------|
| `0 8 * * *` | collect | Morning scrape batch |
| `0 12 * * *` | score | Rank + enqueue shortlist |
| `0 18 * * *` | synthesise | AI compression on top candidates |

Niche rotation: sync [`research-queue.json`](research-queue.json) into D1 `niche_queue` or bind at deploy.

### D1 schema

```sql
-- collect output
CREATE TABLE ideas_raw (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,           -- Toolbox | Dojo
  keyword TEXT NOT NULL,
  niche TEXT,
  signals_json TEXT NOT NULL,
  created_at TEXT NOT NULL
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
  keyword TEXT NOT NULL,
  mvp_spec TEXT,
  monetisation TEXT,
  decision TEXT NOT NULL,        -- BUILD | SKIP | RESEARCH_MORE
  ai_summary TEXT,
  aso_json TEXT,                 -- title, description, keywords
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

### Optional later

- **KV** — keyword dedupe, audience “already tried” flags
- **Retry queue** — failed synthesise batches only
- **Trend table** — decay stale `ideas_ranked` rows
- **Brainstorm webhook** — auto-post `BUILD` rows

### End-to-end flow

1. Cron → collect-worker (queue pointer / niche from D1)
2. Signals → D1 `ideas_raw` + message → `raw-ideas`
3. score-worker scores, drops **<12/20**, enqueues top 10–20% → `shortlisted-ideas`
4. synthesise-worker (capped) → D1 `ideas_final`
5. Post summary to `[Research]` issue or Brainstorm
6. Founder scores Passion → pick → tracker

---

## Synthesis output format

Each `BUILD` candidate must include:

```markdown
### [App name]
- Brand: Toolbox | Dojo
- Target keyword (Play Store):
- Evidence summary: (cited)
- Competitor snapshot: (top 3 — monetisation, ratings, last update)
- Gap / differentiation:
- ASO: title, short description, keyword list
- MVP spec: ≤1 week, ≤3 screens, offline scope
- Monetisation: [Toolbox Play IAP | Toolbox web sub | Dojo TBD]
- Evidence scores: Pain / WTP / Discovery / Build Speed → /20
- Recommendation: BUILD | SKIP | RESEARCH_MORE
```

---

## Success criteria

| Metric | Target |
|--------|--------|
| Validated candidates / year | 100+ |
| Human correction before Brainstorm | <20% of candidates |
| Demand alignment | Keywords map to real Play SERPs |
| AI cost per 100 ideas | ≈$0.10–0.35 (synthesis on top 3 only) |

---

## Anti-patterns

The engine must **not**:

- Run as a chatbot or require mid-pipeline human replies
- Use AI for discovery, scoring, or open-ended ideation
- Let any stage ask questions or iterate in a loop
- Invent keywords without Play search proof
- Promote platform / suite / backend-heavy ideas
- Write directly to tracker or merge code — Brainstorm + founder pick only
- Use expensive models on full raw lists

---

## Related docs

- [`RESEARCH.md`](RESEARCH.md) — current weekly workflow
- [`PROMPTS.md`](PROMPTS.md) — rubric + prompt templates (source of truth for scoring)
- [`ASO_AGENT_LOOP.md`](ASO_AGENT_LOOP.md) — validation rules and loop behaviour
- [`STACK.md`](STACK.md) — Cloudflare / edge stack
- [`REVENUE.md`](REVENUE.md) — monetisation by brand
