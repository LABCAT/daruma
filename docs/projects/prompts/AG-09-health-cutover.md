# AG-09 — Health UI + cutover prep

Paste after AG-08. Read `AGENT-RULES.md`.

## Part A — code (agent must finish)

1. Pipeline health UI/API from `pipeline_runs`
2. Seen-keywords tab (sort `last_seen_at`)
3. Dashboard (SvelteKit) + three OE workers build/deploy configs ready
4. Document prod steps in `apps/dashboard/CUTOVER.md` (or `docs/projects/CUTOVER.md`):
   - `wrangler secret put DASHBOARD_PASSWORD`
   - DNS `daruma.labcat.nz`
   - remote D1 migrate
   - deploy OE workers + SvelteKit dashboard
   - enable cron
5. Local proof: health payload + seen-keywords query

## Part B — prod cutover (only if wrangler/account already available)

If agent can deploy: remote migrate, deploy all, one unattended orchestrator run, paste evidence.  
If not: stop after Part A + `CUTOVER.md` — **do not block** or delete `tools/opportunity-engine/` yet.

## Delete `tools/opportunity-engine/`

Only after Part B prod run evidence exists. If cutover deferred, leave tools in place.

## Out of scope

Search Console, chat, shared packages for other products.

## Tests (fill harness)

Extend `pnpm test:e2e` (or dashboard API tests) for health + seen-keywords.

## Verification

Part A + harness green. Part B + tools deletion only with prod proof.
