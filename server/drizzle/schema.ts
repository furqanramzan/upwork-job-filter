import {
  boolean,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

export const jobs = mysqlTable(
  'jobs',
  {
    id: serial('id').primaryKey(),
    url: varchar('url', { length: 256 }).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    postedTime: timestamp('posted_time').notNull(),
    isFiltered: boolean('is_filtered').notNull(),
  },
  (jobs) => ({
    urlIdx: uniqueIndex('urlIdx').on(jobs.url),
  }),
);
