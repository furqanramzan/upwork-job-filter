CREATE TABLE `jobs` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`url` varchar(256) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`posted_time` timestamp NOT NULL,
	`filter` varchar(30) NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `urlIdx` ON `jobs` (`url`);