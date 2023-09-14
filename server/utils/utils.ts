export { z as zod } from 'zod';

export {
  procedure as trpcProcedure,
  router as trpcRouter,
} from '~/server/trpc/trpc';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function promise<T>(
  callback: () => Promise<T>,
  logError = false,
): Promise<{
  data: T | null;
  error: unknown;
}> {
  try {
    const data = await callback();
    return { data, error: null };
  } catch (error) {
    if (logError) {
      console.error(error);
    }
    return { data: null, error };
  }
}

class PuppeteerError extends Error {
  constructor(name: string, error: Error) {
    super(error.message);
    this.name = name;
  }
}
export async function executePuppeteerCommand<T>(
  command: () => Promise<T>,
  commandName: string,
) {
  try {
    const data = await command();
    return data;
  } catch (error) {
    throw new PuppeteerError(commandName, error as Error);
  }
}
