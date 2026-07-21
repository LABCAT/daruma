// @ts-expect-error - vitest pool provides this module dynamically
import { env, createExecutionContext, waitOnExecutionContext, applyD1Migrations } from "cloudflare:test";
import { describe, it, expect, beforeAll, vi } from "vitest";

// Define EVERYTHING that needs to be hoisted, including the mock objects!
const { KEYWORDS, virtualFs, scraperMocks, googleMocks, serpMocks } = vi.hoisted(() => {
  const KEYWORDS = [
    { keyword: "tradie invoice", category: "tradies" },
    { keyword: "pet business management", category: "pet care" },
    { keyword: "fitness client tracker", category: "fitness" },
    { keyword: "impossible app no results", category: "niche" },
    { keyword: "red flag platform sync api", category: "tech" }
  ];

  const MOCK_PLAY_APPS = {
    "tradie invoice": [
      { appId: "com.tradie.inv", name: "Tradie Invoice Pro", description: "Invoice generator for tradies", rating: 4.8, reviewCount: 1500, price: 0, free: true, offersIAP: true, genre: "business" },
      { appId: "com.tradie.free", name: "Free Invoice", description: "Simple invoices", rating: 3.2, reviewCount: 400, price: 0, free: true, offersIAP: false, genre: "business" }
    ],
    "pet business management": [
      { appId: "com.pet.biz", name: "Pet Biz", description: "Pet care scheduling", rating: 4.1, reviewCount: 800, price: 0, free: true, offersIAP: true, genre: "productivity" }
    ],
    "fitness client tracker": [
      { appId: "com.fit.track", name: "Fit Track", description: "Track clients", rating: 4.9, reviewCount: 120000, price: 0, free: true, offersIAP: true, genre: "health" }
    ],
    "impossible app no results": [],
    "red flag platform sync api": [
      { appId: "com.sync.api", name: "Platform Sync API Dashboard", description: "Enterprise sync", rating: 4.5, reviewCount: 2000, price: 9.99, free: false, offersIAP: false, genre: "business" }
    ]
  };

  const MOCK_REVIEWS = {
    "com.tradie.inv": [{ text: "Great but wish it had a one time fee. Hate subscriptions.", score: 4 }],
    "com.tradie.free": [{ text: "So buggy and crashes all the time. Needs improvement.", score: 1 }],
    "com.pet.biz": [{ text: "Clunky UI, very hard to use and expensive.", score: 2 }],
    "com.fit.track": [{ text: "Perfect app.", score: 5 }],
    "com.sync.api": [{ text: "Needs better api.", score: 3 }]
  };

  const virtualFs = new Map<string, string>();

  const scraperMocks = {
    searchApps: async (kw: string) => {
      const raw = (MOCK_PLAY_APPS as any)[kw] || [];
      return raw.map((app: any) => ({
        name: app.name, appId: app.appId, description: app.description, genre: app.genre,
        rating: app.rating, reviewCount: app.reviewCount, price: app.price, free: app.free,
        hasIAP: app.offersIAP, monetisationType: !app.free ? 'paid' : (app.offersIAP ? 'freemium_iap' : 'free'),
        developer: '', lastUpdated: null, installs: null
      }));
    },
    getCompetitorReviews: async (apps: any[]) => {
      const reviews: any[] = [];
      for (const app of apps) {
        if ((MOCK_REVIEWS as any)[app.appId]) reviews.push(...(MOCK_REVIEWS as any)[app.appId].map((r: any) => ({ ...r, appId: app.appId })));
      }
      return reviews;
    },
    suggestKeywords: async () => [],
  };

  const googleMocks = { expandKeywordViaGoogle: async () => [] };

  const serpMocks = {
    SerpScraper: class {
      isAvailable = false;
      async init() {}
      async close() {}
      async scrape() { return { paaQuestions: [], relatedSearches: [], appCount: 0 }; }
    }
  };

  return { KEYWORDS, virtualFs, scraperMocks, googleMocks, serpMocks };
});

vi.mock("node:fs", () => ({
  existsSync: vi.fn(() => true)
}));

vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(async (path, data) => { virtualFs.set(path.toString(), data); }),
  mkdir: vi.fn(async () => {}),
  readFile: vi.fn(async (path) => virtualFs.get(path.toString()) || "{}")
}));

vi.mock("../../../tools/opportunity-engine/src/utils/delay.js", () => ({
  randomDelay: vi.fn(async () => {})
}));

vi.mock("./utils/delay.js", () => ({
  randomDelay: vi.fn(async () => {})
}));

vi.mock("../../../tools/opportunity-engine/src/collect/play-store.js", () => scraperMocks);
vi.mock("./collect/play-store.js", () => scraperMocks);

vi.mock("../../../tools/opportunity-engine/src/collect/google-autocomplete.js", () => googleMocks);
vi.mock("./collect/google-autocomplete.js", () => googleMocks);

vi.mock("../../../tools/opportunity-engine/src/collect/serp.js", () => serpMocks);
vi.mock("./collect/serp.js", () => serpMocks);

