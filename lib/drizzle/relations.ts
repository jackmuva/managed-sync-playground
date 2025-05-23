import { relations } from "drizzle-orm/relations";
import { user, chat, activity, file } from "./schema";

export const chatRelations = relations(chat, ({one}) => ({
	user: one(user, {
		fields: [chat.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	chats: many(chat),
	activities: many(activity),
	files: many(file),
}));

export const activityRelations = relations(activity, ({one}) => ({
	user: one(user, {
		fields: [activity.userId],
		references: [user.id]
	}),
}));

export const fileRelations = relations(file, ({one}) => ({
	user: one(user, {
		fields: [file.userId],
		references: [user.id]
	}),
}));