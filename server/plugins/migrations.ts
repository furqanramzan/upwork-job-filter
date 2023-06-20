import { join } from 'node:path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export default defineNitroPlugin(async () => {
  const { DRIZZLE_DIRECTORY } = useRuntimeConfig();
  await migrate(useDrizzle(), {
    migrationsFolder: join(DRIZZLE_DIRECTORY, './migrations'),
  });
});
