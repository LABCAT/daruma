import { sqliteTable, text, real, integer, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const ideasRaw = sqliteTable("ideas_raw", {
  id: text("id").primaryKey(),
  keyword: text("keyword").notNull(),
  category: text("category"),
  signalsJson: text("signals_json").notNull(),
  createdAt: text("created_at").notNull(),
});

export const ideasRanked = sqliteTable("ideas_ranked", {
  id: text("id").primaryKey(),
  keyword: text("keyword").notNull(),
  rankScore: real("rank_score").notNull(),
  scoreJson: text("score_json").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  check("status_check", sql`${table.status} in ('pending', 'sent_to_synthesis', 'build', 'skip', 'research_more')`)
]);

export const seenKeywords = sqliteTable("seen_keywords", {
  keywordNormalized: text("keyword_normalized").primaryKey(),
  lastSeenAt: text("last_seen_at").notNull(),
});

export const pipelineRuns = sqliteTable("pipeline_runs", {
  id: text("id").primaryKey(),
  stage: text("stage").notNull(), // e.g. 'orchestrator', 'collect', 'score'
  ideasIn: integer("ideas_in"),
  ideasOut: integer("ideas_out"),
  createdAt: text("created_at").notNull(),
});
