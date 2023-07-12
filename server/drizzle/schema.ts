import { createSelectSchema } from 'drizzle-zod';
import {
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import type { InferModel } from 'drizzle-orm';

export const jobs = mysqlTable(
  'jobs',
  {
    id: serial('id').primaryKey(),
    url: varchar('url', { length: 256 }).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    postedTime: timestamp('posted_time').notNull(),
    filter: varchar('filter', {
      length: 30,
      enum: ['relevant', 'irrelevant', 'notsure', 'relevant-irrelevant'],
    }).notNull(),
  },
  (jobs) => ({
    urlIdx: uniqueIndex('urlIdx').on(jobs.url),
  }),
);
export type Job = InferModel<typeof jobs, 'select'>;
export const selectJobSchema = createSelectSchema(jobs);
