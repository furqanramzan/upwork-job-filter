import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

async function checkClientIsVisible() {
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  return windowClients.some((x) => x.visibilityState === 'visible');
}

self.addEventListener('push', async (event: PushEvent) => {
  const payload = event.data?.json();
  const title = payload.title;
  const options: NotificationOptions = {
    body: payload.body,
  };

  if (await checkClientIsVisible()) {
    event.waitUntil(
      self.clients
        .matchAll()
        .then((clients) =>
          clients.forEach((client) => client.postMessage(options.body)),
        ),
    );
  } else {
    event.waitUntil(self.registration.showNotification(title, options));
  }
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
