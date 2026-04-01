const CACHE_NAME = "bloom-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html"
  // If you later move CSS/JS to separate files, add them here, e.g.:
  // "/styles.css",
  // "/main.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // If we have it in cache, use it; otherwise go to network
      return response || fetch(event.request);
    })
  );
});