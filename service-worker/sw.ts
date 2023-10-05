import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

async function pushNotification(title: string, body: string) {
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  const activeClients = windowClients.filter(
    (x) => x.visibilityState === 'visible',
  );

  if (activeClients.length > 0) {
    activeClients.forEach((client) => client.postMessage(body));
  } else {
    await self.registration.showNotification(title, { body });
  }
}

self.addEventListener('push', (event: PushEvent) => {
  const payload = event.data?.json();
  const title: string = payload.title;
  const body: string = payload.body;

  event.waitUntil(pushNotification(title, body));
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(self.clients.openWindow('/'));
  event.notification.close();
});

self.addEventListener('activate', async () => {
  const { VAPID_PUBLIC_KEY } = await fetch('/api/config').then((response) =>
    response.json(),
  );

  if (VAPID_PUBLIC_KEY) {
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      })
      .then((subscription) => {
        const {
          endpoint,
          keys: { p256dh: key, auth },
        } = subscription.toJSON();

        fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify({ endpoint, key, auth }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              console.error('Error sending subscription details:', response);
            }
          })
          .catch((error) => {
            console.error('Error sending subscription details:', error);
          });
      })
      .catch((error) => {
        console.error({ error });
      });
  }
});

export {};
