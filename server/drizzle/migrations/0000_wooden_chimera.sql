CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`posted_time` integer NOT NULL,
	`is_filtered` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nameIdx` ON `jobs` (`url`);