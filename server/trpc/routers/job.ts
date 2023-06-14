export const job = trpcRouter({
  list: trpcProcedure
    .input(
      zod.object({
        isFiltered: zod.boolean().optional(),
        searchKeyword: zod.string().optional(),
      }),
    )
    .query(({ input: { isFiltered, searchKeyword } }) => {
      const postedInPastHours = 1;
      return prisma.job.findMany({
        orderBy: { postedTime: 'desc' },
        where: {
          isFiltered,
          postedTime: {
            gte: new Date(Date.now() - postedInPastHours * 60 * 60 * 1000),
          },
          // If this condition remove, no data will be select on empty searchKeyword.
          // Because, in Prisma conditionals with no values return nothing.
          ...(searchKeyword
            ? {
                OR: [
                  {
                    title: {
                      contains: searchKeyword,
                    },
                  },
                  {
                    description: {
                      contains: searchKeyword,
                    },
                  },
                ],
              }
            : {}),
        },
      });
    }),
});
