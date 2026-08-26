const CACHE_NAME = "overload-website-v9";

// Alle Dateien für den Offline-Betrieb inklusive ALLER Icons aus dem Explorer
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

  // Schriften & Material Symbols
  "./src/assets/fonts/Inter-VariableFont_opsz,wght.ttf",
  "./src/assets/fonts/InterTight-VariableFont_wght.ttf",
  "./src/assets/fonts/material-symbols-rounded-latin-standard-normal.woff2",

  // Kompletter Icon-Satz (alle 10 Dateien)
  "./src/assets/icons/app-icon-dark.svg",
  "./src/assets/icons/app-icon-light.svg",
  "./src/assets/icons/apple-touch-icon.png",
  "./src/assets/icons/favicon-192.png",
  "./src/assets/icons/favicon-512.png",
  "./src/assets/icons/favicon-dark.svg",
  "./src/assets/icons/favicon-light.svg",
  "./src/assets/icons/favicon.ico",
  "./src/assets/icons/favicon.svg",
  "./src/assets/icons/logo-dark.svg",
  "./src/assets/icons/pwa-icon-dark.svg",
  "./src/assets/icons/logo-light.svg",
  "./src/assets/icons/logo-text-dark.svg",
  "./src/assets/icons/logo-text-light.svg",
  "./src/assets/icons/text-logo-dark.svg",
  "./src/assets/icons/text-logo-light.svg"
];

// 1. Installation: Dateien cachen
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Overload SW] Speichere alle Assets & Icons im Cache...");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Aktivierung: Alten Cache bereinigen
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

// 3. Fetch-Strategie: Cache First mit Fallback
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("./404.html");
          }
        });
    })
  );
});