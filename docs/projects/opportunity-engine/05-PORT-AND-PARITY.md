# 05 — Port rules & parity gate

## Port

Logic from `tools/opportunity-engine/` **as-is**:

- Relevance gating (Bug A)
- Rate-based WTP thresholds (Bug B)
- Continuous Pain scaling
- Global-regex hit counting
- Keyword prepend/truncate dedupe

Only change packaging: npm→pnpm, loop→queue-per-item. **Do not “improve” the rubric during the port.**

## Parity gate (blocking)

Before OE UI (AG-07): complete **AG-06 parity gate**.

1. Fixed 5–8 keywords including canaries (`tradie invoice`, `pet business management`) plus score-range spread
2. Same list through `tools/opportunity-engine/` and new Workers (`wrangler dev` + local D1)
3. Diff **raw signals** (apps, relevance, hit counts) — not just final subtotals
4. Any mismatch = blocking port bug

## Verification style

Paste **raw evidence** (file contents, command output). Checklists claiming success are rejected.
