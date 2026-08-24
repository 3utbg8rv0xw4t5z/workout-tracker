const CACHE_NAME = "overload-website-v1";

// Alle Dateien, die aktuell vorhanden sind und für den Offline-Betrieb gecacht werden sollen
const ASSETS_TO_CACHE = [
  // Basis-Dateien & Routing
  "./",
  "./index.html",
  "./404.html",
  "./manifest.json",
  "./robots.txt",
  "./sitemap.xml",

  // Stylesheet & Script
  "./src/css/style.css",
  "./src/js/script.js",

  // Schriften
  "./src/assets/fonts/Inter-VariableFont_opsz,wght.ttf",
  "./src/assets/fonts/InterTight-VariableFont_wght.ttf",
  "./src/assets/fonts/material-symbols-rounded-latin-standard-normal.woff2"

  // Hinweis: Sobald Icons (Favicons) oder Bilder im Ordner liegen,
  // fügst du sie einfach hier wieder mit an:
  // "./src/assets/icons/favicon.svg",
  // "./src/assets/icons/favicon-192.png",
  // "./src/assets/icons/favicon-512.png"
];

// 1. Installation: Dateien laden und im Cache ablegen
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Overload SW] Speichere Assets im Cache...");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Aktivierung: Alte Caches löschen, wenn sich CACHE_NAME ändert
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME && cache.startsWith("overload-website-")) {
              console.log("[Overload SW] Alten Cache entfernt:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. Fetch-Strategie: Cache First mit Netzwerk-Fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});