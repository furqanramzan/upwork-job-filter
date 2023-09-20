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
