import { searchApps, getCompetitorReviews, suggestKeywords } from './play-store.js';
import { expandKeywordViaGoogle } from './google-autocomplete.js';
import { SerpScraper } from './serp.js';
import { normalizeKeyword } from '../shared/dedupe.js';

interface Env {
  DB: D1Database;
  COLLECTED_IDEAS_QUEUE: Queue;
}

export default {
  async queue(batch: MessageBatch<{ keyword: string; category: string }>, env: Env, ctx: ExecutionContext): Promise<void> {
    const serp = new SerpScraper();
    await serp.init(); // Playwright will gracefully fail to initialize

    let processedCount = 0;

    for (const msg of batch.messages) {
      const { keyword, category } = msg.body;
      console.log(`Collect Worker: Processing keyword: "${keyword}"`);

      try {
        const playApps = await searchApps(keyword);
        const reviews = await getCompetitorReviews(playApps);

        let playSuggestions: string[] = [];
        try { playSuggestions = await suggestKeywords(keyword); } catch (e) {
          console.warn(`Play suggest failed: ${e}`);
        }

        let googleCompletions: string[] = [];
        try { googleCompletions = await expandKeywordViaGoogle(keyword); } catch (e) {
          console.warn(`Google autocomplete failed: ${e}`);
        }

        let serpPaaQuestions: string[] = [];
        let serpRelatedSearches: string[] = [];
        let serpAppCount = 0;

        if (serp.isAvailable) {
          const serpResult = await serp.scrape(keyword);
          serpPaaQuestions = serpResult.paaQuestions;
          serpRelatedSearches = serpResult.relatedSearches;
          serpAppCount = serpResult.appCount;
        }

        const normalizedKeyword = normalizeKeyword(keyword);
        const signals_json = JSON.stringify({
          playStoreApps: playApps,
          playStoreReviews: reviews,
          playSuggestKeywords: playSuggestions,
          googleAutocompletions: googleCompletions,
          serpPaaQuestions,
          serpRelatedSearches,
          serpAppCount,
        });

        const rawId = crypto.randomUUID();
        const now = new Date().toISOString();

        // 2 & 3. Batch insert to ideas_raw and upsert seen_keywords atomically
        await env.DB.batch([
          env.DB.prepare(
            "INSERT INTO ideas_raw (id, keyword, category, signals_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
          ).bind(rawId, keyword, category, signals_json, now),
          env.DB.prepare(
            "INSERT INTO seen_keywords (keyword_normalized, last_seen_at) VALUES (?1, ?2) ON CONFLICT(keyword_normalized) DO UPDATE SET last_seen_at = excluded.last_seen_at"
          ).bind(normalizedKeyword, now)
        ]);

        // 4. Publish collected-ideas
        await env.COLLECTED_IDEAS_QUEUE.send({
          keyword,
          raw_id: rawId,
          category
        });

        processedCount++;
        msg.ack();
      } catch (err) {
        console.error(`Failed to collect "${keyword}": ${err}`);
        msg.retry();
      }
    }

    await serp.close();

    // 5. pipeline_runs stage=collect
    if (processedCount > 0) {
      await env.DB.prepare(
        "INSERT INTO pipeline_runs (id, stage, ideas_in, ideas_out, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
      ).bind(
        crypto.randomUUID(),
        'collect',
        batch.messages.length,
        processedCount,
        new Date().toISOString()
      ).run();
    }
  }
};
