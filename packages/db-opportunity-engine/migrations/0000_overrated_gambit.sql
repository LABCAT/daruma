CREATE TABLE `ideas_ranked` (
	`id` text PRIMARY KEY NOT NULL,
	`keyword` text NOT NULL,
	`rank_score` real NOT NULL,
	`score_json` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "status_check" CHECK("ideas_ranked"."status" in ('pending', 'sent_to_synthesis', 'build', 'skip', 'research_more'))
);
--> statement-breakpoint
CREATE TABLE `ideas_raw` (
	`id` text PRIMARY KEY NOT NULL,
	`keyword` text NOT NULL,
	`category` text,
	`signals_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pipeline_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`stage` text NOT NULL,
	`ideas_in` integer,
	`ideas_out` integer,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `seen_keywords` (
	`keyword_normalized` text PRIMARY KEY NOT NULL,
	`last_seen_at` text NOT NULL
);
