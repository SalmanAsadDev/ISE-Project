self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'notify') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: '/css/icon.png',
    });
  }
});
