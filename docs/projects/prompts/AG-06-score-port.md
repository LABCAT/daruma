# AG-06 — Score port only

Paste only after AG-05 verified.

## Context

Read: `docs/projects/opportunity-engine/05-PORT-AND-PARITY.md`, `06-ASO-AGENT-LOOP.md`, `../../research/PROMPTS.md` (rubric)

Port score logic from `tools/opportunity-engine/` **unchanged**.

## Goal

Implement **score** Worker consuming `collected-ideas`.

## Build

1. Read collected signals → compute Pain/WTP/Discovery/Build Speed
2. Write `ideas_ranked` with breakdown JSON
3. Set `status=pending` when shortlist threshold met (same rules as Phase 0)
4. `pipeline_runs` stage=`score`
5. No dashboard UI changes

## Verification (raw evidence)

1. Score source
2. For 2–3 known keywords: `ideas_ranked` rows (SQL or JSON dump)
3. Confirm status values match expected shortlist behaviour vs Phase 0 notes if available

Parity suite is **AG-07** — do not claim full parity here; this prompt only implements score.
