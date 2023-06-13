export const job = trpcRouter({
  list: trpcProcedure.query(() => {
    return prisma.job.findMany({ orderBy: { postedTime: 'desc' } });
  }),
});
