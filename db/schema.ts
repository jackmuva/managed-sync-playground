import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";

export const user = sqliteTable("User", {
  id: text("id").notNull().primaryKey().$defaultFn(v4),
  email: text("email").notNull(),
  password: text("password"),
  externalId: text("externalId"),
});

export type User = InferSelectModel<typeof user>;

export const chat = sqliteTable(
  "Chat",
  {
    id: text("id").notNull().primaryKey().$defaultFn(v4),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    messages: text("messages", { mode: "json" }).$type<Message[]>().notNull(),
    userId: text("userId").notNull(),
    systemPrompt: text("systemPrompt").notNull(),
    tools: text("tools", { mode: "json" }).notNull(),
    modelName: text("modelName").notNull(),
    modelProvider: text("modelProvider").notNull(),
  },
  (table) => {
    return {
      // For foreign keys in SQLite, the recommended Drizzle approach:
      chatUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "Chat_userId_User_id_fk",
      }),
    };
  }
);

export type Chat = InferSelectModel<typeof chat>;

export const file = sqliteTable(
  "File",
  {
    id: text("id").notNull().primaryKey(),
    externalId: text("externalId").notNull(),
    name: text("name").notNull(),
    mimeType: text("mimeType").notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
    userId: text("userId").notNull(),
  },
  (table) => {
    return {
      FileUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "File_userId_User_id_fk",
      }),
    };
  }
);

export type File = InferSelectModel<typeof file>;

export const activity = sqliteTable(
  "Activity",
  {
    id: text("id").notNull().primaryKey().$defaultFn(v4),
    event: text("event").notNull(),
    source: text("source").notNull(),
    receivedAt: integer("receivedAt", { mode: "timestamp" }).notNull(),
    data: text("data", { mode: "json" }).notNull(),
    userId: text("userId").notNull(),
  },
  (table) => {
    return {
      ActivityUserIdUserIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "Activity_userId_User_id_fk",
      }),
    };
  }
);

export type Activity = InferSelectModel<typeof activity>;
