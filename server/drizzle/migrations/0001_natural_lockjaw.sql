CREATE TABLE `tokens` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`endpoint` varchar(256) NOT NULL,
	`key` varchar(256) NOT NULL,
	`auth` varchar(256) NOT NULL);
