# AG-09 — Health, seen-keywords, prod cutover

Paste only after AG-08 verified.

## Goal

1. Pipeline health panel from `pipeline_runs`
2. Seen-keywords tab (sort by `last_seen_at`)
3. Production: remote D1 migrations, deploy three pipeline workers + dashboard, cron enabled
4. One confirmed unattended orchestrator run in prod
5. **Only with proof above:** delete `tools/opportunity-engine/` (confirm with founder if any doubt)

## Out of scope

Search Console Phase 3, chat/assistant, extracting shared packages for other products.

## Verification (raw evidence)

Health API payload, seen-keywords query, deploy outputs, cron config, prod run evidence. No tool deletion without that paste.
