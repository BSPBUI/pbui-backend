import { sql } from 'drizzle-orm';
import { pgTable, check, varchar, serial, integer, text } from 'drizzle-orm/pg-core';

export const tournaments = pgTable('tournaments', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 32 }).unique().notNull(),
    description: text('description'),
    logo: text('logo').default(''),
}, (table) => [
    check('slug_check', sql`${table.slug} ~ '^[a-z0-9_-]+$'`)
]);

export const pools = pgTable('pools', {
    id: serial('id').primaryKey(),
    tournamentId: integer('tourney_id')
        .references(() => tournaments.id, { onDelete: 'cascade' })
        .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    image: text('image'),
});

export const maps = pgTable('maps', {
    poolId: integer('pool_id')
        .references(() => pools.id, { onDelete: 'cascade' })
        .notNull(),
    hash: text('hash').primaryKey(),
    bsr: varchar('bsr', { length: 5 }).notNull(),
    name: text('name').notNull(),
    artist: text('artist').notNull(),
    length: varchar('length', { length: 5 }).notNull(),
    mapper: text('mapper').notNull(),
    coverUrl: text('coverUrl').notNull(),
    dateUploaded: text('date_uploaded').notNull(),
    bpm: varchar('bpm', { length: 4 }).notNull(),
    difficulty: varchar('difficulty', { length: 7 }).notNull(),
});