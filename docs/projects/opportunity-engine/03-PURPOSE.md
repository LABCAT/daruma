# 03 — Opportunity Engine purpose

Batch pipeline: discover, rank, surface Play-validated micro-app ideas for **Tanuki Toolbox** (SMB owners/operators). Not a chatbot.

**Design principle:** data pipeline that occasionally uses AI to summarise truth — not an AI that invents ideas.

Each strong candidate yields:

1. Play Store keyword (listing / ASO)
2. Long-tail SEO cluster (landing page)

**Goal:** 100+ validated build candidates/year, &lt;20% needing human correction before Brainstorm.

**Not in scope:** multi-tenant platforms, backend-heavy products, consumer-only apps, marketing-dependent launches.

Stages: Collect (code) → Score (code) → Rank (code) → **human** synthesise via dashboard Research → Assistant chat (DD-03) → Brainstorm (Passion gate).

Detail / rubric: [`06-ASO-AGENT-LOOP.md`](06-ASO-AGENT-LOOP.md), [`../../research/PROMPTS.md`](../../research/PROMPTS.md).

Phase 0 local script in `tools/opportunity-engine/` is proven. Phase 2 = Workers + dashboard section (this migration). Phase 3 Search Console loop = later.
