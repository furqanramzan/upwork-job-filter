import { useScheduler } from '#scheduler';

export default defineNitroPlugin(() => {
  useScheduler()
    .run(async () => {
      console.info('Executing job cron: ', new Date());
      await checkJobs();
      console.info('Executed job cron: ', new Date());
    })
    .everyMinutes(3);
});
