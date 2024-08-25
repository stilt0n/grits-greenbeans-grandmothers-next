CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text DEFAULT 'grandmother_bot',
	`recipe_time` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	`instructions` text NOT NULL
);
