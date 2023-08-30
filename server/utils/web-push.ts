// @ts-expect-error
import webpush from 'web-push';
import { desc } from 'drizzle-orm';
import { tokens } from '../drizzle/schema';

export async function pushNotification(text: string) {
  const { APP_NAME, VAPID_EMAIL_ADDRESS, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } =
    useRuntimeConfig();
  if (!VAPID_EMAIL_ADDRESS || !VAPID_PRIVATE_KEY || !VAPID_PUBLIC_KEY) {
    return;
  }
  webpush.setVapidDetails(
    `mailto:${VAPID_EMAIL_ADDRESS}`,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
  );

  const token = (
    await drizzle.select().from(tokens).orderBy(desc(tokens.id))
  )[0];

  if (!token) {
    return;
  }

  return webpush.sendNotification(
    {
      endpoint: token.endpoint,
      keys: {
        auth: token.auth,
        p256dh: token.key,
      },
    },
    JSON.stringify({
      title: APP_NAME,
      body: text,
    }),
  );
}
