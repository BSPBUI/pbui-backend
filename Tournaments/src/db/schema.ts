import { sql } from "drizzle-orm";
import { integer, pgTable, varchar, check, jsonb } from "drizzle-orm/pg-core";


export const tournaments = pgTable("tournaments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    description: varchar({ length: 255 }).notNull(),
    logo: varchar({ length: 500 }).notNull(),
    pools: integer().array().notNull(),
    flow: jsonb("flow").notNull()
}, (table) => [
    check('slug_check', sql`${table.slug} ~ '^[a-z0-9_-]+$'`),
    check('flow_check', sql`
        jsonb_typeof(${table.flow}) = 'array' AND
        NOT EXISTS (
            SELECT * FROM jsonb_array_elements(${table.flow}) AS elem
            WHERE
                (elem->>'player')::int NOT IN (0, 1, 2) OR
                (elem->>'action') NOT IN ('pick', 'ban')
        )
    `)
]);

export const pools = pgTable("pools", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
});