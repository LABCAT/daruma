// @ts-expect-error - vitest pool provides this module dynamically
import { env, createExecutionContext, waitOnExecutionContext, applyD1Migrations } from "cloudflare:test";
import { describe, it, expect, beforeAll, vi } from "vitest";
import worker from "./index.js";
import { normalizeKeyword } from "../shared/dedupe.js";

// Mock the external scrapers so we don't hit real APIs during test
vi.mock("./play-store.js", () => ({
  searchApps: vi.fn().mockResolvedValue([]),
  getCompetitorReviews: vi.fn().mockResolvedValue([]),
  suggestKeywords: vi.fn().mockResolvedValue([]),
}));

vi.mock("./google-autocomplete.js", () => ({
  expandKeywordViaGoogle: vi.fn().mockResolvedValue([]),
}));

vi.mock("./serp.js", () => {
  return {
    SerpScraper: class {
      isAvailable = false;
      async init() {}
      async close() {}
      async scrape() { return { paaQuestions: [], relatedSearches: [], appCount: 0 }; }
    }
  };
});

// Helper to create a fake MessageBatch
function createMessageBatch(messages: any[]): MessageBatch<any> {
  return {
    queue: "daruma-opportunity-engine-raw-ideas",
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

describe("Collect Worker", () => {
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

  it("processes a raw-ideas message, inserts into ideas_raw, updates seen_keywords, and publishes to collected-ideas", async () => {
    await env.DB.prepare("DELETE FROM ideas_raw").run();
    await env.DB.prepare("DELETE FROM seen_keywords").run();
    await env.DB.prepare("DELETE FROM pipeline_runs").run();

    const keyword = "test keyword";
    const category = "test category";
    const batch = createMessageBatch([{ keyword, category }]);
    const ctx = createExecutionContext();

    let sentToCollected = false;
    const fakeEnv = {
      ...env,
      COLLECTED_IDEAS_QUEUE: {
        send: vi.fn().mockImplementation(async (msg) => {
          sentToCollected = true;
          expect(msg.keyword).toBe(keyword);
          expect(msg.category).toBe(category);
          expect(msg.raw_id).toBeDefined();
        })
      }
    };

    await worker.queue(batch, fakeEnv as any, ctx);
    await waitOnExecutionContext(ctx);

    // Verify ideas_raw insertion
    const rawIdeas = await env.DB.prepare("SELECT * FROM ideas_raw WHERE keyword = ?").bind(keyword).all<any>();
    expect(rawIdeas.results.length).toBe(1);
    expect(rawIdeas.results[0].category).toBe(category);
    expect(rawIdeas.results[0].signals_json).toContain("playStoreApps");

    // Verify seen_keywords insertion
    const normalized = normalizeKeyword(keyword);
    const seen = await env.DB.prepare("SELECT * FROM seen_keywords WHERE keyword_normalized = ?").bind(normalized).all<any>();
    expect(seen.results.length).toBe(1);

    // Verify queue publish
    expect(fakeEnv.COLLECTED_IDEAS_QUEUE.send).toHaveBeenCalledOnce();
    expect(sentToCollected).toBe(true);
    
    // Verify pipeline_runs insertion
    const runs = await env.DB.prepare("SELECT * FROM pipeline_runs WHERE stage = 'collect'").all<any>();
    expect(runs.results.length).toBe(1);
    expect(runs.results[0].ideas_out).toBe(1);

    // Verify message ack
    expect(batch.messages[0].ack).toHaveBeenCalledOnce();
  });
  
  it("upserts seen_keywords properly on success if keyword already seen", async () => {
    const keyword = "duplicate test";
    const category = "test";
    const normalized = normalizeKeyword(keyword);
    
    // Insert initial record
    await env.DB.prepare(
      "INSERT INTO seen_keywords (keyword_normalized, last_seen_at) VALUES (?, datetime('now', '-1 days'))"
    ).bind(normalized).run();

    const batch = createMessageBatch([{ keyword, category }]);
    const ctx = createExecutionContext();
    
    const fakeEnv = {
      ...env,
      COLLECTED_IDEAS_QUEUE: { send: vi.fn() }
    };

    await worker.queue(batch, fakeEnv as any, ctx);
    await waitOnExecutionContext(ctx);

    const seen = await env.DB.prepare("SELECT * FROM seen_keywords WHERE keyword_normalized = ?").bind(normalized).all<any>();
    expect(seen.results.length).toBe(1);
    // last_seen_at should be updated to a newer date
    const lastSeen = new Date(seen.results[0].last_seen_at).getTime();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
    expect(lastSeen).toBeGreaterThan(oneDayAgo);
  });

  it("does NOT insert into ideas_raw or seen_keywords or publish if scraper fails", async () => {
    await env.DB.prepare("DELETE FROM ideas_raw").run();
    await env.DB.prepare("DELETE FROM seen_keywords").run();

    const keyword = "failure test";
    const batch = createMessageBatch([{ keyword, category: "test" }]);
    const ctx = createExecutionContext();
    
    const fakeEnv = {
      ...env,
      COLLECTED_IDEAS_QUEUE: { send: vi.fn() }
    };

    // Force scraper to fail
    const { searchApps } = await import("./play-store.js");
    vi.mocked(searchApps).mockRejectedValueOnce(new Error("Simulated scraper failure"));

    await worker.queue(batch, fakeEnv as any, ctx);
    await waitOnExecutionContext(ctx);

    // Verify retry was called
    expect(batch.messages[0].retry).toHaveBeenCalledOnce();
    
    // Ensure no publish
    expect(fakeEnv.COLLECTED_IDEAS_QUEUE.send).not.toHaveBeenCalled();
    
    // Verify DB state with the real env.DB to ensure nothing was inserted
    const rawIdeas = await env.DB.prepare("SELECT * FROM ideas_raw WHERE keyword = ?").bind(keyword).all<any>();
    expect(rawIdeas.results.length).toBe(0);

    const normalized = normalizeKeyword(keyword);
    const seen = await env.DB.prepare("SELECT * FROM seen_keywords WHERE keyword_normalized = ?").bind(normalized).all<any>();
    expect(seen.results.length).toBe(0);
  });
});
