import type { inferRouterInputs } from '@trpc/server';
import type { AppRouter } from '~/server/trpc/routers';

export type RouterInput = inferRouterInputs<AppRouter>;
