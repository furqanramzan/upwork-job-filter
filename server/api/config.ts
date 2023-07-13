export default defineEventHandler(() => {
  const { VAPID_PUBLIC_KEY } = useRuntimeConfig();

  return {
    VAPID_PUBLIC_KEY,
  };
});
