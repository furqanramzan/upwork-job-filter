export const job = trpcRouter({
  list: trpcProcedure
    .input(zod.object({ isFiltered: zod.boolean().optional() }))
    .query(({ input: { isFiltered } }) => {
      const postedInPastHours = 1;
      return prisma.job.findMany({
        orderBy: { postedTime: 'desc' },
        where: {
          isFiltered,
          postedTime: {
            gte: new Date(Date.now() - postedInPastHours * 60 * 60 * 1000),
          },
        },
      });
    }),
});
