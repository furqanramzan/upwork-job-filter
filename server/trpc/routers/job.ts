import { and, desc, eq, gte } from 'drizzle-orm';
import { jobs, selectJobSchema } from '~/server/drizzle/schema';

export const job = trpcRouter({
  list: trpcProcedure
    .input(selectJobSchema.pick({ filter: true }))
    .query(({ input: { filter } }) => {
      const postedInPastHours = 1;
      return drizzle
        .select()
        .from(jobs)
        .orderBy(desc(jobs.postedTime))
        .where(
          and(
            eq(jobs.filter, filter),
            gte(
              jobs.postedTime,
              new Date(Date.now() - postedInPastHours * 60 * 60 * 1000),
            ),
          ),
        );
    }),
});
