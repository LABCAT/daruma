import { SEED_CATEGORIES } from "../../../../tools/opportunity-engine/src/config.js";

interface Env {
  DB: D1Database;
  RAW_IDEAS_QUEUE: Queue;
  CRON_SECRET: string;
}

export function normalizeKeyword(keyword: string): string {
  return keyword.toLowerCase().trim().replace(/\s+/g, ' ');
}

export async function runOrchestrator(env: Env): Promise<{ enqueued: number; skipped: number }> {
  // Load candidate keywords
  const candidates: { keyword: string; category: string }[] = [];
  for (const [category, keywords] of Object.entries(SEED_CATEGORIES)) {
    for (const keyword of keywords) {
      candidates.push({ keyword, category });
    }
  }

  // Get recently seen keywords
  const { results } = await env.DB.prepare(
    "SELECT keyword_normalized FROM seen_keywords WHERE datetime(last_seen_at) > datetime('now', '-90 days')"
  ).all<{ keyword_normalized: string }>();
  
  const seenSet = new Set(results.map(r => r.keyword_normalized));

  let enqueued = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    const normalized = normalizeKeyword(candidate.keyword);
    if (seenSet.has(normalized)) {
      skipped++;
      continue;
    }
    await env.RAW_IDEAS_QUEUE.send(candidate);
    enqueued++;
  }

  // Write pipeline_runs
  await env.DB.prepare(
    "INSERT INTO pipeline_runs (id, stage, ideas_in, ideas_out, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
  ).bind(
    crypto.randomUUID(),
    'orchestrator',
    candidates.length,
    enqueued,
    new Date().toISOString()
  ).run();

  return { enqueued, skipped };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { enqueued, skipped } = await runOrchestrator(env);
    return new Response(`Orchestrator executed. Enqueued: ${enqueued}, Skipped: ${skipped}`);
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    await runOrchestrator(env);
    console.log("Orchestrator cron trigger completed.");
  }
};
