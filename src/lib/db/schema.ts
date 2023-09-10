import { pgTable, integer, text, serial, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	joined: timestamp("joined").notNull().defaultNow(),
	githubId: integer("github_id").notNull(),
});

export const fiddles = pgTable("fiddles", {
	id: serial("id").primaryKey(),
	userId: integer('user_id').references(() => users.id),
	created: timestamp("created").notNull().defaultNow(),
	updated: timestamp("updated").notNull().defaultNow(),
	title: integer("title").notNull(),
	description: text("description").notNull(),
});

export const fiddleFile = pgTable("fiddle_files", {
	id: serial("id").primaryKey(),
	fiddleId: integer('fiddle_id').references(() => fiddles.id),
	path: text("path").notNull(),
	content: text("content").notNull(),
});
