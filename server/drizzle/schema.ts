import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const jobs = sqliteTable(
  'jobs',
  {
    id: integer('id').primaryKey(),
    url: text('url').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    postedTime: integer('posted_time', { mode: 'timestamp' }).notNull(),
    isFiltered: integer('is_filtered', { mode: 'boolean' }).notNull(),
  },
  (jobs) => ({
    nameIdx: uniqueIndex('nameIdx').on(jobs.url),
  }),
);
