import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
  boolean,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

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
    isViewed: boolean('is_viewed').default(false).notNull(),
  },
  (jobs) => ({
    urlIdx: uniqueIndex('urlIdx').on(jobs.url),
  }),
);
export type Job = InferSelectModel<typeof jobs>;
export type InsertJob = InferInsertModel<typeof jobs>;
export const selectJobSchema = createSelectSchema(jobs);

export const tokens = mysqlTable('tokens', {
  id: serial('id').primaryKey(),
  endpoint: varchar('endpoint', { length: 256 }).notNull(),
  key: varchar('key', { length: 256 }).notNull(),
  auth: varchar('auth', { length: 256 }).notNull(),
});
export const tokenSchema = createInsertSchema(tokens);
