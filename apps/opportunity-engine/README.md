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
