ALTER TABLE `File` RENAME TO `SyncedObject`;--> statement-breakpoint
ALTER TABLE `SyncedObject` RENAME COLUMN "messages" TO "data";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_SyncedObject` (
	`id` text PRIMARY KEY NOT NULL,
	`externalId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`source` text NOT NULL,
	`data` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_SyncedObject`("id", "externalId", "createdAt", "updatedAt", "source", "data", "userId") SELECT "id", "externalId", "createdAt", "updatedAt", "source", "data", "userId" FROM `SyncedObject`;--> statement-breakpoint
DROP TABLE `SyncedObject`;--> statement-breakpoint
ALTER TABLE `__new_SyncedObject` RENAME TO `SyncedObject`;--> statement-breakpoint
PRAGMA foreign_keys=ON;