import process from 'node:process';
import { join } from 'node:path';
import { createConnection } from 'mysql2';
import { drizzle as drizzleOrm } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import * as schema from '~/server/drizzle/schema';

const connection = createConnection({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export const drizzle = drizzleOrm(connection, { schema, mode: 'planetscale' });

// this will automatically run needed migrations on the database
const { DRIZZLE_DIRECTORY } = useRuntimeConfig();
await migrate(drizzle, {
  migrationsFolder: join(DRIZZLE_DIRECTORY, './migrations'),
});
