CREATE TABLE `api_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`message_id` text,
	`model_id` text NOT NULL,
	`provider` text NOT NULL,
	`tokens_prompt` integer NOT NULL,
	`tokens_completion` integer NOT NULL,
	`tokens_cached` integer,
	`estimated_cost` real NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`preferred_model_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`model_id` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY DEFAULT 'user' NOT NULL,
	`enabled_models` text NOT NULL,
	`failover_order` text NOT NULL
);
