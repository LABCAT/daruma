---
description: Rules for deploying Daruma apps and workers
---

# Deployment Rules

Agents must **NEVER** run deployment commands locally (e.g., `wrangler deploy`, `npm run deploy`, `eas build`) to push code to production or staging environments unless explicitly instructed to do a "manual override" by the founder.

## CI/CD Only
All deployments must happen through the CI/CD pipeline (GitHub Actions). 
To deploy your changes, you must:
1. Run local checks (e.g., `pnpm run check`, `pnpm test:e2e`)
2. Commit your changes
3. Push to the appropriate branch (e.g., `main`)
4. Allow GitHub Actions to handle the Cloudflare or EAS deployment

## Why?
Running `wrangler deploy` locally causes configuration drift, bypasses automated tests, and can overwrite production environment variables.

If the user asks to deploy, simply commit and push the code and inform the user that the pipeline will handle the rest.
