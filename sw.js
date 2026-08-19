const CACHE_NAME = "workout-tracker-v1";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/css/style.css",
  "./src/js/script.js",
  "./src/assets/fonts/Inter-VariableFont_opsz,wght.ttf",
  "./src/assets/fonts/InterTight-VariableFont_wght.ttf",
  "./src/assets/fonts/material-symbols-rounded-latin-standard-normal.woff2",
  "./src/assets/icons/logo-dark.svg",
  "./src/assets/icons/logo-light.svg",
  "./src/assets/icons/favicon.svg",
  "./src/assets/icons/favicon-192.png",
  "./src/assets/icons/favicon-512.png",
  "./src/assets/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME && cache.startsWith("workout-tracker-")) {
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
