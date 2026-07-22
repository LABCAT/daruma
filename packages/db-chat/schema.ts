import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  preferredModelId: text("preferred_model_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system' | 'event'
  content: text("content").notNull(),
  modelId: text("model_id"),
  createdAt: text("created_at").notNull(),
});

export const apiUsage = sqliteTable("api_usage", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  messageId: text("message_id"),
  modelId: text("model_id").notNull(),
  provider: text("provider").notNull(),
  tokensPrompt: integer("tokens_prompt").notNull(),
  tokensCompletion: integer("tokens_completion").notNull(),
  tokensCached: integer("tokens_cached"),
  estimatedCost: real("estimated_cost").notNull(),
  createdAt: text("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey().default("user"),
  enabledModels: text("enabled_models").notNull(), // JSON string array
  failoverOrder: text("failover_order").notNull(), // JSON string array
});

export const memories = sqliteTable("memories", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  sourceConversationId: text("source_conversation_id").notNull(),
  status: text("status").notNull(), // 'active', 'archived', etc.
  createdAt: text("created_at").notNull(),
});
