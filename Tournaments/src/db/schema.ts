import { integer, pgTable, varchar } from "drizzle-orm/pg-core";


export const tournaments = pgTable("tournaments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
});

export const pools = pgTable("pools", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
});