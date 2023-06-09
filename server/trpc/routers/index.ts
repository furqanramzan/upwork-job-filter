export const appRouter = trpcRouter({
  hello: trpcProcedure
    .input(
      zod.object({
        text: zod.string().nullish(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
        time: new Date(),
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
