import { integer, pgTable, varchar } from "drizzle-orm/pg-core";


export const tournaments = pgTable("tournaments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().check(`slug ~ '^[a-z0-9_-]+$'`),
    description: varchar({ length: 255 }).notNull(),
    logo: varchar({ length: 500 }).notNull(),
});

export const pools = pgTable("pools", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
});