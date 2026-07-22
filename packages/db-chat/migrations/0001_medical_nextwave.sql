CREATE TABLE `memories` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`source_conversation_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
