import { useScheduler } from '#scheduler';

export default defineNitroPlugin(() => {
  const timeout = useRuntimeConfig().CRON_TIMEOUT;

  useScheduler()
    .run(async () => {
      console.info(new Date(), ': ', 'Executing job cron.');
      await checkJobs();
      console.info(new Date(), ': ', 'Executed job cron.');
    })
    .everyMinutes(Number(timeout));
});
