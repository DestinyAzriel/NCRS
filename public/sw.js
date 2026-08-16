// Nyanthepa Community Radio Service Worker (Offline & Flaky 3G Resilience)
const CACHE_NAME = 'nyanthepa-offline-v1';
const OFFLINE_ROUTES = [
  '/',
  '/news',
  '/programs',
  '/sports',
  '/about',
  '/contacts',
  '/feedback',
  '/privacy',
  '/terms',
];

// Install: Cache core layout and broadcast pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_ROUTES);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate for pages and API endpoints
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Do not intercept streaming audio (Zen/Icecast chunks)
  if (url.pathname.endsWith('.mp3') || url.pathname.includes('/live')) {
    return;
  }

  // Handle standard GET navigation and API data
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Return cached response when completely offline
              return cachedResponse;
            });

          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
