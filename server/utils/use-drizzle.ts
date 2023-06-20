import { join } from 'node:path';
import { drizzle as drizzleOrm } from 'drizzle-orm/better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

// @ts-expect-error
import Database from 'better-sqlite3';

export function useDrizzle() {
  const { DRIZZLE_DIRECTORY } = useRuntimeConfig();
  const sqlite = new Database(join(DRIZZLE_DIRECTORY, 'db.sqlite'));
  const drizzle: BetterSQLite3Database = drizzleOrm(sqlite, {
    logger: process.dev,
  });
  return drizzle;
}
