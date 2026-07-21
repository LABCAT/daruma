# Opportunity Engine Production Cutover

This document outlines the required steps to launch the SvelteKit dashboard and Opportunity Engine workers to production.

## 1. Set Secrets

Set the password for the dashboard to prevent unauthorized access.
Run this from the `apps/dashboard` directory:
```bash
cd apps/dashboard
npx wrangler secret put DASHBOARD_PASSWORD
```

## 2. Remote Database Migration

Apply the D1 database migrations to the remote production database:
```bash
cd packages/db-opportunity-engine
npx wrangler d1 migrations apply daruma-opportunity-engine --remote
```

## 3. Deploy Dashboard & Workers

Deploy the SvelteKit Dashboard:
```bash
cd apps/dashboard
npx wrangler deploy
```

Deploy the Opportunity Engine Workers:
```bash
cd workers/opportunity-engine
npx wrangler deploy -c wrangler.collect.toml
npx wrangler deploy -c wrangler.score.toml
npx wrangler deploy -c wrangler.orchestrator.toml
```

## 4. Enable Scheduling (Cron)

Verify that `wrangler.orchestrator.toml` has the `[triggers]` section with `crons = ["0 6 * * *"]`. The deployment step above automatically registers the cron trigger with Cloudflare.

## 5. DNS Configuration

In the Cloudflare dashboard, ensure that `daruma.labcat.nz` is correctly mapped as a custom domain to the `daruma` worker project (this is also specified in `apps/dashboard/wrangler.toml`).

## Verification

Run an unattended orchestrator loop or manually trigger the orchestrator route/worker to verify end-to-end functionality in production. After successful verification, you may delete the legacy `tools/opportunity-engine/` directory.