vi.mock("../../../tools/opportunity-engine/src/collect/dedupe.js", async (importOriginal) => {
  const mod = await importOriginal<any>();
  return { ...mod, isRecentlySeen: vi.fn(async () => false), markSeenBatch: vi.fn(async () => {}) };
});

// Old tool imports
import { collect as oldCollect } from "../../../tools/opportunity-engine/src/collect/index.js";
import { score as oldScore } from "../../../tools/opportunity-engine/src/score/index.js";

// New workers imports
import collectWorker from "./collect/index.js";
import scoreWorker from "./score/index.js";

function createMessageBatch(queueName: string, messages: any[]): MessageBatch<any> {
  return {
    queue: queueName,
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

describe("Parity Test: Old Tool vs New Workers", () => {
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

  it("diffs raw signals + subtotals exhaustively", async () => {
    // 1. Run old tool
    const categories = KEYWORDS.reduce((acc, { keyword, category }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(keyword);
      return acc;
    }, {} as Record<string, string[]>);

    const oldRaw = await oldCollect({ categories, noSerp: true, outputDir: '.test-output', force: true });
    await oldScore(oldRaw, { outputDir: '.test-output' });

    // Parse the full JSON outputs from virtual fs
    const oldRawData = JSON.parse(virtualFs.get('.test-output/01-raw.json') || '[]');
    const oldScoredData = JSON.parse(virtualFs.get('.test-output/02-scored.json') || '[]');

    // 2. Run new pipeline
    await env.DB.prepare("DELETE FROM ideas_raw").run();
    await env.DB.prepare("DELETE FROM ideas_ranked").run();

    const collectedQueueMessages: any[] = [];
    const fakeEnv = {
      DB: env.DB,
      COLLECTED_IDEAS_QUEUE: {
        send: async (msg: any) => { collectedQueueMessages.push(msg); }
      }
    };

    const collectBatch = createMessageBatch("daruma-opportunity-engine-raw-ideas", KEYWORDS);
    const collectCtx = createExecutionContext();
    await collectWorker.queue(collectBatch, fakeEnv as any, collectCtx);
    await waitOnExecutionContext(collectCtx);

    const scoreBatch = createMessageBatch("daruma-opportunity-engine-collected-ideas", collectedQueueMessages);
    const scoreCtx = createExecutionContext();
    await scoreWorker.queue(scoreBatch, fakeEnv as any, scoreCtx);
    await waitOnExecutionContext(scoreCtx);

    // 3. Complete 100% exhaustive diff
    const newRawRows = await env.DB.prepare("SELECT * FROM ideas_raw").all<any>();
    const newRankRows = await env.DB.prepare("SELECT * FROM ideas_ranked").all<any>();

    expect(newRawRows.results.length).toBe(KEYWORDS.length);
    expect(newRankRows.results.length).toBe(KEYWORDS.length);

    const oldRawMap = new Map(oldRawData.map((r: any) => [r.keyword, r]));
    const oldScoreMap = new Map(oldScoredData.map((r: any) => [r.keyword, r]));

    const newRawMap = new Map(newRawRows.results.map(r => [r.keyword, { category: r.category, signals: JSON.parse(r.signals_json) }]));
    const newScoreMap = new Map(newRankRows.results.map(r => [r.keyword, { score: r.rank_score, details: JSON.parse(r.score_json) }]));

    for (const kw of KEYWORDS) {
      const oldR = oldRawMap.get(kw.keyword);
      const newR = newRawMap.get(kw.keyword);
      
      expect(oldR).toBeDefined();
      expect(newR).toBeDefined();

      // Deep compare raw signals
      expect(newR?.signals.playStoreApps).toEqual(oldR?.playStoreApps);
      expect(newR?.signals.playStoreReviews).toEqual(oldR?.playStoreReviews);
      expect(newR?.signals.playSuggestKeywords).toEqual(oldR?.playSuggestKeywords);
      expect(newR?.signals.googleAutocompletions).toEqual(oldR?.googleAutocompletions);
      expect(newR?.signals.serpPaaQuestions).toEqual(oldR?.serpPaaQuestions);
      expect(newR?.signals.serpRelatedSearches).toEqual(oldR?.serpRelatedSearches);
      expect(newR?.signals.serpAppCount).toEqual(oldR?.serpAppCount);

      const oldS = oldScoreMap.get(kw.keyword);
      const newS = newScoreMap.get(kw.keyword);

      expect(oldS).toBeDefined();
      expect(newS).toBeDefined();

      // Deep compare subtotals and score dimension breakdowns
      expect(newS?.score).toBe(oldS?.scores.subtotal);
      expect(newS?.details.scores.pain).toBe(oldS?.scores.pain);
      expect(newS?.details.scores.wtp).toBe(oldS?.scores.wtp);
      expect(newS?.details.scores.discovery).toBe(oldS?.scores.discovery);
      expect(newS?.details.scores.buildSpeed).toBe(oldS?.scores.buildSpeed);
      expect(newS?.details.scores.relevanceConfidence).toBe(oldS?.scores.relevanceConfidence);
      expect(newS?.details.autoSkipped).toBe(oldS?.autoSkipped);
      expect(newS?.details.skipReason).toBe(oldS?.skipReason);
    }
  });
});
