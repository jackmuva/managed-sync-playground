import { sqliteTable, AnySQLiteColumn, text, foreignKey, integer } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const user = sqliteTable("User", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	password: text(),
	externalId: text(),
});

export const chat = sqliteTable("Chat", {
	id: text().primaryKey().notNull(),
	createdAt: integer().notNull(),
	messages: text().notNull(),
	userId: text().notNull().references(() => user.id),
	systemPrompt: text().notNull(),
	tools: text().notNull(),
	modelName: text().notNull(),
	modelProvider: text().notNull(),
});

export const activity = sqliteTable("Activity", {
	id: text().primaryKey().notNull(),
	event: text().notNull(),
	source: text().notNull(),
	receivedAt: integer().notNull(),
	data: text().notNull(),
	userId: text().notNull().references(() => user.id),
});

export const file = sqliteTable("File", {
	id: text().primaryKey().notNull(),
	externalId: text().notNull(),
	createdAt: integer().notNull(),
	updatedAt: integer().notNull(),
	source: text().notNull(),
	messages: text().notNull(),
	userId: text().notNull().references(() => user.id),
});