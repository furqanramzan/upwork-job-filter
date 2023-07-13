import { and, desc, eq } from 'drizzle-orm';
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
});
