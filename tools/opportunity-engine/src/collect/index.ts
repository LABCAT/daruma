// ── Collect stage orchestrator ──
// Runs all collectors for each keyword across all seed categories.
// Output: array of RawKeywordRecord written to output/01-raw.json

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { RawKeywordRecord } from '../types.js';
import { log } from '../utils/logger.js';
import { randomDelay } from '../utils/delay.js';
import { SEED_CATEGORIES, PLAY_DELAY } from '../config.js';
import { normalizeKeyword, isRecentlySeen, markSeenBatch } from './dedupe.js';
import { searchApps, getCompetitorReviews, suggestKeywords } from './play-store.js';
import { expandKeywordViaGoogle } from './google-autocomplete.js';
import { SerpScraper } from './serp.js';

interface CollectOptions {
  /** Override default seed categories */
  categories?: Record<string, string[]>;
  /** Skip Playwright SERP scraping */
  noSerp?: boolean;
  /** Output directory */
  outputDir?: string;
}

/**
 * Run the Collect stage.
 * For each category → for each niche keyword → scrape all sources.
 * Returns raw records and writes them to output/01-raw.json.
 */
export async function collect(opts: CollectOptions = {}): Promise<RawKeywordRecord[]> {
  const categories = opts.categories ?? SEED_CATEGORIES;
  const outputDir = opts.outputDir ?? 'output';
  const noSerp = opts.noSerp ?? false;

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // Build flat list of all keywords to process
  const keywordQueue: Array<{ keyword: string; category: string }> = [];
  for (const [category, keywords] of Object.entries(categories)) {
    for (const kw of keywords) {
      keywordQueue.push({ keyword: kw, category });
    }
  }

  log.info('COLLECT', `${keywordQueue.length} keywords across ${Object.keys(categories).length} categories`);

  // Filter out recently seen keywords
  const freshKeywords: typeof keywordQueue = [];
  for (const item of keywordQueue) {
    if (await isRecentlySeen(item.keyword)) {
      log.info('COLLECT', `Skipping "${item.keyword}" — seen within 90 days`);
    } else {
      freshKeywords.push(item);
    }
  }

  log.info('COLLECT', `${freshKeywords.length} fresh keywords to process (${keywordQueue.length - freshKeywords.length} skipped by dedupe)`);

  // Init SERP scraper if enabled
  const serp = new SerpScraper();
  if (!noSerp) {
    await serp.init();
  }

  const records: RawKeywordRecord[] = [];

  for (let i = 0; i < freshKeywords.length; i++) {
    const { keyword, category } = freshKeywords[i];
    log.progress('COLLECT', i + 1, freshKeywords.length, `"${keyword}" [${category}]`);

    try {
      // 1. Play Store search
      await randomDelay(PLAY_DELAY.min, PLAY_DELAY.max);
      const playApps = await searchApps(keyword);
      log.info('COLLECT', `  Play search: ${playApps.length} apps`);

      // 2. Play Store reviews (top 3 competitor apps)
      const reviews = await getCompetitorReviews(playApps);
      log.info('COLLECT', `  Reviews: ${reviews.length} from top ${Math.min(playApps.length, 3)} apps`);

      // 3. Play Store suggest
      await randomDelay(PLAY_DELAY.min, PLAY_DELAY.max);
      let playSuggestions: string[] = [];
      try {
        playSuggestions = await suggestKeywords(keyword);
        log.info('COLLECT', `  Play suggest: ${playSuggestions.length} keywords`);
      } catch (err) {
        log.warn('COLLECT', `  Play suggest failed: ${err}`);
      }

      // 4. Google Autocomplete expansion
      let googleCompletions: string[] = [];
      try {
        googleCompletions = await expandKeywordViaGoogle(keyword);
        log.info('COLLECT', `  Google autocomplete: ${googleCompletions.length} keywords`);
      } catch (err) {
        log.warn('COLLECT', `  Google autocomplete failed: ${err}`);
      }

      // 5. SERP scraping (if enabled)
      let serpPaaQuestions: string[] = [];
      let serpRelatedSearches: string[] = [];
      let serpAppCount = 0;

      if (serp.isAvailable) {
        const serpResult = await serp.scrape(keyword);
        serpPaaQuestions = serpResult.paaQuestions;
        serpRelatedSearches = serpResult.relatedSearches;
        serpAppCount = serpResult.appCount;
      }

      // Build record
      const record: RawKeywordRecord = {
        keyword,
        normalizedKeyword: normalizeKeyword(keyword),
        category,
        playStoreApps: playApps,
        playStoreReviews: reviews,
        playSuggestKeywords: playSuggestions,
        googleAutocompletions: googleCompletions,
        serpPaaQuestions,
        serpRelatedSearches,
        serpAppCount,
        collectedAt: new Date().toISOString(),
      };

      records.push(record);
    } catch (err) {
      log.error('COLLECT', `Failed to collect "${keyword}": ${err}`);
    }
  }

  // Close SERP browser
  await serp.close();

  // Mark all collected keywords as seen
  await markSeenBatch(
    records.map((r) => ({ keyword: r.keyword })),
  );

  // Write output
  const outputPath = `${outputDir}/01-raw.json`;
  await writeFile(outputPath, JSON.stringify(records, null, 2), 'utf-8');
  log.success('COLLECT', `${records.length} records written to ${outputPath}`);

  return records;
}
