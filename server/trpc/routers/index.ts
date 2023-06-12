import { job } from './job';

export const appRouter = trpcRouter({ job });

// export type definition of API
export type AppRouter = typeof appRouter;
