import type { H3Event } from 'h3';
import type { inferAsyncReturnType } from '@trpc/server';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function createContext(_event: H3Event) {
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
