import type { inferAsyncReturnType } from '@trpc/server';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function createContext() {
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
