const CACHE_NAME = "avn-v35-UNIT-UPDATE"; // bump when you update BUILD_VERSION or cached files
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'app.js',
  'data.csv',
  'data2.csv',
  'logo.png',
  'manifest.webmanifest',
  // Add other assets as needed
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        // Optionally cache new requests
        return fetchRes;
      });
    })
  );
});