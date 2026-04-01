const CACHE_NAME = "bloom-cache-v1";
const URLS_TO_CACHE = [
  "/bloom-pwa/",
  "/bloom-pwa/index.html"
  // Add more like "/bloom-pwa/styles.css" if you create separate files
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
