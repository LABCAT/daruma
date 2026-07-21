import { checkAutoSkip } from './auto-skip.js';
import { scoreRecord } from './rubric.js';
import { MIN_SCORE_THRESHOLD } from '../shared/config.js';
import { normalizeKeyword } from '../shared/dedupe.js';
import type { RawKeywordRecord } from '../shared/types.js';

interface Env {
  DB: D1Database;
}

export default {
  async queue(batch: MessageBatch<{ keyword: string; category: string; raw_id: string }>, env: Env, ctx: ExecutionContext): Promise<void> {
    if (batch.messages.length === 0) return;

    // 1. Fetch all raw ideas for the batch
    const rawIds = batch.messages.map(m => m.body.raw_id);
    const placeholders = rawIds.map(() => '?').join(',');
    
    let rows: any[] = [];
    try {
      const result = await env.DB.prepare(`SELECT * FROM ideas_raw WHERE id IN (${placeholders})`).bind(...rawIds).all<any>();
      rows = result.results ?? [];
    } catch (e) {
      console.error("Failed to fetch raw ideas", e);
      batch.retryAll();
      return;
    }

    const rowMap = new Map(rows.map(r => [r.id, r]));

    const insertStmts = [];
    let shortlistedCount = 0;
    const now = new Date().toISOString();
    
    const toAck: Message<{ keyword: string; category: string; raw_id: string }>[] = [];
    const toRetry: Message<{ keyword: string; category: string; raw_id: string }>[] = [];

    for (const msg of batch.messages) {
      const { keyword, category, raw_id } = msg.body;
      const row = rowMap.get(raw_id);

      if (!row) {
        console.error(`Raw idea not found for id: ${raw_id}`);
        // Retry in case of replication lag or race conditions
        toRetry.push(msg);
        continue;
      }

      try {
        const signals = JSON.parse(row.signals_json);
        const record: RawKeywordRecord = {
          keyword,
          category,
          normalizedKeyword: normalizeKeyword(keyword),
          ...signals,
          collectedAt: row.created_at,
        };

        const skip = checkAutoSkip(record);
        const scores = scoreRecord(record);

        const isSkipped = skip.skipped || scores.subtotal < MIN_SCORE_THRESHOLD;
        const status = isSkipped ? 'skip' : 'pending';
        
        if (!isSkipped) {
          shortlistedCount++;
        }

        const scoreJson = JSON.stringify({
          scores,
          autoSkipped: skip.skipped,
          skipReason: skip.reason,
        });

        insertStmts.push(
          env.DB.prepare(
            `INSERT INTO ideas_ranked (id, keyword, rank_score, score_json, status, created_at) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)
             ON CONFLICT(id) DO UPDATE SET 
               rank_score = excluded.rank_score,
               score_json = excluded.score_json,
               status = excluded.status`
          ).bind(raw_id, keyword, scores.subtotal, scoreJson, status, now)
        );
        
        toAck.push(msg);
      } catch (err) {
        console.error(`Failed to process "${keyword}": ${err}`);
        toRetry.push(msg);
      }
    }

    if (insertStmts.length > 0) {
      insertStmts.push(
        env.DB.prepare(
          "INSERT INTO pipeline_runs (id, stage, ideas_in, ideas_out, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
        ).bind(crypto.randomUUID(), 'score', toAck.length, shortlistedCount, now)
      );

      try {
        await env.DB.batch(insertStmts);
        for (const msg of toAck) msg.ack();
      } catch (err) {
        console.error("Failed to commit batch to DB", err);
        for (const msg of toAck) msg.retry();
      }
    }

    for (const msg of toRetry) msg.retry();
  }
};
