import { and, desc, eq, sql } from 'drizzle-orm';
import { jobs, selectJobSchema } from '~/server/drizzle/schema';

export const job = trpcRouter({
  list: trpcProcedure
    .input(selectJobSchema.pick({ filter: true, isViewed: true }))
    .query(async ({ input: { filter, isViewed } }) => {
      const data = await drizzle
        .select()
        .from(jobs)
        .orderBy(desc(jobs.postedTime))
        .where(and(eq(jobs.filter, filter), eq(jobs.isViewed, isViewed)));

      if (!isViewed) {
        await drizzle
          .update(jobs)
          .set({ isViewed: true })
          .where(and(eq(jobs.filter, filter), eq(jobs.isViewed, isViewed)));
      }
      return data;
    }),
  unviewed: trpcProcedure.query(async () => {
    const data = await drizzle
      .select({ count: sql<number>`count(${jobs.id})` })
      .from(jobs)
      .where(and(eq(jobs.filter, 'relevant'), eq(jobs.isViewed, false)));
    return data[0].count > 0;
  }),
});
