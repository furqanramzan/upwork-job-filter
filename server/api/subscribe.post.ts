import { tokenSchema, tokens } from '../drizzle/schema';

export default defineEventHandler(async (event) => {
  const values = tokenSchema.parse(await readBody(event));
  await drizzle.insert(tokens).values(values);
  return {
    success: true,
  };
});
