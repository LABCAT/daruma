// @ts-expect-error - vitest pool provides this module dynamically
import { env, createExecutionContext, waitOnExecutionContext, applyD1Migrations } from "cloudflare:test";
import { describe, it, expect, beforeAll, vi } from "vitest";
import worker from "./index.js";

function createMessageBatch(messages: any[]): MessageBatch<any> {
  return {
    queue: "collected-ideas",
    messages: messages.map(body => ({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      body,
      ack: vi.fn(),
      retry: vi.fn(),
    })),
    ackAll: vi.fn(),
    retryAll: vi.fn(),
  } as unknown as MessageBatch<any>;
}

describe("Score Worker", () => {
  beforeAll(async () => {
    await applyD1Migrations(env.DB, [
      {
        name: "0000_overrated_gambit.sql",
        queries: [
          `CREATE TABLE ideas_ranked (id text PRIMARY KEY NOT NULL, keyword text NOT NULL, rank_score real NOT NULL, score_json text NOT NULL, status text DEFAULT 'pending' NOT NULL, created_at text NOT NULL, CONSTRAINT status_check CHECK(ideas_ranked.status in ('pending', 'sent_to_synthesis', 'build', 'skip', 'research_more')));`,
          `CREATE TABLE ideas_raw (id text PRIMARY KEY NOT NULL, keyword text NOT NULL, category text, signals_json text NOT NULL, created_at text NOT NULL);`,
          `CREATE TABLE pipeline_runs (id text PRIMARY KEY NOT NULL, stage text NOT NULL, ideas_in integer, ideas_out integer, created_at text NOT NULL);`,
          `CREATE TABLE seen_keywords (keyword_normalized text PRIMARY KEY NOT NULL, last_seen_at text NOT NULL);`
        ]
      }
    ]);
  });

  it("scores an idea correctly and marks as pending when threshold is met", async () => {
    await env.DB.prepare("DELETE FROM ideas_raw").run();
    await env.DB.prepare("DELETE FROM ideas_ranked").run();
    await env.DB.prepare("DELETE FROM pipeline_runs").run();

    const rawId = "test-raw-id-1";
    const keyword = "plumber schedule";

    const signalsJson = JSON.stringify({
      playStoreApps: [
        { appId: "com.test", name: "Test Schedule App", description: "schedule", rating: 3.0, reviewCount: 100, free: true, monetisationType: "free" as any }
      ],
      playStoreReviews: [
        { appId: "com.test", score: 1, text: "I hate using a spreadsheet for this." },
        { appId: "com.test", score: 1, text: "I would gladly pay for a better option." }
      ],
      playSuggestKeywords: [],
      googleAutocompletions: [],
      serpPaaQuestions: [],
      serpRelatedSearches: [],
      serpAppCount: 0
    });

    await env.DB.prepare(
      "INSERT INTO ideas_raw (id, keyword, category, signals_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
    ).bind(rawId, keyword, "tradies", signalsJson, new Date().toISOString()).run();

    const batch = createMessageBatch([{ keyword, category: "tradies", raw_id: rawId }]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env as any, ctx);
    await waitOnExecutionContext(ctx);

    const ranked = await env.DB.prepare("SELECT * FROM ideas_ranked WHERE keyword = ?").bind(keyword).all<any>();
    expect(ranked.results.length).toBe(1);
    expect(ranked.results[0].status).toBe("pending"); 
    expect(ranked.results[0].rank_score).toBeGreaterThanOrEqual(12);

    const pipeline = await env.DB.prepare("SELECT * FROM pipeline_runs WHERE stage = 'score'").all<any>();
    expect(pipeline.results.length).toBe(1);
    expect(pipeline.results[0].ideas_in).toBe(1);
    expect(pipeline.results[0].ideas_out).toBe(1);

    expect(batch.messages[0].ack).toHaveBeenCalledOnce();
  });

  it("marks idea as skip when auto-skipped", async () => {
    await env.DB.prepare("DELETE FROM ideas_raw").run();
    await env.DB.prepare("DELETE FROM ideas_ranked").run();

    const rawId = "test-raw-id-2";
    const keyword = "api platform"; 

    const signalsJson = JSON.stringify({
      playStoreApps: [
        { appId: "com.test", name: "Test API Platform", rating: 4.8, reviewCount: 200000, free: true }
      ],
      playStoreReviews: [],
      playSuggestKeywords: [],
      googleAutocompletions: [],
      serpPaaQuestions: [],
      serpRelatedSearches: [],
      serpAppCount: 1
    });

    await env.DB.prepare(
      "INSERT INTO ideas_raw (id, keyword, category, signals_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
    ).bind(rawId, keyword, "test", signalsJson, new Date().toISOString()).run();

    const batch = createMessageBatch([{ keyword, category: "test", raw_id: rawId }]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env as any, ctx);
    await waitOnExecutionContext(ctx);

    const ranked = await env.DB.prepare("SELECT * FROM ideas_ranked WHERE keyword = ?").bind(keyword).all<any>();
    expect(ranked.results.length).toBe(1);
    expect(ranked.results[0].status).toBe("skip");

    expect(batch.messages[0].ack).toHaveBeenCalledOnce();
  });

  it("marks idea as skip if score is legitimately below threshold", async () => {
    await env.DB.prepare("DELETE FROM ideas_raw").run();
    await env.DB.prepare("DELETE FROM ideas_ranked").run();

    const rawId = "test-raw-id-3";
    const keyword = "random tool"; // No red flags, but also no pain or wtp

    // This gets Discovery: 5, BuildSpeed: 4, Pain: 1, WTP: 1 -> Total = 11 (Below threshold 12)
    const signalsJson = JSON.stringify({
      playStoreApps: [],
      playStoreReviews: [],
      playSuggestKeywords: [],
      googleAutocompletions: [],
      serpPaaQuestions: [],
      serpRelatedSearches: [],
      serpAppCount: 0
    });

    await env.DB.prepare(
      "INSERT INTO ideas_raw (id, keyword, category, signals_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
    ).bind(rawId, keyword, "test", signalsJson, new Date().toISOString()).run();

    const batch = createMessageBatch([{ keyword, category: "test", raw_id: rawId }]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env as any, ctx);
    await waitOnExecutionContext(ctx);

    const ranked = await env.DB.prepare("SELECT * FROM ideas_ranked WHERE keyword = ?").bind(keyword).all<any>();
    expect(ranked.results.length).toBe(1);
    expect(ranked.results[0].status).toBe("skip"); // Skipped because 11 < 12
    expect(ranked.results[0].rank_score).toBe(11);

    expect(batch.messages[0].ack).toHaveBeenCalledOnce();
  });

  it("retries message if raw idea is not found", async () => {
    await env.DB.prepare("DELETE FROM ideas_raw").run();
    await env.DB.prepare("DELETE FROM ideas_ranked").run();

    const batch = createMessageBatch([{ keyword: "missing", category: "test", raw_id: "missing-123" }]);
    const ctx = createExecutionContext();

    await worker.queue(batch, env as any, ctx);
    await waitOnExecutionContext(ctx);

    const ranked = await env.DB.prepare("SELECT * FROM ideas_ranked").all<any>();
    expect(ranked.results.length).toBe(0);

    expect(batch.messages[0].retry).toHaveBeenCalledOnce();
    expect(batch.messages[0].ack).not.toHaveBeenCalled();
  });

  it("is idempotent and updates existing record instead of throwing when processing the same message twice", async () => {
    await env.DB.prepare("DELETE FROM ideas_raw").run();
    await env.DB.prepare("DELETE FROM ideas_ranked").run();

    const rawId = "test-raw-id-4";
    const keyword = "plumber schedule duplicate";

    const signalsJson = JSON.stringify({
      playStoreApps: [
        { appId: "com.test", name: "Test Schedule App", description: "schedule", rating: 3.0, reviewCount: 100, free: true, monetisationType: "free" as any }
      ],
      playStoreReviews: [
        { appId: "com.test", score: 1, text: "I hate using a spreadsheet for this." },
        { appId: "com.test", score: 1, text: "I would gladly pay for a better option." }
      ],
      playSuggestKeywords: [],
      googleAutocompletions: [],
      serpPaaQuestions: [],
      serpRelatedSearches: [],
      serpAppCount: 0
    });

    await env.DB.prepare(
      "INSERT INTO ideas_raw (id, keyword, category, signals_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
    ).bind(rawId, keyword, "tradies", signalsJson, new Date().toISOString()).run();

    const batch = createMessageBatch([{ keyword, category: "tradies", raw_id: rawId }]);
    const ctx = createExecutionContext();

    // Run first time
    await worker.queue(batch, env as any, ctx);
    await waitOnExecutionContext(ctx);
    
    let ranked = await env.DB.prepare("SELECT * FROM ideas_ranked WHERE id = ?").bind(rawId).all<any>();
    expect(ranked.results.length).toBe(1);
    const firstScore = ranked.results[0].rank_score;

    // Run second time (simulating a retry where it was already committed but ack failed)
    const batch2 = createMessageBatch([{ keyword, category: "tradies", raw_id: rawId }]);
    const ctx2 = createExecutionContext();
    await worker.queue(batch2, env as any, ctx2);
    await waitOnExecutionContext(ctx2);

    ranked = await env.DB.prepare("SELECT * FROM ideas_ranked WHERE id = ?").bind(rawId).all<any>();
    // Should still only have 1 record, successfully updated via ON CONFLICT
    expect(ranked.results.length).toBe(1);
    expect(ranked.results[0].rank_score).toBe(firstScore);
    
    expect(batch2.messages[0].ack).toHaveBeenCalledOnce();
  });
});
