# Opportunity Engine — Phase 0

Local CLI that runs the **Collect → Score** pipeline to surface Play Store app opportunities for SMB audiences. No AI, no database, no scheduling.

## Prerequisites

- Node.js 24+ (`fnm use` will pick up `.nvmrc`)
- npm

## Setup

```bash
cd tools/opportunity-engine
fnm use
npm install
npx playwright install chromium
```

## Usage

```bash
# Full run — all seed categories, with SERP scraping (Playwright)
npm run research

# Skip SERP scraping (faster, no Playwright)
npm run research:no-serp

# Run a subset of categories
npm run research -- --categories "tradies,fitness"
npm run research:no-serp -- --categories "home organization"
```

### Available categories

`tradies`, `hair beauty`, `hospitality`, `fitness`, `pet care`, `home organization`, `retail`, `professional services`

Edit `src/config.ts` to add more.

## Output

Written to `research-runs/YYYY-MM-DD/`:

| File | Contents |
|------|----------|
| `00-run-meta.json` | Run metadata — timing, counts |
| `01-raw.json` | Raw scraped data per keyword |
| `02-scored.json` | All scored records (including dropped + auto-skipped) |
| `03-ranked.json` | Shortlisted top records only |

## Dedupe

`seen_keywords.json` (gitignored) tracks keywords seen in the last 90 days. Delete it to reset.

## Tuning

All thresholds, lexicons, and seed keywords live in `src/config.ts`:
- `SEED_CATEGORIES` — keyword lists per category
- `PAIN_LEXICON` — review text pain signals
- `RED_FLAG_KEYWORDS` — build complexity signals
- `MIN_SCORE_THRESHOLD` — drop below this (default 12/20)
- `TOP_PERCENT` — keep top N% of scored records (default 20%)
