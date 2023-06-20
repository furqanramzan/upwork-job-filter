import type { InferModel } from 'drizzle-orm';
import type { jobs } from '~/server/drizzle/schema';

export type Job = InferModel<typeof jobs>;
