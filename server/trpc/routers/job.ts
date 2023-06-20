import { and, desc, eq, gte } from 'drizzle-orm';
import { jobs } from '~/server/drizzle/schema';

export const job = trpcRouter({
  list: trpcProcedure
    .input(
      zod.object({
        isFiltered: zod.boolean(),
      }),
    )
    .query(({ input: { isFiltered } }) => {
      const postedInPastHours = 1;
      const drizzle = useDrizzle();

      return drizzle
        .select()
        .from(jobs)
        .orderBy(desc(jobs.postedTime))
        .where(
          and(
            eq(jobs.isFiltered, isFiltered),
            gte(
              jobs.postedTime,
              new Date(Date.now() - postedInPastHours * 60 * 60 * 1000),
            ),
          ),
        )
        .all();
    }),
});
