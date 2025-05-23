CREATE TABLE `Activity` (
	`id` text PRIMARY KEY NOT NULL,
	`event` text NOT NULL,
	`source` text NOT NULL,
	`receivedAt` integer NOT NULL,
	`data` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `File` (
	`id` text PRIMARY KEY NOT NULL,
	`externalId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`source` text NOT NULL,
	`messages` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
