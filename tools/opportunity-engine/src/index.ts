// ── Opportunity Engine — Phase 0 entry point ──
// Runs Collect → Score pipeline end-to-end.
// No AI, no database, no scheduling.
//
// Usage:
//   npm run research              — full run with SERP scraping
//   npm run research:no-serp      — skip Playwright SERP scraping
//   npm run research -- --categories "tradies,fitness"  — subset of categories

import { collect } from './collect/index.js';
import { score } from './score/index.js';
import { log } from './utils/logger.js';
import { SEED_CATEGORIES } from './config.js';
import type { PipelineRun } from './types.js';
import { writeFile } from 'node:fs/promises';

async function main() {
  const startedAt = new Date().toISOString();
  const args = process.argv.slice(2);

  // Parse CLI flags
  const noSerp = args.includes('--no-serp');
  const force = args.includes('--force');
  const categoryFlag = args.find((_, i) => args[i - 1] === '--categories');
  const limitIndex = args.indexOf('--limit');
  const limitArg = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : undefined;
  const limit = limitArg && !isNaN(limitArg) ? limitArg : undefined;

  // Resolve categories
  let categories = SEED_CATEGORIES;
  if (categoryFlag) {
    const requested = categoryFlag.split(',').map((c) => c.trim());
    categories = {};
    for (const cat of requested) {
      if (SEED_CATEGORIES[cat]) {
        categories[cat] = SEED_CATEGORIES[cat];
      } else {
        log.warn('INIT', `Unknown category "${cat}" — skipping`);
      }
    }
    if (Object.keys(categories).length === 0) {
      log.error('INIT', 'No valid categories found. Available: ' + Object.keys(SEED_CATEGORIES).join(', '));
      process.exit(1);
    }
  }

  log.info('INIT', '═══════════════════════════════════════════');
  log.info('INIT', '  Daruma Opportunity Engine — Phase 0');
  log.info('INIT', '  Collect → Score (no AI)');
  log.info('INIT', '═══════════════════════════════════════════');
  log.info('INIT', `Categories: ${Object.keys(categories).join(', ')}`);
  log.info('INIT', `SERP scraping: ${noSerp ? 'DISABLED' : 'ENABLED'}`);
  log.info('INIT', `Force run (ignore dedupe): ${force ? 'YES' : 'NO'}`);
  log.info('INIT', `Limit: ${limit ? limit : 'DEFAULT'}`);
  log.info('INIT', '');

  // Output to research-runs/YYYY-MM-DD/
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const outputDir = `research-runs/${today}`;

  // ── Stage 1: Collect ──
  log.info('COLLECT', '── Stage 1: Collect ──────────────────────');
  const rawRecords = await collect({ categories, noSerp, outputDir, force, limit });

  if (rawRecords.length === 0) {
    log.warn('COLLECT', 'No records collected — nothing to score. Exiting.');
    return;
  }

  // ── Stage 2: Score ──
  log.info('SCORE', '── Stage 2: Score ────────────────────────');
  const rankedRecords = await score(rawRecords, { outputDir });

  // ── Write run metadata ──
  const completedAt = new Date().toISOString();
  const run: PipelineRun = {
    id: `run-${Date.now()}`,
    startedAt,
    completedAt,
    seedCategories: Object.keys(categories),
    keywordsCollected: rawRecords.length,
    keywordsScored: rawRecords.length,
    keywordsRanked: rankedRecords.length,
    keywordsSkipped: rawRecords.length - rankedRecords.length,
  };

  await writeFile(`${outputDir}/00-run-meta.json`, JSON.stringify(run, null, 2), 'utf-8');

  // ── Summary ──
  log.info('DONE', '══════════════════════════════════════════');
  log.info('DONE', '  Pipeline complete');
  log.info('DONE', `  Collected: ${run.keywordsCollected} keywords`);
  log.info('DONE', `  Ranked:    ${run.keywordsRanked} keywords`);
  log.info('DONE', `  Skipped:   ${run.keywordsSkipped} keywords`);
  log.info('DONE', `  Duration:  ${Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000)}s`);
  log.info('DONE', '');
  log.info('DONE', '  Output files:');
  log.info('DONE', `    ${outputDir}/00-run-meta.json   — run metadata`);
  log.info('DONE', `    ${outputDir}/01-raw.json        — raw collected data`);
  log.info('DONE', `    ${outputDir}/02-scored.json     — all scored (inc. dropped)`);
  log.info('DONE', `    ${outputDir}/03-ranked.json     — shortlisted top records`);
  log.info('DONE', '══════════════════════════════════════════');
}

main().catch((err) => {
  log.error('INIT', `Pipeline failed: ${err}`);
  console.error(err);
  process.exit(1);
});
