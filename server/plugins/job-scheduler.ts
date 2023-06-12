import { useScheduler } from '#scheduler';

export default defineNitroPlugin(() => {
  useScheduler()
    .run(() => {
      console.info('Executing job cron', new Date());
      return checkJobs();
    })
    .everyMinutes(3);
});
