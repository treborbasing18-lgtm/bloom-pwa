// Bloom Service Worker — v1
// Caches core app files for offline use.

const CACHE_NAME = 'bloom-v1';

const CORE_FILES = [
  './bloom.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  // Audio files — add your actual filenames here:
  './notify.mp3',
  './ocean.mp3',
  './rain.mp3',
  './fireplace.mp3',
  './meditation.mp3',
];

// Install: cache all core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // addAll will fail silently for missing audio files;
      // wrap each individually so a missing mp3 doesn't break the SW.
      return Promise.allSettled(
        CORE_FILES.map(file => cache.add(file).catch(() => {}))
      );
    })
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful GET responses on the fly
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback: return the main HTML for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./bloom.html');
        }
      });
    })
  );
});
