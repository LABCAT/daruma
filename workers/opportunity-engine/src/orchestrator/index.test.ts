// @ts-expect-error - vitest pool provides this module dynamically
import { env, createExecutionContext, waitOnExecutionContext, applyD1Migrations } from "cloudflare:test";
import { describe, it, expect, beforeAll } from "vitest";
import worker, { normalizeKeyword } from "./index.js";
import { SEED_CATEGORIES } from "../../../../tools/opportunity-engine/src/config.js";

const totalSeeds = Object.values(SEED_CATEGORIES).reduce((acc, curr) => acc + curr.length, 0);

describe("Orchestrator Worker", () => {
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

  it("enqueues all seeds if none seen recently", async () => {
    await env.DB.prepare("DELETE FROM seen_keywords").run();
    await env.DB.prepare("DELETE FROM pipeline_runs").run();

    const request = new Request("http://example.com", {
      headers: { 'Authorization': 'Bearer test-secret' }
    });
    const ctx = createExecutionContext();
    const mockEnv = { ...env, CRON_SECRET: 'test-secret' } as any;
    const response = await worker.fetch(request, mockEnv, ctx);
    
    await waitOnExecutionContext(ctx);
    
    expect(await response.text()).toContain(`Enqueued: ${totalSeeds}, Skipped: 0`);

    const runs = await env.DB.prepare("SELECT * FROM pipeline_runs WHERE stage = 'orchestrator'").all<any>();
    expect(runs.results.length).toBe(1);
    expect(runs.results[0].ideas_out).toBe(totalSeeds);
  });

  it("skips recently seen keywords (within 90 days)", async () => {
    await env.DB.prepare("DELETE FROM seen_keywords").run();

    const firstSeed = SEED_CATEGORIES[Object.keys(SEED_CATEGORIES)[0]][0];
    const normalized = normalizeKeyword(firstSeed);
    
    await env.DB.prepare(
      "INSERT INTO seen_keywords (keyword_normalized, last_seen_at) VALUES (?, datetime('now', '-10 days'))"
    ).bind(normalized).run();

    const request = new Request("http://example.com", {
      headers: { 'Authorization': 'Bearer test-secret' }
    });
    const ctx = createExecutionContext();
    const mockEnv = { ...env, CRON_SECRET: 'test-secret' } as any;
    const response = await worker.fetch(request, mockEnv, ctx);
    
    await waitOnExecutionContext(ctx);
    
    expect(await response.text()).toContain(`Enqueued: ${totalSeeds - 1}, Skipped: 1`);
  });

  it("does not skip keywords seen older than 90 days", async () => {
    await env.DB.prepare("DELETE FROM seen_keywords").run();

    const firstSeed = SEED_CATEGORIES[Object.keys(SEED_CATEGORIES)[0]][0];
    const normalized = normalizeKeyword(firstSeed);
    
    await env.DB.prepare(
      "INSERT INTO seen_keywords (keyword_normalized, last_seen_at) VALUES (?, datetime('now', '-100 days'))"
    ).bind(normalized).run();

    const request = new Request("http://example.com", {
      headers: { 'Authorization': 'Bearer test-secret' }
    });
    const ctx = createExecutionContext();
    const mockEnv = { ...env, CRON_SECRET: 'test-secret' } as any;
    const response = await worker.fetch(request, mockEnv, ctx);
    
    await waitOnExecutionContext(ctx);
    
    expect(await response.text()).toContain(`Enqueued: ${totalSeeds}, Skipped: 0`);
  });
});
