self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handler for PWA compliance
  event.respondWith(fetch(event.request).catch(() => {
    return new Response('Offline content not available');
  }));
});
