import { relations } from "drizzle-orm/relations";
import { user, chat, file, activity } from "./schema";

export const fileRelations = relations(file, ({ one }) => ({
	user: one(user, {
		fields: [file.userId],
		references: [user.id]
	}),
}));

export const activityRelations = relations(activity, ({ one }) => ({
	user: one(user, {
		fields: [activity.userId],
		references: [user.id]
	}),
}));

export const chatRelations = relations(chat, ({ one }) => ({
	user: one(user, {
		fields: [chat.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({ many }) => ({
	chats: many(chat),
	files: many(file),
	activities: many(activity)
}));
