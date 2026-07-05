// ── Score stage orchestrator ──
// Takes raw records from Collect, applies auto-skip + rubric scoring,
// filters and ranks. Outputs 02-scored.json and 03-ranked.json.

import { writeFile } from 'node:fs/promises';
import type { RawKeywordRecord, ScoredRecord } from '../types.js';
import { log } from '../utils/logger.js';
import { checkAutoSkip } from './auto-skip.js';
import { scoreRecord } from './rubric.js';
import { MIN_SCORE_THRESHOLD, TOP_PERCENT } from '../config.js';

interface ScoreOptions {
  outputDir?: string;
}

/**
 * Run the Score stage.
 * 1. Apply auto-skip rules
 * 2. Score each surviving record (rubric /20)
 * 3. Drop below MIN_SCORE_THRESHOLD
 * 4. Sort by subtotal descending
 * 5. Keep top TOP_PERCENT %
 *
 * Writes:
 * - output/02-scored.json — all records including dropped/skipped (for debugging)
 * - output/03-ranked.json — shortlisted top records only
 */
export async function score(
  rawRecords: RawKeywordRecord[],
  opts: ScoreOptions = {},
): Promise<ScoredRecord[]> {
  const outputDir = opts.outputDir ?? 'output';

  log.info('SCORE', `Scoring ${rawRecords.length} raw records`);

  // Score all records
  const scoredRecords: ScoredRecord[] = rawRecords.map((record) => {
    // Check auto-skip first
    const skip = checkAutoSkip(record);

    // Score even if skipped (for debugging/inspection)
    const scores = scoreRecord(record);

    return {
      ...record,
      scores,
      autoSkipped: skip.skipped,
      skipReason: skip.reason,
    };
  });

  // Log auto-skip stats
  const skippedCount = scoredRecords.filter((r) => r.autoSkipped).length;
  log.info('SCORE', `Auto-skipped: ${skippedCount}/${scoredRecords.length}`);

  // Write ALL scored records (including skipped and below-threshold)
  const scoredPath = `${outputDir}/02-scored.json`;
  await writeFile(scoredPath, JSON.stringify(scoredRecords, null, 2), 'utf-8');
  log.success('SCORE', `All ${scoredRecords.length} scored records written to ${scoredPath}`);

  // Filter: remove auto-skipped and below-threshold
  const surviving = scoredRecords
    .filter((r) => !r.autoSkipped)
    .filter((r) => r.scores.subtotal >= MIN_SCORE_THRESHOLD);

  log.info('SCORE', `Surviving after threshold (≥${MIN_SCORE_THRESHOLD}/20): ${surviving.length}`);

  // Sort by subtotal descending
  surviving.sort((a, b) => b.scores.subtotal - a.scores.subtotal);

  // Keep top N%
  const keepCount = Math.max(1, Math.ceil(surviving.length * (TOP_PERCENT / 100)));
  const ranked = surviving.slice(0, keepCount);

  log.info('SCORE', `Ranked shortlist (top ${TOP_PERCENT}%): ${ranked.length} records`);

  // Write ranked shortlist
  const rankedPath = `${outputDir}/03-ranked.json`;
  await writeFile(rankedPath, JSON.stringify(ranked, null, 2), 'utf-8');
  log.success('SCORE', `${ranked.length} ranked records written to ${rankedPath}`);

  // Log score distribution
  if (ranked.length > 0) {
    log.info('SCORE', 'Score distribution of ranked records:');
    for (const r of ranked) {
      const s = r.scores;
      log.info(
        'SCORE',
        `  ${r.keyword} — P:${s.pain} W:${s.wtp} D:${s.discovery} B:${s.buildSpeed} = ${s.subtotal}/20`,
      );
    }
  }

  return ranked;
}
