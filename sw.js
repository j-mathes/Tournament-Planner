/* Tournament Planner — Service Worker
 * Cache-first strategy for app shell; falls back to network for unknown requests.
 * Increment CACHE_VERSION when deploying changes to force cache refresh.
 */

var CACHE_VERSION = "tp-v1";
var APP_SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./styles.css",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_VERSION; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  // Only handle same-origin GET requests
  if (event.request.method !== "GET") { return; }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) { return cached; }
      return fetch(event.request).then(function (response) {
        if (response && response.status === 200 && response.type === "basic") {
          var clone = response.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function () {
        // Offline fallback: serve the app shell for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
