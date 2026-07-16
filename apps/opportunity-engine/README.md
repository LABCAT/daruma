# Opportunity Engine — Phase 1 (Scaffolding)

Workers package implementing the new Opportunity Engine data pipeline.

## Development Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **D1 Local Migration**:
   Apply the generated migrations to the local SQLite/D1 instance:
   ```bash
   pnpm --filter opportunity-engine db:migrate:local
   ```

## Local Verification & Development

To test the stubs and verify database structures:

1. **Start Worker local development environments**:
   Start any of the four workers in wrangler dev mode:
   ```bash
   # In separate terminals
   pnpm --filter opportunity-engine dev:orchestrator
   pnpm --filter opportunity-engine dev:collect
   pnpm --filter opportunity-engine dev:score
   pnpm --filter opportunity-engine dev:dashboard
   ```

2. **Verify D1 tables locally**:
   Confirm the database migration applied successfully:
   ```bash
   npx wrangler d1 execute daruma-opportunity-engine --local --config workers/orchestrator/wrangler.toml --command "SELECT name FROM sqlite_master WHERE type='table'"
   ```

## Production Deployment

1. **Create the Production D1 Database** (already completed):
   ```bash
   npx wrangler d1 create daruma-opportunity-engine
   ```

2. **Apply migrations to Production**:
   Apply database migrations to the remote Cloudflare D1 instance:
   ```bash
   npx wrangler d1 migrations apply daruma-opportunity-engine --remote --config workers/orchestrator/wrangler.toml
   ```

3. **Deploy Workers**:
   Deploy each stub worker to Cloudflare (make sure you are authenticated via `npx wrangler login`):
   ```bash
   npx wrangler deploy --config workers/orchestrator/wrangler.toml
   npx wrangler deploy --config workers/collect/wrangler.toml
   npx wrangler deploy --config workers/score/wrangler.toml
   npx wrangler deploy --config workers/dashboard/wrangler.toml
   ```
