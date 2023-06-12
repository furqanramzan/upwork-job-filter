import { PrismaClient } from '@prisma/client';

export { z as zod } from 'zod';

export {
  procedure as trpcProcedure,
  router as trpcRouter,
} from '~/server/trpc/trpc';

export const prisma = new PrismaClient();

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function promise<T>(callback: () => Promise<T>): Promise<{
  data: T | null;
  error: unknown;
}> {
  try {
    const data = await callback();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
