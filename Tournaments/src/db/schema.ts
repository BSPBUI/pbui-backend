import { sql } from "drizzle-orm";
import { integer, pgTable, varchar, check } from "drizzle-orm/pg-core";


export const tournaments = pgTable("tournaments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    description: varchar({ length: 255 }).notNull(),
    logo: varchar({ length: 500 }).notNull(),
}, (table) => [
    check('slug_check', sql`${table.slug} ~ '^[a-z0-9_-]+$'`),
]);

export const pools = pgTable("pools", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
});